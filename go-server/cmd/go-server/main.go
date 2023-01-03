package main

import (
	"log"

	"github.com/Hirochon/Shappar/go-server/internal/ui"
)

func main() {
	shapparServer, err := ui.NewShapparServer(ui.NewShapparAPI())
	if err != nil {
		log.Fatalln(err)
	}
	defer shapparServer.Shutdown()

	if err := shapparServer.Serve(); err != nil {
		log.Fatalln(err)
	}
}
