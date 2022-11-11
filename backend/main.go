package main

import (
	"context"
	"encoding/json"
	"fmt"
	"log"
	"net/http"
	"os"
	"os/signal"
	"time"

	"github.com/coreos/go-oidc"
	"github.com/go-chi/chi/v5"
	"github.com/go-chi/chi/v5/middleware"
	"github.com/go-chi/cors"
)

const (
	port = 8080
)

var (
	idTokenVerifier *oidc.IDTokenVerifier
)

func main() {
	ctx, cancel := signal.NotifyContext(context.Background(), os.Interrupt, os.Kill)
	defer cancel()

	provider, err := oidc.NewProvider(ctx, `https://access.line.me`)
	if err != nil {
		log.Fatalf("oidc.NewProvider: err: %v", err)
	}
	idTokenVerifier = provider.Verifier(&oidc.Config{
		ClientID: os.Getenv("LIFF_CLIENT_ID"),
	})

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
		w.WriteHeader(http.StatusOK)
		w.Write([]byte("healthy"))
	})
	r.Post("/verify", func(w http.ResponseWriter, r *http.Request) {
		var reqBody struct {
			IDToken string `json:"idToken"`
		}
		if err := json.NewDecoder(r.Body).Decode(&reqBody); err != nil {
			log.Printf("json.Decode: err: %v", err)
			w.WriteHeader(http.StatusInternalServerError)
			return
		}

		idToken, err := idTokenVerifier.Verify(r.Context(), reqBody.IDToken)
		if err != nil {
			log.Printf("idTokenVerifier.Verify: err: %v", err)
			w.WriteHeader(http.StatusInternalServerError)
			return
		}

		log.Printf("LINE UID: %v", idToken.Subject)

		respBody := map[string]interface{}{}
		if err := idToken.Claims(&respBody); err != nil {
			log.Printf("idToken.Claims: err: %v", err)
			w.WriteHeader(http.StatusInternalServerError)
			return
		}

		b, err := json.Marshal(respBody)
		if err != nil {
			log.Printf("json.Marshal: err: %v", err)
			w.WriteHeader(http.StatusInternalServerError)
			return
		}

		w.WriteHeader(http.StatusOK)
		w.Write(b)
	})

	return r
}
