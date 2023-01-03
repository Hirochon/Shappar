package ui

import (
	"io"
	"net/http"
	"net/http/httptest"
	"testing"

	"github.com/Hirochon/Shappar/go-server/internal/ui/gen/models"
	"github.com/Hirochon/Shappar/go-server/internal/ui/gen/restapiv1/operations/administrations"
)

func TestServer(t *testing.T) {
	t.Parallel()
	shapparAPI := NewShapparAPI()
	shapparServer, err := NewShapparServer(shapparAPI)
	if err != nil {
		t.Fatalf("本テストとは関係ないエラーが発生しました: %v", err)
	}
	handler := shapparServer.GetHandler()
	testServer := httptest.NewServer(handler)
	defer testServer.Close()

	params := administrations.NewGetAPIV1HealthParams()
	params.HTTPRequest = httptest.NewRequest(http.MethodGet, "http://example.com", nil)
	resp := healthCheck(params)
	w := httptest.NewRecorder()
	resp.WriteResponse(w, shapparAPI.JSONProducer)

	if w.Result().StatusCode != http.StatusOK {
		t.Errorf("Health Checkのステータスコードが異常です: %v", w.Code)
	}
	got, err := io.ReadAll(w.Result().Body)
	if err != nil {
		t.Errorf("Health Checkのレスポンスボディの読み込みに失敗しました: %v", err)
	}
	unmarshaledGot := models.HealthCheck{}
	err = unmarshaledGot.UnmarshalJSON(got)
	if err != nil {
		t.Errorf("Health CheckのレスポンスボディのUnmarshalに失敗しました: %v", err)
	}
	if unmarshaledGot.Status != "OK" {
		t.Errorf("Health Checkのレスポンスボディが異常です: %v", unmarshaledGot)
	}
}
