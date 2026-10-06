# Agentic Recruiter

An autonomous recruiting pipeline built on **LangGraph**. Upload a job description and the
agent extracts the role's core requirements, writes a LinkedIn post, waits out the
application window, then shortlists candidates by semantic similarity against their
resumes and schedules interviews — pausing for human approval at the point where that
matters.

---

## Table of Contents

- [How It Works](#how-it-works)
- [The Agent Graph](#the-agent-graph)
- [Tech Stack](#tech-stack)
- [Project Structure](#project-structure)
- [Getting Started](#getting-started)
- [Environment Variables](#environment-variables)
- [API Reference](#api-reference)
- [Shortlisting Algorithm](#shortlisting-algorithm)
- [Known Issues](#known-issues)

---

## How It Works

1. **An admin uploads a JD** (PDF) via `POST /api/admin/upload-job`.
2. The agent **parses the PDF** and asks `gpt-4o-mini` for the role's **top 5 requirements**.
3. Those requirements are **embedded** and stored in a ChromaDB collection (`JD_embeddings`).
4. The agent **drafts a LinkedIn post** advertising the role.
5. It **waits** for the application window while candidates apply at
   `POST /api/applicants/register`, each resume being embedded into `resume_embeddings`.
6. The agent **notifies the admin** and **pauses** — a real LangGraph interrupt, not a poll.
7. The admin either **rejects the JD** (sending the graph back to step 2 with a new
   document) or **approves**, which resumes the graph.
8. The agent **shortlists the top 10 candidates** by vector similarity and **schedules
   interviews**.

Progress streams to the admin UI over Server-Sent Events, so the dashboard reflects each
node as it completes.

---

## The Agent Graph

```
          START
            │
            ▼
  extracting_requirements ◄──────────────┐
            │                            │
            ▼                            │ reupload === "yes"
   embedding_requirements                │
            │                            │
            ▼                            │
     linkedin_posting                    │
            │                            │
            ▼                            │
       waitingnode                       │
            │                            │
            ▼                            │
   sending_admin_noti ──────────────────-┘
            │  ⏸ interrupt — waits for the admin
            │
            ▼ reupload === "no"
   shortlist_candidates
            │
            ▼
   interview_scheduling
            │
            ▼
           END
```

The graph is compiled with a `MemorySaver` checkpointer and
`interruptAfter: ["sending_admin_noti"]`, so a run survives the pause and resumes from
the exact node where it stopped. Each run is keyed by `thread_id = jobId`.

### Graph State

| Field | Purpose |
|---|---|
| `jdLink` | Path to the uploaded JD document |
| `jobId` | MongoDB `_id` of the job — also the LangGraph `thread_id` |
| `topRequirements` | The 5 extracted requirement embeddings |
| `jdText` | Full parsed JD text, reused for post generation |
| `matchCount` | Applicant count at resume time |
| `shortlistedCandidates` | Result of the shortlisting node |
| `applicationStatus` | `OPEN` → `READY_FOR_REVIEW` |
| `reupload` | Human decision flag that drives the conditional edge |

---

## Tech Stack

| Layer | Technology |
|---|---|
| Agent orchestration | `@langchain/langgraph` 1.2 |
| LLM | OpenAI `gpt-4o-mini` via `@langchain/openai` |
| Embeddings / vector store | OpenAI embeddings + **ChromaDB** |
| Backend | Node.js, Express 5 |
| Database | MongoDB + Mongoose 9 |
| Scheduling | `node-cron` |
| PDF parsing | `pdf-parse` |
| Realtime | Server-Sent Events |
| Frontend | React 19, Vite 7, Tailwind CSS 4, React Router 7 |

---

## Project Structure

```
Backend/server/
├── index.js                          # Express entry; bootstraps Chroma collections
├── Agents/
│   ├── Langraph.js                   # Graph definition, edges, checkpointer
│   ├── components/graph_state.js     # State schema
│   ├── Nodes/
│   │   ├── extracting_requirements.js  # pdf-parse + LLM → top 5 requirements
│   │   ├── Embedding_of_requirements.js
│   │   ├── Linkedin_posting.js         # LLM-written job post
│   │   ├── Waitingnode.js              # cron-driven application window
│   │   ├── sendingadminnoti.js         # notify admin, then interrupt
│   │   ├── shortlistcandidates.js      # vector search + frequency ranking
│   │   ├── interview_scheduling.js
│   │   └── changingjd.js               # (empty placeholder)
│   └── Promtps/                        # Prompt templates
├── Mongo schemas/                    # job, admin, applicants, Shortlisted_candidates,
│                                     # interview_scheduled
├── config/                           # mongodb.js, chromadb.js
├── controller/                       # Admin_controller, Applicants_controller
├── routes/                           # Admin_router, Applicant_router
└── utility_functions/                # scheduler.js, sse.js

Frontend/                             # React + Vite dashboard
├── admin_auth_page.html
├── admin_page.html
└── applicant_page.html
```

---

## Getting Started

**Prerequisites:** Node.js 18+, MongoDB, a running ChromaDB server, and an OpenAI API key.

```bash
git clone https://github.com/TrinayanMahato/Agentic_recruiter.git
cd Agentic_recruiter
```

**Backend**

```bash
cd Backend
npm install
node server/index.js
```

**Frontend**

```bash
cd Frontend
npm install
npm run dev
```

---

## Environment Variables

`Backend/server/.env`:

```env
port=3000
MONGO_URI=mongodb://localhost:27017/agentic_recruiter
OPENAI_API_KEY=<your key>
CHROMA_URL=http://localhost:8000
```

`Frontend/.env`:

```env
VITE_API_BASE_URL=http://localhost:3000
```

> Both `.env` files are currently tracked in git. Add them to `.gitignore` and rotate any
> real keys.

---

## API Reference

### Admin

| Method | Endpoint | Description |
|---|---|---|
| `POST` | `/api/admin/upload-job` | Upload a JD PDF (field `jd`) and start a graph run |
| `POST` | `/api/admin/shortlist` | Approve — resume the paused graph into shortlisting |
| `POST` | `/api/admin/reject-jd` | Reject and resubmit a new JD (loops the graph back) |
| `GET` | `/api/admin/stream/:id` | SSE stream of workflow progress |
| `GET` | `/api/admin/interview-stream/:userId` | SSE stream of interview scheduling |

### Applicants

| Method | Endpoint | Description |
|---|---|---|
| `POST` | `/api/applicants/register` | Apply with a resume upload (field `resume`) |

---

## Shortlisting Algorithm

`shortlistcandidates.js` ranks candidates by **how many of the role's requirements they
match**, rather than by a single similarity score:

1. For each of the 5 requirement embeddings, query `resume_embeddings` for the 10 nearest
   resumes — up to 50 hits in total.
2. Build a frequency map of `applicantId` across all 50 hits.
3. Sort by frequency descending and take the top 10.
4. Fetch those applicants from MongoDB and write them to the `Shortlisted_candidates`
   collection with a provisional interview time 7 days out.
5. Set `applicationStatus` to `READY_FOR_REVIEW`.

A candidate appearing in several requirement result sets therefore outranks one who is a
very close match on a single requirement — a reasonable proxy for all-round fit.

---

## Known Issues

These are real and worth fixing before the project is shown off:

- **`Backend/server/index.js` crashes on startup.** Line 13 calls `path.join(...)` but
  `path` is never required. Add `const path = require('path');`.
- **The application window does not actually wait 7 days.** In `Waitingnode.js` the cron
  expression is `'0 * * * * *'` (every minute) and the
  `if (job.createdAt <= sevenDaysAgo)` guard is commented out, so the graph advances on
  the next tick. Restore the guard and use a daily schedule such as `'0 0 * * *'` for
  real use.
- **`Waitingnode.js` re-invokes the graph from inside a node**, which risks re-entrancy.
  Resuming via the checkpointer from the route handler is the safer pattern.
- **`changingjd.js` is empty** — either implement it or delete it.
- **Committed `.env` files** — see above.
- **No tests.** `npm test` is still the default placeholder.
