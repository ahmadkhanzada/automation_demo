# Visual Testing Strategy

This document explains how visual regression testing is implemented in the automation-demo project.

## 🎯 Overview

Visual regression testing uses Playwright's screenshot comparison feature to detect unintended UI changes. Screenshots are captured during test runs and compared against baseline images.

## 🖼️ Platform Considerations

Visual snapshots are **platform-specific** because:
- Font rendering differs between operating systems
- Browser rendering engines behave slightly differently across platforms
- Screen DPI and subpixel rendering vary

This means snapshots generated on Windows will differ from those on Linux or macOS.

## 🏗️ CI/CD Strategy

### Default Behavior
- **Local Development**: All tests run, including visual snapshots
- **GitHub Actions CI**: Visual tests are **excluded** by default to ensure consistent builds
- **Manual Updates**: Visual snapshots can be updated via GitHub Actions workflow

### Test Scripts

| Script | Purpose | Includes Visual |
|--------|---------|----------------|
| `npm test` | All tests for CI | ❌ No |
| `npm run test:ui` | UI tests for CI | ❌ No |
| `npm run test:ui:all` | All UI tests | ✅ Yes |
| `npm run test:ui:visual` | Visual tests only | ✅ Yes |

## 🔄 Updating Visual Snapshots

### Local Updates (Windows)
```bash
# Update all snapshots locally
npm --workspace frontend run test:e2e:update-snapshots

# Update only visual snapshots
npm run test:ui:visual -- --update-snapshots
```

### CI Updates (Linux)
1. Go to **Actions** tab in GitHub repository
2. Select **"Update Visual Snapshots"** workflow
3. Click **"Run workflow"**
4. Provide commit message (optional)
5. Click **"Run workflow"** button

This will:
- Generate Linux-compatible snapshots
- Commit them to the repository
- Update the baseline for future CI runs

## 📁 Snapshot Storage

Snapshots are stored in:
```
frontend/e2e/visual.spec.js-snapshots/
├── login-page-initial-chromium-win32.png
├── login-page-initial-chromium-linux.png
├── items-page-empty-chromium-win32.png
├── items-page-empty-chromium-linux.png
├── items-page-with-item-chromium-win32.png
└── items-page-with-item-chromium-linux.png
```

## 🎨 Visual Test Coverage

Current visual tests cover:

1. **Login Page Initial State**
   - Clean login form appearance
   - Proper styling and layout

2. **Items Page with Data**
   - Items list with sample data
   - CRUD operation buttons
   - Proper data display

3. **Items Page Empty State**
   - Empty state message
   - Create form availability

## 🚨 Common Issues

### "Snapshot doesn't exist" Error
- **Cause**: Running on different platform than baseline
- **Solution**: Use `--update-snapshots` flag or run CI update workflow

### Visual Differences in CI
- **Cause**: Platform-specific rendering differences
- **Solution**: Generate platform-specific baselines using CI workflow

### Tests Pass Locally but Fail in CI
- **Cause**: Windows vs Linux rendering differences
- **Solution**: Use non-visual test commands for CI (`npm run test:ui`)

## 🔧 Configuration

Visual testing is configured in `playwright.config.js`:

```javascript
expect: {
  toHaveScreenshot: {
    mode: 'css',
    animations: 'disabled',
  },
},
```

This ensures:
- CSS animations are disabled for consistent screenshots
- Deterministic rendering across test runs

## 📋 Best Practices

1. **Generate Baselines Consistently**: Use the same platform for baseline generation
2. **Review Changes Carefully**: Visual diffs can catch unintended UI changes
3. **Use CI for Updates**: Generate Linux baselines using CI workflow
4. **Exclude When Needed**: Skip visual tests in environments where consistency is challenging
5. **Document Changes**: Include visual updates in commit messages

## 🎯 Benefits

- **Regression Detection**: Automatically catch visual regressions
- **Cross-browser Consistency**: Ensure UI appears consistently
- **Documentation**: Screenshots serve as visual documentation
- **Quality Assurance**: Additional layer of testing beyond functional tests

Visual regression testing adds significant value to the testing strategy while being mindful of platform differences and CI/CD constraints.
