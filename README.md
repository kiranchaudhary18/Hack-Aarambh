# Hack-Aarambh

## Fake Job Offer Detector

Hack-Aarambh is a project to build a backend service that detects fake job offers and suspicious recruitment messages. The service analyzes text and PDF content, assigns a fraud probability score, returns detected red flags, and stores scan history for later review.

## What this project includes

- NestJS backend written in TypeScript
- PostgreSQL persistence via TypeORM
- JWT authentication for user login and secure API access
- PDF parsing support for offer letter uploads
- Heuristic / pattern-based fake offer detection
- Admin analytics and flagged-case monitoring
- Docker and Docker Compose support for local deployment
- Jest tests for core analysis logic

## Key capabilities

- Analyze plain job offer text, email content, and WhatsApp messages
- Extract and scan PDF offer letters
- Detect suspicious patterns such as:
  - unrealistic salary claims
  - unofficial email domains
  - urgency or pressure wording
  - payment requests
  - poor grammar or scam-style phrasing
- Return results with `isFake`, `score`, and `reasons`
- Save scan history in PostgreSQL for audit and review

## Repository structure

- `server/` — backend service implementation
  - `src/` — NestJS server source code
  - `.env.example` — example environment variables
  - `Dockerfile` — container definition for backend
  - `docker-compose.yml` — local dev stack with PostgreSQL
  - `PROJECT_OVERVIEW.md` — detailed backend architecture and use cases

## Setup and local development

1. Install dependencies:

   ```bash
   cd server
   npm install
   ```

2. Copy environment variables:

   ```bash
   cp .env.example .env
   ```

3. Update `.env` values for your PostgreSQL connection and JWT secret.

4. Start the backend locally:

   ```bash
   npm run start:dev
   ```

## Docker development

Use Docker Compose to run the backend and Postgres together.

```bash
cd server
docker compose up --build
```

## Testing

Run Jest unit tests from the `server` directory:

```bash
npm test
```

## How to use

- The frontend can send job offer content to the backend API.
- Supported inputs: plain text, email or WhatsApp copy-paste, job description text, PDF offer letters.
- The API returns a fraud score and detected red flags.
- Admin endpoints allow monitoring scans and reviewing high-risk cases.

## Future improvements

- Add real ML/NLP model support for semantic classification
- Improve PDF document classification with embeddings
- Add frontend UI for scan submission and history management
- Harden authentication and authorization for production
- Add audit logging and rate limiting

## Notes

See `server/PROJECT_OVERVIEW.md` for the complete backend design, AI/ML usage, workflow, and technical details.
