package main

import (
	"context"
	"encoding/json"
	"fmt"
	"io"
	"log"
	"net/http"
	"net/url"
	"os"
	"os/signal"
	"time"

	"github.com/go-chi/chi/v5"
	"github.com/go-chi/chi/v5/middleware"
	"github.com/go-chi/cors"
)

const (
	port = 8080
)

func main() {
	ctx, cancel := signal.NotifyContext(context.Background(), os.Interrupt, os.Kill)
	defer cancel()

	server := &http.Server{
		Addr:    fmt.Sprintf(":%d", port),
		Handler: newRouter(),
	}

	go func() {
		<-ctx.Done()
		ctx, cancel := context.WithTimeout(context.Background(), 5*time.Second)
		defer cancel()
		if err := server.Shutdown(ctx); err != nil {
			log.Print(err)
		}
	}()

	log.Printf("Server listening on port %d", port)
	if err := server.ListenAndServe(); err != nil {
		log.Print(err)
	}
}

func newRouter() http.Handler {
	r := chi.NewRouter()
	r.Use(middleware.Recoverer, middleware.Logger)
	r.Use(cors.Handler(cors.Options{
		AllowedOrigins: []string{"https://toga4-liff-sandbox.web.app"},
	}))
	r.Get("/_healthz", func(w http.ResponseWriter, r *http.Request) {
		w.WriteHeader(200)
		w.Write([]byte("healthy"))
	})
	r.Post("/verify", func(w http.ResponseWriter, r *http.Request) {
		var reqBody struct {
			IDToken string `json:"idToken"`
		}
		if err := json.NewDecoder(r.Body).Decode(&reqBody); err != nil {
			log.Printf("json.Decode: err: %v", err)
			w.WriteHeader(500)
			return
		}

		data := url.Values{}
		data.Set("id_token", reqBody.IDToken)
		data.Set("client_id", os.Getenv("LIFF_CLIENT_ID"))

		resp, err := http.DefaultClient.PostForm("https://api.line.me/oauth2/v2.1/verify", data)
		if err != nil {
			log.Printf("httpClient.PostForm: err: %v", err)
			w.WriteHeader(500)
			return
		}
		defer func() {
			_, _ = io.Copy(io.Discard, resp.Body)
			_ = resp.Body.Close()
		}()

		b, err := io.ReadAll(resp.Body)
		if err != nil {
			log.Printf("io.ReadAll(resp.Body): err: %v", err)
			w.WriteHeader(500)
			return
		}

		w.WriteHeader(resp.StatusCode)
		w.Write(b)
	})

	return r
}
