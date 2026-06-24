# Semantic Search Engine — Development Roadmap

## Phase 1: Version 0.0.1 — The Barebones Plumbing (Your Starting Point)

**Focus:** HTTP routing, standard database connections, and basic keyword retrieval.

### Frontend
A basic Next.js page containing a plain textarea input, a standard submit button, and a raw search results list feed.

### Backend
A lightweight Express application managing a native node-postgres database connection pool.

### Database
A single Postgres table storing raw text strings (title, content).

### Search Engine
Postgres Full-Text Search (FTS) using `to_tsvector` and `plainto_tsquery` to match exact keyword variations.

**Why this layer matters:** You validate that your network calls, CORS headers, state bindings, and relational DB inserts function perfectly before messing with asynchronous pipelines or machine learning libraries.

---

## Phase 2: Version 0.1.0 — The Vector Upgrade

**Focus:** Transitioning from keyword string lookup to deep semantic comprehension.

### Frontend
No major UI modifications are made; you keep the exact same simple submission form and search bar from v0.0.1.

### Backend
You introduce the `@xenova/transformers` library into your primary Express thread. When a user submits text or a search phrase, the CPU generates an in-memory 384-dimensional mathematical array.

### Database
You update your Postgres instance by adding the `pgvector` extension and a new `embedding vector(384)` column to the documents table.

### Search Engine
You swap out your keyword FTS query for a cosine distance comparison query using the `<=>` vector operator.

**Why this layer matters:** You learn the underlying mechanics of high-dimensional spatial mathematics and semantic retrieval without needing to configure complex external background workers.

---

## Phase 3: Version 0.2.0 — Asynchronous Task Offloading

**Focus:** Unblocking the main execution thread to maximize API server responsiveness.

### Frontend
You add small status UI feedback flags to documents (e.g., "Indexing..." → "Ready for Search").

### Backend
You integrate Redis and BullMQ into your Express environment. Instead of forcing your primary API thread to sit and wait while the CPU calculates heavy 384-dimensional vectors, the API immediately throws the text payload onto an async Redis task queue and returns a fast `202 Accepted` status code.

### Worker Layer
You build a decoupled Node.js background process (a worker ring) that listens to the BullMQ stream, processes the embeddings out-of-band, and writes the resulting vector back to Postgres once it's completed.

**Why this layer matters:** This teaches you the production architectural patterns used by large-scale enterprise companies to isolate heavy processing bottlenecks from user-facing real-time endpoints.

---

## Phase 4: Version 0.3.0 — The Live Collaboration Engine

**Focus:** Upgrading the platform from a static notepad to a fluid, multi-user workspace.

### Frontend
You upgrade the basic HTML textarea into a modern block-based rich text workspace engine (such as Lexical or Slate.js) and integrate the `Y.js` CRDT tracking framework.

### Backend
You introduce `socket.io` into your Express server to run a state-synchronization layer.

### Data Synchronization
When multiple users open the same document, their local application modifications are sent over active WebSockets as tiny byte-deltas. The server broadcasts these deltas, and `Y.js` merges the changes directly on everyone's screens without conflicts. You also introduce live cursor tracking tracks so users can see active mouse paths.

**Why this layer matters:** You learn how to master persistent, stateful socket connections, manage client-side state machine memory, and process high-concurrency real-time operational streams.

---

## Phase 5: Version 1.0.0 — The Enterprise-Ready Privacy Perimeter

**Focus:** Securing multi-tenant separation, deploying local intelligence, and enforcing full isolation.

### Multi-Tenancy & RBAC
You overhaul the database schema to support secure multi-organization structures. Users are assigned strict Owner, Editor, or Viewer execution privileges via security middleware to prevent database cross-tenant exposure.

### Air-Gapped AI Infrastructure
You replace the local JavaScript in-memory inference pipeline with an independent, containerized Ollama node sitting safely inside your network perimeter. This allows your background workers to run deep retrieval-augmented generation (RAG) tasks using large models like `llama3:8b`.

### The Complete Search Engine
You unify your work from Phase 1 and Phase 2. Your database now runs a Hybrid RRF Search Engine that simultaneously scans exact text matches (FTS) and concept targets (Vectors), producing a perfect combined result list.

### The Ops Network Perimeter
You package your React interface, Express API gateways, Redis message streams, Postgres instances, and local Ollama model clusters into a completely air-gapped Docker Compose manifest featuring strict network isolation rules (`internal: true`).
