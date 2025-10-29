# 🎭 PLAYWRIGHTMCP Testing Suite

**Comprehensive test automation framework with Playwright + JMeter for functional and performance testing**

[![Playwright Tests](https://github.com/npothapu/PLAYWRIGHTMCP/actions/workflows/e2e-regression.yml/badge.svg)](https://github.com/npothapu/PLAYWRIGHTMCP/actions/workflows/e2e-regression.yml)
[![JMeter Load Tests](https://github.com/npothapu/PLAYWRIGHTMCP/actions/workflows/jmeter-docker.yml/badge.svg)](https://github.com/npothapu/PLAYWRIGHTMCP/actions/workflows/jmeter-docker.yml)

## 🚀 Quick Start

```bash
# 1. Install dependencies
npm install

# 2. Install Playwright browsers
npm run install-browsers

# 3. Run smoke tests
npm run test:smoke:qa

# 4. View results
npm run test:report
```

---

## 📁 Project Structure

```
PLAYWRIGHTMCP/
├── 🔧 Configuration Files
│   ├── playwright.config.ts              # Main Playwright configuration
│   ├── package.json                      # Dependencies & NPM scripts
│   ├── tsconfig.json                     # TypeScript configuration
│   └── .gitignore                        # Git ignore rules
│
├── 🌍 Environment Management
│   └── env/                              # Environment configurations
│       ├── .env                          # Default fallback (qa)
│       ├── .env.qa                       # QA environment (Google)
│       ├── .env.dev                      # Development (VML)
│       └── .env.prod                     # Production (Microsoft)
│
├── 🧪 Test Structure
│   └── tests/                            # Main test directory
│       └── e2e/                          # End-to-end tests
│           ├── fixtures/                 # Page objects & test fixtures
│           │   ├── pages.ts              # Page Object Model classes
│           │   └── test-fixtures.ts      # Custom test fixtures
│           ├── helpers/                  # Utilities & common functions
│           │   └── test-utils.ts         # Test utilities & helpers
│           └── specs/                    # Test specifications
│               ├── smoke/                # Smoke tests (quick validation)
│               ├── regression/           # Regression tests (comprehensive)
│               └── functional/           # Functional tests (feature-specific)
│
├── 📊 Output & Reports
│   ├── playwright-report/               # HTML test reports
│   └── test-results/                    # Test artifacts & screenshots
│
├── 🚀 Performance Testing
│   └── perf/                            # JMeter performance tests
│       ├── docker/                      # Docker configuration
│       │   ├── Dockerfile               # Custom JMeter image
│       │   └── docker-compose.yml       # Docker Compose setup
│       ├── jmeter/                      # JMeter test plans
│       │   ├── plans/                   # Test plan files (.jmx)
│       │   ├── results/                 # Test execution results
│       │   └── reports/                 # Generated HTML reports
│       └── scripts/                     # Helper scripts
│
├── 🔄 CI/CD & Automation
│   ├── .github/workflows/               # GitHub Actions workflows
│   │   ├── e2e-smoke.yml               # Pull request smoke tests
│   │   ├── e2e-regression.yml          # Branch push regression tests
│   │   └── jmeter-docker.yml           # Performance test workflow
│   └── scripts/                        # Build & deployment scripts
│
└── 📚 Documentation
    ├── README.md                        # This file
    ├── qa-specific-documentation/       # QA-specific guides
    └── testcontexts/                    # Test context & rules
```

---

## 🎯 Testing Environments

| Environment | URL | Purpose | Tests |
|-------------|-----|---------|-------|
| **QA** | `https://www.google.com` | Quality Assurance | All test types |
| **DEV** | `https://www.vml.com` | Development | Smoke & specific tests |
| **PROD** | `https://www.microsoft.com` | Production | Smoke tests only |

---

## 📦 Installation & Setup

### Prerequisites
- **Node.js** (v18 or higher) - [Download](https://nodejs.org/)
- **Git** - [Download](https://git-scm.com/)
- **Docker** (for JMeter tests) - [Download](https://docker.com/)

### Installation Steps

```bash
# 1. Clone the repository
git clone https://github.com/npothapu/PLAYWRIGHTMCP.git
cd PLAYWRIGHTMCP

# 2. Install dependencies
npm install

# 3. Install Playwright browsers
npm run install-browsers

# 4. Verify installation
npm run test:chromium
```

---

## 🔧 NPM Scripts Reference

### Core Commands

| Command | Description | Usage |
|---------|-------------|-------|
| `npm install` | Install all dependencies | First-time setup |
| `npm run install-browsers` | Install Playwright browsers | After npm install |
| `npm test` | Run all tests (all environments) | Quick validation |

### 🌍 Environment-Specific Testing

#### QA Environment (Google)
```bash
npm run test:qa                    # Full test suite on QA
npm run test:qa:chromium          # QA tests in Chromium only
npm run test:qa:firefox           # QA tests in Firefox only
npm run test:qa:webkit            # QA tests in WebKit only
npm run test:smoke:qa             # QA smoke tests (fast)
npm run test:regression:qa        # QA regression tests (comprehensive)
```

#### Development Environment (VML)
```bash
npm run test:dev                  # Full test suite on DEV
npm run test:dev:chromium         # DEV tests in Chromium only
npm run test:smoke:dev            # DEV smoke tests
npm run test:regression:dev       # DEV regression tests
```

#### Production Environment (Microsoft)
```bash
npm run test:prod                 # Full test suite on PROD
npm run test:prod:chromium        # PROD tests in Chromium only
npm run test:smoke:prod           # PROD smoke tests (recommended)
```

### 🎯 Test Type Filtering

```bash
# Smoke Tests (Quick validation)
npm run test:smoke                # All environments
npm run test:smoke:qa             # QA only
npm run test:smoke:dev            # DEV only
npm run test:smoke:prod           # PROD only

# Regression Tests (Comprehensive)
npm run test:regression           # All environments
npm run test:regression:qa        # QA only
npm run test:regression:dev       # DEV only

# Functional Tests (Feature-specific)
npm run test:functional           # All environments
npm run test:functional:qa        # QA only
```

### 🌐 Browser-Specific Testing

```bash
# Single Browser Testing
npm run test:chromium             # Chromium across all environments
npm run test:firefox              # Firefox across all environments
npm run test:webkit               # WebKit across all environments

# Environment + Browser Combinations
npm run test:qa:chromium          # QA environment in Chromium
npm run test:dev:firefox          # DEV environment in Firefox
npm run test:prod:webkit          # PROD environment in WebKit
```

### 📊 Reporting & Results

```bash
npm run test:report               # Open latest HTML report
npm run test:ui                   # Run tests in UI mode (interactive)
npm run test:debug                # Run tests in debug mode
npm run test:headed               # Run tests in headed mode (visible browser)
```

### 🧹 Maintenance Commands

```bash
npm run test:clear-cache          # Clear Playwright cache
npm run test:clean                # Clean test results and reports
npm run test:install              # Reinstall Playwright browsers
```

---

## 🎭 Playwright Testing Guide

### Running Your First Test

```bash
# 1. Quick smoke test on QA environment
npm run test:smoke:qa

# 2. View the results
npm run test:report
```

### Test Organization

#### Smoke Tests (`tests/e2e/specs/smoke/`)
- **Purpose**: Quick validation of critical functionality
- **Duration**: ~2-3 minutes
- **When to use**: Pull requests, quick validation
- **Coverage**: Header navigation, basic interactions

#### Regression Tests (`tests/e2e/specs/regression/`)
- **Purpose**: Comprehensive testing of all features
- **Duration**: ~10-15 minutes
- **When to use**: Before releases, branch merges
- **Coverage**: Full user journeys, edge cases

#### Functional Tests (`tests/e2e/specs/functional/`)
- **Purpose**: Feature-specific testing
- **Duration**: Variable
- **When to use**: Feature development, specific bug testing
- **Coverage**: Individual features in depth

### Environment Configuration

Tests automatically load environment-specific settings from the `env/` folder:

```bash
# QA Environment (.env.qa)
BASE_URL=https://www.google.com
ENV_NAME=qa

# Development Environment (.env.dev)
BASE_URL=https://www.vml.com
ENV_NAME=dev

# Production Environment (.env.prod)
BASE_URL=https://www.microsoft.com
ENV_NAME=prod
```

### Page Object Model

The framework uses Page Object Model for maintainability:

```typescript
// Example usage in tests
test('should navigate header links', async ({ page, pageObjects }) => {
  const { googlePage } = pageObjects;
  
  await googlePage.goto();
  await googlePage.handleConsentIfPresent();
  await googlePage.verifyHeaderLinks();
});
```

### Test Fixtures & Utilities

The framework provides utilities for common testing scenarios:

```typescript
// Custom test fixtures with page objects
import { test as base } from './fixtures/pages';

// Test utilities for cross-environment testing
import { TestUtils } from './helpers/test-utils';
```

---

## 🚀 JMeter Performance Testing

### ⚠️ Production Protection

**JMeter load testing is DISABLED for production environments** to prevent:
- Unintended load on production systems
- Performance degradation for real users  
- Potential service disruption

### Quick Start

```bash
# Run JMeter load test on QA environment (safe)
npm run perf:qa

# Run JMeter load test on DEV environment (safe)
npm run perf:dev

# Legacy command (defaults to QA now)
npm run jmeter:docker
```

### Performance Test Configuration

#### Available Environments for Load Testing

| Environment | Configuration File | Target URL | Status |
|-------------|-------------------|------------|--------|
| **QA** | `perf/jmeter/plans/env/qa.properties` | Google | ✅ **Safe for load testing** |
| **DEV** | `perf/jmeter/plans/env/dev.properties` | VML | ✅ **Safe for load testing** |
| **PROD** | `perf/jmeter/plans/env/prod.properties` | Microsoft | ❌ **BLOCKED for safety** |

#### Load Test Parameters

```bash
# Customize load test parameters
powershell scripts/run-jmeter-docker.ps1 `
  -Users 50 `        # Number of virtual users
  -RampUp 10 `       # Ramp-up time in seconds
  -Loops 5 `         # Number of iterations per user
  -Env qa            # Target environment (qa/dev only)
```

### JMeter Test Plans

- **File**: `perf/jmeter/plans/google-loadtest.jmx`
- **Type**: Parameterized load test
- **Targets**: Homepage and key user journeys
- **Reports**: Auto-generated HTML reports in `perf/jmeter/reports/`

### Production Protection Details

If you attempt to run load tests against production:

```bash
❌ PRODUCTION PROTECTION ENABLED

JMeter load testing is DISABLED for production environment to prevent:
  • Unintended load on production systems
  • Performance degradation for real users
  • Potential service disruption

✅ Available environments for load testing:
  • dev  - Development environment (VML)
  • qa   - QA environment (Google)

To run load tests, use:
  .\scripts\run-jmeter-docker.ps1 -Env qa
  .\scripts\run-jmeter-docker.ps1 -Env dev
```

---

## 🔄 CI/CD Integration

### GitHub Actions Workflows

#### 1. Pull Request Smoke Tests
- **File**: `.github/workflows/e2e-smoke.yml`
- **Trigger**: Pull requests
- **Tests**: Smoke tests on QA environment
- **Duration**: ~3 minutes

#### 2. Branch Regression Tests
- **File**: `.github/workflows/e2e-regression.yml`
- **Trigger**: Push to main/qa branches
- **Tests**: Full regression suite
- **Duration**: ~15 minutes

#### 3. Performance Testing
- **File**: `.github/workflows/jmeter-docker.yml`
- **Trigger**: Push to qa branch (manual trigger available)
- **Tests**: JMeter load tests on QA environment only
- **Artifacts**: HTML performance reports

### Local CI Simulation

```bash
# Simulate PR workflow
npm run test:smoke:qa

# Simulate branch workflow
npm run test:regression:qa

# Simulate performance testing (QA only)
npm run perf:qa
```

---

## 🛠️ Advanced Usage

### Custom Test Execution

```bash
# Run specific test file
npx playwright test tests/e2e/specs/smoke/google-header-links.spec.ts

# Run tests with specific grep pattern
npx playwright test --grep "header"

# Run tests in specific project (browser)
npx playwright test --project=chromium

# Run tests with custom environment
cross-env NODE_ENV=custom npm test
```

### Debug Mode

```bash
# Run tests in debug mode
npm run test:debug

# Run specific test in debug mode
npx playwright test --debug tests/e2e/specs/smoke/google-header-links.spec.ts

# Run tests in UI mode (interactive)
npm run test:ui
```

### Parallel Execution

```bash
# Run tests with custom worker count
npx playwright test --workers=4

# Run tests in serial (one at a time)
npx playwright test --workers=1

# Run tests with retry on failure
npx playwright test --retries=2
```

---

## 📈 Monitoring & Reports

### Test Reports

#### HTML Reports
- **Location**: `playwright-report/index.html`
- **Content**: Test results, screenshots, videos, traces
- **Access**: `npm run test:report`

#### JSON Reports
- **Location**: `test-results/results.json`
- **Content**: Machine-readable test results
- **Usage**: CI/CD integration, custom reporting

### Performance Reports

#### JMeter HTML Reports
- **Location**: `perf/jmeter/reports/html-report/index.html`
- **Content**: Response times, throughput, error rates
- **Metrics**: 95th percentile, average response time, requests/second

### Artifacts & Screenshots

- **Screenshots**: Captured on test failure
- **Videos**: Full test execution recording
- **Traces**: Detailed execution traces for debugging
- **Location**: `test-results/` directory

---

## 🧰 Troubleshooting

### Common Issues

#### Browser Installation Problems
```bash
# Reinstall browsers
npm run test:install

# Clear cache and reinstall
npx playwright install --force
```

#### Environment Configuration Issues
```bash
# Check current environment
echo $NODE_ENV

# Verify environment file exists
ls -la env/
```

#### Docker Issues (JMeter)
```bash
# Check Docker status
docker --version
docker-compose --version

# Rebuild JMeter Docker image
docker-compose -f perf/docker/docker-compose.yml build --no-cache
```

#### Production Protection Override (NOT RECOMMENDED)
```bash
# If you absolutely need to test production (NOT RECOMMENDED)
# You would need to modify the PowerShell script directly
# However, this is strongly discouraged for safety reasons
```

#### Test Failures
```bash
# Run with more verbose output
npx playwright test --reporter=verbose

# Run specific failing test
npx playwright test --grep "failing-test-name"

# Check test artifacts
ls -la test-results/
```

### Debugging Steps

1. **Check Environment Configuration**
   ```bash
   # Verify environment files
   cat env/.env.qa
   cat env/.env.dev
   cat env/.env.prod
   ```

2. **Validate Dependencies**
   ```bash
   # Check Node.js version
   node --version  # Should be 18+
   
   # Check npm packages
   npm list --depth=0
   ```

3. **Test Browser Installation**
   ```bash
   # List installed browsers
   npx playwright install --dry-run
   ```

4. **Clear All Caches**
   ```bash
   # Clear npm cache
   npm cache clean --force
   
   # Clear Playwright cache
   npx playwright install --force
   
   # Remove node_modules and reinstall
   rm -rf node_modules package-lock.json
   npm install
   ```

---

## 🤝 Contributing

### Development Workflow

1. **Create Feature Branch**
   ```bash
   git checkout -b feature/new-test
   ```

2. **Add Tests**
   ```bash
   # Add test file to appropriate directory
   tests/e2e/specs/functional/new-feature.spec.ts
   ```

3. **Run Tests Locally**
   ```bash
   npm run test:smoke:qa
   npm run test:regression:qa
   ```

4. **Create Pull Request**
   - Smoke tests run automatically
   - Review test reports in PR comments

### Test Writing Guidelines

#### File Naming Convention
```
tests/e2e/specs/
├── smoke/
│   └── [feature]-basic.spec.ts
├── regression/
│   └── [feature]-comprehensive.spec.ts
└── functional/
    └── [feature]-specific.spec.ts
```

#### Test Structure
```typescript
import { test, expect } from '../fixtures/pages';

test.describe('Feature Name', () => {
  test.beforeEach(async ({ page, pageObjects }) => {
    // Setup code
  });

  test('should perform basic action', async ({ page, pageObjects }) => {
    // Test implementation
  });
});
```

### Environment Management

#### Adding New Environment
1. Create new environment file: `env/.env.newenv`
2. Add NPM scripts in `package.json`
3. Update CI workflows if needed
4. Document in this README

---

## 📋 Maintenance

### Regular Maintenance Tasks

#### Weekly
```bash
# Update dependencies
npm update

# Update Playwright browsers
npm run install-browsers
```

#### Monthly
```bash
# Check for outdated packages
npm outdated

# Security audit
npm audit

# Clean old test results
npm run test:clean
```

#### Release Preparation
```bash
# Full test suite across all environments
npm run test:qa
npm run test:dev
npm run test:prod

# Performance testing (safe environments only)
npm run perf:qa
npm run perf:dev

# Generate comprehensive reports
npm run test:report
```

---

## 📚 Additional Resources

### Documentation
- **Playwright Official Docs**: [playwright.dev](https://playwright.dev/)
- **JMeter Documentation**: [jmeter.apache.org](https://jmeter.apache.org/)
- **GitHub Actions**: [docs.github.com/actions](https://docs.github.com/en/actions)

### Project-Specific Guides
- **QA Component Analysis**: `qa-specific-documentation/qa-component-analysis-guide.md`
- **Test Context Rules**: `testcontexts/playwright-webtest-rules.txt`
- **Web Test Context**: `testcontexts/webtestcontext.txt`

---

## 🏷️ Version Information

- **Playwright**: v1.55.0
- **Node.js**: v18+ required
- **JMeter**: v5.6.3 (Docker)
- **Last Updated**: October 2025

---

## 📞 Support

For questions, issues, or contributions:

1. **Check existing issues**: [GitHub Issues](https://github.com/npothapu/PLAYWRIGHTMCP/issues)
2. **Create new issue**: Use issue templates
3. **Discussion**: [GitHub Discussions](https://github.com/npothapu/PLAYWRIGHTMCP/discussions)

---

**Happy Testing! 🎭🚀**
