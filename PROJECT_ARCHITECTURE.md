# Project Scout — Technical Architecture & Specification

## 1. Executive Summary
Project Scout is a full-stack, client-orchestrated academic engineering copilot designed to guide undergraduate and graduate students from initial problem formulation through live GitHub repository health auditing, continuous documentation validation, and codebase-anchored viva defense simulation.

---

## 2. Component Dataflow & Lifecycle

```
   [User Resume PDF]
          │
          ▼ (Base64 Inline Data)
   [Gemini Vision Multimodal Parser]
          │
          ▼ (Domain, Skills, Tools, Level)
   [Capability Matching Discovery Engine]
          │
          ▼ (3 Grounded Problem Opportunities)
   [Opportunity Detail & Roadmap Generator]
          │
          ▼ (Target Repository Connection)
   [GitHub REST API v3 Tree Ingestion]
          │
          ├─────────────────────────┬─────────────────────────┐
          ▼                         ▼                         ▼
   [Academic Health Audit]   [Viva Defense Simulator]  [Doc Integrity Auditor]
          │                         │                         │
          ▼                         ▼                         ▼
   [Radar Scores & Fixes]    [File-Anchored Q&A]       [10-Point Checklist Drafts]
```

---

## 3. Core Engine Architecture

### A. Multimodal Resume Extractor (`src/lib/resumeParser.js`)
* **Input**: PDF binary payload converted to base64 Data URL.
* **Model**: `gemini-3.7-flash` (with failover to `gemini-3.6-flash`).
* **Format**: Pure JSON response containing:
  * `academicLevel`: UG | PG | PhD
  * `domain`: Unconstrained granular engineering domain
  * `skills`: 8–20 verified technical competencies
  * `tools`: Developer tools, security software, and platforms
  * `interests`: Research problem summary

### B. Problem Discovery & "Why You?" Engine (`src/lib/gemini.js`)
* **Input**: Candidate capability profile + domain constraints.
* **Pipeline**:
  1. Capability Mapping
  2. Live Web & Problem Discovery
  3. Prior Art & Novelty Check
  4. Scoring & Grounded Matching
  5. Multi-Phase Roadmap & Career Pack Generation

### C. GitHub Repository Ingestion Engine (`src/lib/github.js`)
* **Protocol**: GitHub REST API v3.
* **Endpoints**:
  * `GET /repos/{owner}/{repo}`: General metadata and branch resolution.
  * `GET /repos/{owner}/{repo}/git/trees/{branch}?recursive=1`: Complete recursive file tree indexing.
  * `GET /raw.githubusercontent.com/{owner}/{repo}/{branch}/README.md`: Raw documentation text.
  * `GET /raw.githubusercontent.com/{owner}/{repo}/{branch}/package.json`: Dependency manifests.

### D. Academic Health & Viva Defense Engine (`src/lib/mentorEngine.js`)
* **Audit**: Evaluates codebase against IEEE/ACM capstone standards.
* **Viva Interrogation**: Generates 6–8 tough examiner questions strictly anchored to actual files in the codebase (`codeOrFileAnchor`).
* **Doc Auditor**: Validates against the 10-point capstone documentation checklist and produces ready-to-merge markdown drafts.

---

## 4. Multi-Model Failover & Resiliency Matrix

```
   [API Request]
         │
         ▼
   [Attempt 1: gemini-3.7-flash] ────► (Success) ──► Return Live Payload (isFallback: false)
         │ (429 / 503 / Network Error)
         ▼
   [Attempt 2: gemini-3.6-flash] ────► (Success) ──► Return Live Payload (isFallback: false)
         │ (Error)
         ▼
   [Attempt 3: gemini-flash-latest] ─► (Success) ──► Return Live Payload (isFallback: false)
         │ (All Models Failed)
         ▼
   [Deterministic Heuristic Engine] ────────────────► Return Computed Payload (isFallback: true)
```

---

## 5. Security & Edge Configuration
* **Headers**: `nosniff`, `SAMEORIGIN`, `X-XSS-Protection: 1; mode=block`.
* **Caching**: Static assets cached for 1 year (`max-age=31536000, immutable`).
* **Zero Secret Leakage**: No hardcoded API keys in git-tracked code.
