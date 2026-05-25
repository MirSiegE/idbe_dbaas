# IntelliDB Enterprise GUI

IntelliDB Enterprise GUI is the existing product dashboard and backend for database operations, monitoring, scanning, Auto-Heal, Cortex AI, SQL access, licensing, and connection management.

This repository contains the stable IntelliDB product. New DBaaS/control-plane work should integrate through a safe bridge layer rather than rewriting or directly coupling to the dashboard internals.

## Project Shape

- `backend/` - FastAPI backend, SQLAlchemy models, auth, monitoring, scans, Auto-Heal, Cortex AI, license handling, CLI package, tests.
- `frontend/` - Static HTML/CSS/vanilla JS dashboard served by nginx.
- `docker/` - Custom PostgreSQL image, extensions, config, bootstrap roles.
- `docker-compose*.yml` - Dev and production runtime stacks.
- `packaging/` - Installer and component manager.
- `bin/idbe` - Top-level CLI entrypoint.
- `docs/` - Product and operations documentation.
- `docs-agents/` - Local planning/context docs, ignored by Git.

## Main Runtime Stack

The normal Docker stack runs:

- PostgreSQL metadata database
- FastAPI backend
- nginx static frontend
- optional Ollama service for local Cortex AI

The frontend calls backend APIs under `/api/*`.

## Key Product Modules

- Dashboard / Vantage monitoring
- SQL editor and saved DB connections
- Omni Scan
- Auto-Heal
- Cortex AI assistant
- User/RBAC management
- License management
- CLI and installer tooling

## Bridge Direction

Future managed database platform work should expose stable contracts from this repo through:

```text
/api/v1/bridge/*
