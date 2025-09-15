# Blue Paradox Playwright Testing Suite

A comprehensive end-to-end testing suite for the Blue Paradox website using Playwright.

## 🚀 Quick Setup

### Prerequisites
- **Node.js** (v16 or higher) - [Download here](https://nodejs.org/)
- **Git** - [Download here](https://git-scm.com/)

### Installation

1. **Clone the repository:**
   ```bash
   git clone <repository-url>
   cd PLAYWRIGHTMCP
   ```

2. **Install dependencies:**
   ```bash
   npm install
   ```

3. **Install Playwright browsers:**
   ```bash
   npx playwright install
   ```

4. **Verify installation:**
   ```bash
   npm run test:links
   ```

## 🏃‍♂️ Running Tests

### Environment-Specific Testing

| Command | Environment | Description |
|---------|-------------|-------------|
| `npm run test:prod` | Production | Run all tests against production |
| `npm run test:stg` | Staging | Run all tests against staging |
| `npm run test:prod:headed` | Production | Run tests with browser UI |
| `npm run test:stg:headed` | Staging | Run tests with browser UI |

### Links Validation Testing

| Command | Environment | Description |
|---------|-------------|-------------|
| `npm run test:links` | Production | Test all links (header + footer) |
| `npm run test:links:stg` | Staging | Test all links in staging |
| `npm run test:links:header` | Production | Test only header links |
| `npm run test:links:footer` | Production | Test only footer links |

**Recommended for reliability:**
```bash
# Test with Chromium only (most reliable)
npx playwright test --grep=@links --project=chromium

# Test staging with PowerShell
$env:ENV="STG"; npx playwright test --grep=@links --project=chromium
```

### Mobile Testing

| Command | Environment | Description |
|---------|-------------|-------------|
| `npm run test:mobile` | Production | Run tests on mobile devices |
| `npm run test:mobile:stg` | Staging | Run mobile tests in staging |

### Advanced Filtering

```bash
# Test specific regions
npx playwright test --grep="@france"
npx playwright test --grep="@gb"

# Test specific components
npx playwright test --grep="@header"
npx playwright test --grep="@footer"
npx playwright test --grep="@accessibility"

# Test specific browsers
npx playwright test --project=chromium
npx playwright test --project=firefox
npx playwright test --project=webkit
```

## 📁 Project Structure

```
├── tests/
│   ├── auth.setup.ts                    # Authentication setup
│   ├── content-validations/
│   │   └── blueparadox-links.spec.ts   # Links validation tests
│   ├── interactions/
│   │   └── blueparadox-petition.spec.ts # User interaction tests
│   └── user-flows/
│       └── blueparadox-mobile.spec.ts   # Mobile user flows
├── utils/
│   ├── data/
│   │   └── links.ts                     # Test data for links
│   └── env/
│       └── .env                         # Environment configuration
├── playwright.config.ts                # Playwright configuration
└── package.json                        # Dependencies and scripts
```

## 🔧 Configuration

### Environment Variables

The project supports two environments configured in `utils/env/.env`:

- **PROD**: `https://www.blueparadox.com/`
- **STG**: `https://stage.blueparadox.com` (requires authentication)

### Browsers Supported

- ✅ **Chromium** (Google Chrome, Microsoft Edge)
- ✅ **Firefox**
- ✅ **WebKit** (Safari)
- ✅ **Mobile devices** (iPhone 12, Pixel 7)

## 🧪 Test Categories

### Links Validation
- **Header Links**: Navigation menu validation
- **Footer Links**: Regional footer links (US, France, Great Britain)
- **External Links**: Automatically skipped for performance

### Content Validation
- Page accessibility checks
- Title and heading validation
- Navigation visibility

### User Interactions
- Petition form submissions
- Cookie consent handling
- Mobile-specific interactions

## 📊 Test Reports

After running tests, view detailed reports:

```bash
# Open HTML report
npx playwright show-report
```

Reports include:
- ✅ Pass/fail status
- 📸 Screenshots on failure
- 🎥 Video recordings (on failure)
- 📝 Detailed step-by-step execution

## 🐛 Troubleshooting

### Common Issues

**Issue**: Tests failing due to browser not installed
```bash
# Solution: Install Playwright browsers
npx playwright install
```

**Issue**: Environment not switching
```bash
# PowerShell users
$env:ENV="STG"; npx playwright test

# CMD users  
SET ENV=STG && npx playwright test

# Or use NPM scripts (recommended)
npm run test:stg
```

**Issue**: WebKit timeout errors on specific pages
```bash
# Solution: Use Chromium for more reliable results
npx playwright test --grep=@links --project=chromium

# Or exclude WebKit
npx playwright test --grep=@links --project=chromium firefox
```

**Issue**: Slow external link validation
- External links are automatically skipped for performance
- Only internal site links are validated

### Debug Mode

Run tests in debug mode for troubleshooting:

```bash
# Debug specific test
npx playwright test --debug tests/content-validations/blueparadox-links.spec.ts

# Debug with headed browser
npm run test:prod:headed
```

## 🏷️ Tags Reference

| Tag | Description |
|-----|-------------|
| `@links` | All link validation tests |
| `@header` | Header navigation tests |
| `@footer` | Footer navigation tests |
| `@france` | France-specific tests |
| `@gb` | Great Britain-specific tests |
| `@accessibility` | Accessibility validation |
| `@desktop` | Desktop browser tests |
| `@mobile` | Mobile device tests |

## 📞 Support

For questions or issues:
1. Check the troubleshooting section above
2. Review test reports for detailed error information
3. Ensure all dependencies are installed correctly

---

**Happy Testing!** 🎭✨