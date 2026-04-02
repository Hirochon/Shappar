package main

import (
	"context"
	"log/slog"
	"net/http"
	"os"
	"os/signal"
	"strings"
	"syscall"
	"time"

	"cloud.google.com/go/compute/metadata"
	"cloud.google.com/go/profiler"
	metricExporter "github.com/GoogleCloudPlatform/opentelemetry-operations-go/exporter/metric"
	traceExporter "github.com/GoogleCloudPlatform/opentelemetry-operations-go/exporter/trace"
	"github.com/Hirochon/Shappar/core/util/code"
	"github.com/Hirochon/Shappar/core/util/config"
	"github.com/Hirochon/Shappar/core/util/log"
	"go.opentelemetry.io/otel"
	"go.opentelemetry.io/otel/attribute"
	"go.opentelemetry.io/otel/propagation"
	sdkmetric "go.opentelemetry.io/otel/sdk/metric"
	"go.opentelemetry.io/otel/sdk/resource"
	"go.opentelemetry.io/otel/sdk/trace"
	semconv "go.opentelemetry.io/otel/semconv/v1.26.0"
	_ "go.uber.org/automaxprocs"
	"google.golang.org/api/option"
)

const shutdownTimeout = 10 * time.Second

// build時にldflagsで設定される
var version string

func main() {
	ctx, stop := signal.NotifyContext(context.Background(), syscall.SIGINT, syscall.SIGTERM)
	defer stop()

	time.Local = time.FixedZone("JST", 9*60*60)

	log.Info(ctx, "Starting server...", slog.String("version", version))
	serviceName := os.Getenv("K_SERVICE")
	projectID := getProjectID(ctx)

	// Cloud Profiler
	startProfiler(ctx, serviceName)

	// Open Telemetry
	res := createResource(ctx, serviceName, projectID)
	if meterProvider, err := getOtlpMeterProvider(projectID, res); err == nil && meterProvider != nil {
		defer func() {
			ctx, cancel := context.WithTimeout(context.Background(), shutdownTimeout)
			defer cancel()
			if err := meterProvider.Shutdown(ctx); err != nil {
				log.Warn(ctx, code.WrapError(err, code.Internal, "failed to shutdown meter provider."))
			}
			log.Info(ctx, "meter provider stopped.")
		}()
		otel.SetMeterProvider(meterProvider)
	} else if err != nil {
		log.Error(ctx, err)
	}
	if traceProvider, err := getOtlpTraceProvider(projectID, res); err == nil && traceProvider != nil {
		defer func() {
			ctx, cancel := context.WithTimeout(context.Background(), shutdownTimeout)
			defer cancel()
			if err := traceProvider.Shutdown(ctx); err != nil {
				log.Error(ctx, code.WrapError(err, code.Internal, "failed to shutdown tracer provider."))
			}
			log.Info(ctx, "tracer provider stopped.")
		}()
		otel.SetTracerProvider(traceProvider)
		otel.SetTextMapPropagator(propagation.TraceContext{})
	} else if err != nil {
		log.Error(ctx, err)
	}

	injected := inject()
	defer func() {
		injected.shutdown()
		log.Info(ctx, "all injected dependencies stopped.")
	}()
	srv := newServer(injected)

	go func() {
		defer stop()
		log.Info(ctx, "HTTP server started.", slog.String("addr", srv.Addr))
		if err := srv.ListenAndServe(); err != nil && err != http.ErrServerClosed {
			log.Error(ctx, code.WrapError(err, code.Internal, "HTTP server stopped with error."))
		}
	}()

	<-ctx.Done()
	ctx, cancel := context.WithTimeout(context.Background(), shutdownTimeout)
	defer cancel()

	log.Info(ctx, "gracefully shutting down server...", slog.String("timeout", shutdownTimeout.String()))

	if err := srv.Shutdown(ctx); err != nil {
		log.Error(ctx, code.WrapError(err, code.Internal, "failed to shutdown HTTP server."))
	}
	log.Info(ctx, "HTTP server stopped.")
}

func startProfiler(ctx context.Context, serviceName string) {
	if serviceName == "" {
		log.Info(ctx, "Skipping profiler startup because K_SERVICE is empty.")
		return
	}

	var noAllocProfiling, noHeapProfiling bool
	if config.GetEnv() == config.EnvProduction {
		noAllocProfiling = true
		noHeapProfiling = true
	}
	if err := profiler.Start(profiler.Config{
		NoAllocProfiling: noAllocProfiling,
		NoHeapProfiling:  noHeapProfiling,
		Service:          serviceName,
		ServiceVersion:   version,
	}); err != nil {
		log.Error(ctx, code.WrapError(err, code.Internal, "failed to start profiler."))
	}
}

func createResource(ctx context.Context, serviceName, version string) *resource.Resource {
	instanceID := getInstanceID(ctx)
	zone := getZone(ctx)

	attrs := []attribute.KeyValue{
		semconv.ServiceName(serviceName),
		semconv.ServiceVersion(version),
		semconv.ServiceNamespace(serviceName),
	}
	if instanceID != "" {
		attrs = append(attrs, semconv.HostID(instanceID))
	}
	if region := zoneToRegion(zone); region != "" {
		attrs = append(attrs, semconv.CloudRegion(region))
	}
	if zone != "" {
		attrs = append(attrs, semconv.CloudAvailabilityZone(zone))
	}

	return resource.NewSchemaless(attrs...)
}

func getOtlpTraceProvider(projectID string, res *resource.Resource) (*trace.TracerProvider, error) {
	if projectID == "" {
		return nil, nil
	}
	exporter, err := traceExporter.New(traceExporter.WithProjectID(projectID),
		traceExporter.WithTraceClientOptions([]option.ClientOption{
			option.WithTelemetryDisabled(),
		}))
	if err != nil {
		return nil, code.WrapError(err, code.Internal, "failed to create trace exporter")
	}

	p := trace.NewTracerProvider(
		trace.WithResource(res),
		trace.WithBatcher(exporter),
		trace.WithSampler(trace.ParentBased(trace.NeverSample())),
	)
	return p, nil
}

func getOtlpMeterProvider(projectID string, res *resource.Resource) (*sdkmetric.MeterProvider, error) {
	if projectID == "" {
		return nil, nil
	}
	exporter, err := metricExporter.New(metricExporter.WithProjectID(projectID),
		metricExporter.WithMonitoringClientOptions(option.WithTelemetryDisabled()),
	)
	if err != nil {
		return nil, code.WrapError(err, code.Internal, "failed to create metric exporter")
	}
	p := sdkmetric.NewMeterProvider(
		sdkmetric.WithResource(res),
		sdkmetric.WithReader(sdkmetric.NewPeriodicReader(exporter, sdkmetric.WithInterval(5*time.Minute))),
	)
	return p, nil
}

func getProjectID(ctx context.Context) string {
	projectID, err := metadata.ProjectIDWithContext(ctx)
	if err != nil {
		log.Warn(ctx, code.WrapError(err, code.Internal, "failed to get project ID; continuing without GCP telemetry"))
		return ""
	}
	return projectID
}

func getInstanceID(ctx context.Context) string {
	instanceID, err := metadata.InstanceIDWithContext(ctx)
	if err != nil {
		log.Warn(ctx, code.WrapError(err, code.Internal, "failed to get instanceID; continuing without host metadata"))
		return ""
	}
	return instanceID
}

func getZone(ctx context.Context) string {
	zone, err := metadata.ZoneWithContext(ctx)
	if err != nil {
		log.Warn(ctx, code.WrapError(err, code.Internal, "failed to get zone; continuing without zone metadata"))
		return ""
	}
	return zone
}

func zoneToRegion(zone string) string {
	parts := strings.Split(zone, "-")
	if len(parts) < 2 {
		return ""
	}
	return strings.Join(parts[:2], "-")
}
