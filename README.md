## Test Automation Overview

This repository contains two testing tracks:

1) Functional UI tests with Playwright (smoke/regression)
2) Non-functional load testing with Apache JMeter running in Docker

Use the sections below to set up and run each independently.

## Repository layout

- `tests/` — Playwright subproject for functional tests
	- `playwright.config.ts` — config (Desktop Chrome/Firefox/Safari + iPhone 13)
	- `.env` — functional test base URL (e.g., `BASE_URL=https://www.google.com`)
	- `e2e/specs/smoke/google-header-links.spec.ts` — smoke test for Google header links
	- `test-results/` and `playwright-report/` — outputs (generated)
- `perf/` — non-functional (JMeter) assets
	- `docker/` — JMeter Dockerfile and `docker-compose.yml`
	- `jmeter/plans/google-loadtest.jmx` — parameterized JMX plan
	- `jmeter/plans/env/{dev,qa,prod}.properties` — per-environment URL parts
	- `jmeter/results/` and `jmeter/reports/` — outputs (generated)
- `scripts/run-jmeter-docker.ps1` — helper to build/run the JMeter test via Docker Compose
- `.github/workflows/` — CI workflows
	- `e2e-smoke.yml` — PR smoke run (Playwright)
	- `e2e-regression.yml` — regression run on branch `qa` (Playwright)
	- `jmeter-docker.yml` — manual/triggered JMeter run in CI with report artifact

---

## Functional UI testing (Playwright)

### Prerequisites

- Node.js 20+ and npm

## Testing toolkit: Functional (Playwright) + Non-functional (JMeter)

This repository contains two complementary test stacks:

- Functional UI tests with Playwright
- Load testing with Apache JMeter in Docker

Both stacks are CI-ready with GitHub Actions and produce local artifacts for fast feedback.

---

## Repository layout

- `tests/` — Playwright subproject for functional UI tests
	- `e2e/specs/` — test specs (smoke, regression, functional)
	- `playwright.config.ts` — config for Chromium, Firefox, WebKit, and iPhone 13
	- `.env` — BASE_URL for functional tests
- `perf/` — JMeter plan + Dockerized runner (non-functional)
	- `jmeter/plans/google-loadtest.jmx` — parameterized JMX
	- `jmeter/plans/env/{dev,qa,prod}.properties` — protocol/domain/path
	- `jmeter/results` + `jmeter/reports` — outputs (JTL + HTML)
	- `docker/` — Dockerfile + docker-compose.yml
- `scripts/run-jmeter-docker.ps1` — builds image and runs JMeter with parameters
- `.github/workflows/` — CI workflows for both stacks

Note: The legacy `jmeter/` folder from early iterations has been removed. The supported/active paths are under `perf/jmeter/`.

---

## Functional testing (Playwright)

### Prerequisites

- Node.js 20+
- Internet access (to install dependencies and Playwright browsers)

### Configure

Update `tests/.env`:

```
BASE_URL=https://www.google.com
```

### Run locally (Windows PowerShell)

```powershell
# from repo root
Set-Location -Path .\tests
if (!(Test-Path node_modules)) { npm ci }
npx playwright install --with-deps
npx playwright test --reporter=line
```

Artifacts:

- `tests/test-results/` — traces, screenshots/videos (if enabled)
- `tests/playwright-report/` — HTML report (open index.html)

### CI

- Smoke on PRs: `.github/workflows/e2e-smoke.yml` (Chromium, fast feedback)
- Regression on qa branch: `.github/workflows/e2e-regression.yml` (all projects)

---

## Non-functional testing (JMeter via Docker)

### Prerequisites

- Docker Desktop (Windows/macOS) or Docker Engine (Linux)
- Internet access to pull the base image

### Configure environments

Edit one of:

- `perf/jmeter/plans/env/dev.properties`
- `perf/jmeter/plans/env/qa.properties`
- `perf/jmeter/plans/env/prod.properties`

With keys:

- `protocol` — e.g., `https`
- `domain` — e.g., `www.google.com`
- `path` — e.g., `/`

These are referenced in the JMX as `${protocol}`, `${domain}`, and `${path}`.

### Run locally (Windows PowerShell)

```powershell
# defaults: Users=10 RampUp=1 Loops=1 Env=prod
npm run jmeter:docker

# custom
powershell -ExecutionPolicy Bypass -File .\scripts\run-jmeter-docker.ps1 -Users 25 -RampUp 5 -Loops 2 -Env qa
```

Artifacts:

- JTL: `perf\jmeter\results\results.jtl`
- HTML report: `perf\jmeter\reports\html-report\index.html`

### CI

JMeter runs automatically on pushes to the `qa` branch via `.github/workflows/jmeter-docker.yml` and uploads an artifact:

1) Builds the JMeter image
2) Runs the JMX with default params (users=10, rampUp=1, loops=1) against ENV=qa
3) Uploads the HTML report artifact from `perf/jmeter/reports/html-report`

---

## Troubleshooting

- Docker not found: install Docker Desktop and ensure `docker` is on PATH; restart your shell.
- 0 samples or empty report: verify env properties (protocol/domain/path) resolve and are reachable.
- Browser binaries missing: run `npx playwright install --with-deps` inside `tests/`.
- Windows script policy: use `-ExecutionPolicy Bypass` on PowerShell script invocations.

---

## License

This project uses Apache JMeter (Apache License 2.0) and Playwright (Apache 2.0). Review licenses of all dependencies before redistribution.

This project uses Apache JMeter (Apache License 2.0) and Playwright (Apache License 2.0).
