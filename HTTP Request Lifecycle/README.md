# Failure-Aware Raw Node.js HTTP Server

A correctness-first HTTP server built using Node.js native `http` module (no Express) to demonstrate safe request handling, failure control, and production-style backend behavior.

## Why This Exists

Most backend apps break under:
- hanging requests
- double responses
- bad input
- slow handlers
- unsafe shutdowns

This project handles those problems at the protocol level.

## Key Features

• Stream-based body parsing  
• Correct HTTP status codes  
• Per-request timeout protection  
• Double-response prevention  
• Slow handler safety  
• Graceful shutdown with in-flight request draining  

## Endpoints

GET /health → 200 OK  

POST /login  
Body:
{
  "email": "admin@test.com",
  "password": "secret"
}

Responses:
- 200 success  
- 422 missing fields  
- 401 invalid credentials  
- 400 malformed JSON  
- 413 payload too large  

GET /slow → triggers timeout (408)

## Why Raw Node (No Express)

To expose and control:
- request lifecycle
- async race conditions
- failure handling
- protocol correctness

## Run

node server.js

Server runs on http://localhost:3000