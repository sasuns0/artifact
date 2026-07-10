# Artifact — Product Direction & Build Plan

This document captures the recommended path for building **Artifact**, a self-hosted knowledge base platform with real-time collaboration, full document search, and a local-first AI assistant.

---

## 1. Build Order: Finish the Core Before Chasing AI

You currently have three half-finished headline features: WebSocket sessions, Docker packaging, and AI. The highest-value next step is to finish **collaboration** first, because it is the biggest differentiator and the foundation everything else rests on.

### Phase A — Real-Time Sessions (Next 2–4 Weeks)

1.  **Authentication + document ownership**
    - Add simple email/password or local passkey authentication.
    - The session manager needs to know who is in a room.

2.  **Document model with access control**
    - Add `ownerId`, `collaborators`, and `isPublic` fields to the document schema.

3.  **WebSocket rooms by document ID**
    - Change the `/ws` endpoint to `/ws/:documentId`.
    - On connect, validate that the user is allowed to access that specific document.

4.  **Replace the plain textarea with a CRDT editor**
    - Use **Y.js + Lexical** or **Blocknote** (built on ProseMirror and easier to wire to Y.js).
    - This gives you live multi-user editing, cursors, and conflict-free merging.

5.  **Presence and invites**
    - Show active users and cursor positions.
    - Add an invite link: `artifact.local/join/:token` that grants temporary access to just that document.

> **Note:** Skip Socket.IO since you already have `@fastify/websocket`. You can run a minimal `y-websocket` server implementation directly inside Fastify.

### Phase B — Better Search (After Collaboration Works)

1.  Polish the existing Postgres full-text search:
    - Add headline highlighting.
    - Add `pg_trgm` for fuzzy typo matching.
    - Tune ranking (`ts_rank` / `ts_rank_cd`).

2.  Add semantic search only after FTS is solid:
    - Use a small embedding model like `Xenova/all-MiniLM-L6-v2`.
    - Store vectors in `pgvector` alongside your existing Postgres database, or use a lightweight separate store like `sqlite-vec` to reduce pressure on the main DB process.

### Phase C — Local AI Assistant (After Search Is Done)

Build a simple RAG pipeline:

- User asks a question.
- Embed the question.
- Retrieve top-K documents.
- Send the retrieved context to **Ollama** with a small local model.

On a Raspberry Pi 3B+, realistic local models are tiny: `qwen2.5:0.5b`, `gemma2:2b`, or `llama3.2:1b`. Anything larger will cause swapping and poor performance. Make the Ollama URL configurable so users can run the model on a more powerful machine on the same LAN — the data still stays local.

---

## 2. Raspberry Pi 3B+ Specific Advice

Your instinct about Docker on a 1GB Pi is correct. Do not optimize for Docker right now. The current dev-mode images with Node and full dependency installs would consume most of the available RAM.

### Recommended Pi Deployment

- **Skip Docker for now.** Build the Next.js frontend as a static export (`output: 'export'`), then serve it from Fastify or a tiny Caddy reverse proxy.
- **Deploy as systemd services** managed by PM2. Provide a simple `install.sh` instead of a Docker Compose file.
- **Avoid Redis** unless it becomes strictly necessary. Use a Postgres-backed job queue like **`pg-boss`** for background embedding jobs.
- **Tune Postgres aggressively**:
  - `shared_buffers=128MB`
  - `work_mem=4MB`
  - Disable unnecessary logging
  - Do not run Postgres in Docker with its own overhead
- **Build on a fast machine, deploy artifacts.** Do not run `pnpm install` or `next build` directly on the Pi.

Docker can be revisited later for x86/ARM64 cloud deployments, but for the Pi 3B+, raw systemd + static binaries will be lighter and faster.

---

## 3. Differentiation from Notion

Notion is a polished general-purpose workspace. You will not beat it at databases, templates, or ecosystem breadth. Differentiate by being **opinionated, local, and conversation-driven**.

Pick 2–3 of these features and make them excellent:

| Feature | Why It Differentiates |
|---|---|
| **Bidirectional links + graph view** | Obsidian-style `[[Note]]` links with an auto-generated knowledge graph. Notes become a network, not a folder tree. |
| **Session rooms** | A document becomes an ephemeral "room" that someone joins via a link without needing an account. Great for pair writing or teaching. |
| **Temporal serendipity** | "On this day last year..." and "notes from around this date" surfaced automatically. |
| **AI that knows your corpus** | Notion AI is cloud-based. Yours is local RAG: ask questions across your entire knowledge base and receive cited answers. |
| **Markdown-native + Obsidian import** | Drag an entire `.md` vault in, preserving tags, frontmatter, and image assets. |
| **Slash and inline AI commands** | `/summarize`, `/continue`, `/find related`, `/create flashcard`. Keep the assistant inside the editor. |
| **Git-backed document history** | Optional local Git snapshots of the notes folder for true offline history and diffing. |
| **CLI / curl-first API** | Every feature is reachable via API, so power users can script their own workflows. |

---

## 4. Suggested Stack for the Next Stretch

| Layer | Tool | Reason |
|---|---|---|
| Editor | **Blocknote** or **Lexical + Y.js** | Easier CRDT integration than Slate |
| Real-time | `@fastify/websocket` + `y-websocket` server | Reuses the existing Fastify server, no extra process |
| Auth | **Lucia** or custom JWT sessions | Lightweight, fits Fastify well |
| Queue | **`pg-boss`** | No Redis memory overhead |
| Embeddings | **`@xenova/transformers`** | Runs locally, supports small models |
| Vector store | `pgvector` or `sqlite-vec` | Choose based on Postgres memory budget |
| LLM | **Ollama** via HTTP | Configurable URL, can run anywhere on the LAN |
| Deployment | systemd + PM2 + static build | Pi-friendly, low overhead |

---

## 5. Bottom Line

- **Next build step:** finish auth, document-level access, `/ws/:documentId` rooms, and a Y.js-based editor. That alone makes Artifact feel alive and different.
- **Defer:** heavy Docker polish, large local LLMs, and advanced vector search until the collaboration layer is solid.
- **Long-term identity:** a self-hosted, local-first knowledge base that treats real-time collaboration and an AI assistant as first-class citizens, not add-ons.
