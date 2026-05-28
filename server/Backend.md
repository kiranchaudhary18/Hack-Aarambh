# Fake Job Offer Detector Backend

## Problem Statement

Many people today, especially students and freshers, are falling victim to fake job offers.
Scammers:

- send fake emails
- share job offers on WhatsApp or Telegram
- send offer letters as PDFs
- ask for a “registration fee” or “training fee”

The user believes they have a job offer, but it is actually fraud.

Fake job offer patterns:

- unrealistic salary (for example, ₹80,000/month for a fresher)
- fake or slightly altered company name
- Gmail/Yahoo email instead of an official domain
- urgency pressure (“apply within 2 hours”)
- payment requests (registration/training fee)
- poor grammar or suspicious wording
- fake offer letter PDFs

## Solution Overview

Our backend system is an intelligent API service that analyzes job-related content and determines whether an offer is real or fake.
It handles text, email content, WhatsApp or Telegram messages, job descriptions, and PDF offer letters.

### Key capabilities

- text analysis for suspicious job content
- PDF parsing and text extraction
- suspicious pattern detection
- scam probability score calculation
- reason-based output (high salary, unofficial email, urgency, etc.)
- history storage for later review
- admin analytics and flagged case monitoring

## AI / ML Use in the Solution

The current solution uses AI/ML-inspired heuristic detection:

- identify natural language patterns
- detect suspicious keywords and phrases
- apply context-based risk scoring

Future expansion can make this system more advanced:

- semantic analysis using pretrained NLP models
- embeddings for detecting similar scam examples
- document classification with machine learning models
- ML-based anomaly detection for offer patterns

### Example ML/AI features

- generating a scam probability score
- ranking patterns based on threat signals
- classifying text as fake or real job offers
- extracting PDF content and applying machine learning filters

## Technology Stack

### Backend

- NestJS framework
- TypeScript
- PostgreSQL database with TypeORM
- JWT authentication
- PDF parsing with `pdf-parse`
- Docker and Docker Compose for local deployment
- Jest for unit testing

### Deployment / Operations

- Postgres service for persistent storage
- Docker container for the backend
- environment variables for DB and JWT secrets
- TypeORM synchronize enabled for local development

## Workflow

1. The user submits job offer content through the frontend.
2. The frontend sends a request to the backend API.
3. The backend verifies authentication if required.
4. The backend processes text or uploaded PDF content.
5. Scam scoring logic analyzes the message content.
6. The result is saved in the history table.
7. The backend response returns:
   - scam status
   - probability score
   - detected reasons
8. The user sees the result in the frontend and decides the next step.

## How the User Will Use It

### User role

- regular job seeker
- can paste job offer text
- can upload a PDF offer letter
- receives instant scam/fake analysis
- views history of previous checks
- reads awareness tips and red flags

### Admin role

- monitors scans
- views flagged high-risk cases
- sees overall scam analytics
- manages system activity

## Common Details

### Input types supported

- plain text messages
- email or WhatsApp copy-paste content
- job description text
- PDF offer letter uploads

### Output details

- `isFake`: boolean
- `score`: scam probability score
- `reasons`: list of detected red flags
- `status`: processed / queued / failed

### Notes

- This backend documentation file supports frontend design.
- Frontend-to-backend API integration is based on clean JSON request/response contracts.
- The backend architecture is component-based, making it easier to inject ML models and expand features in the future.

## Use Case Summary

This system provides job seekers with a powerful fake-offer check and clear reasons to avoid suspicious offers.
The backend uses AI/ML-inspired scoring to help detect fake job offers and provides admins with monitoring and analytics.
