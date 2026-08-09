# CI/CD Pipeline

## GitHub Actions Configuration

```yaml
# .github/workflows/ci.yml
name: CI/CD

on:
  push:
    branches: [main]
  pull_request:
    branches: [main]

jobs:
  build:
    runs-on: ubuntu-latest
    
    steps:
    - uses: actions/checkout@v3
    
    - name: Use Node.js
      uses: actions/setup-node@v3
      with:
        node-version: '18'
        cache: 'npm'
    
    - name: Install dependencies
      run: npm ci
    
    - name: Lint
      run: npm run lint
    
    - name: Test
      run: npm test
    
    - name: Build
      run: npm run build
    
    - name: Package
      run: vsce package
    
    - name: Upload artifact
      uses: actions/upload-artifact@v3
      with:
        name: extension
        path: '*.vsix'
    
    - name: Publish
      if: github.ref == 'refs/heads/main'
      run: vsce publish -p ${{ secrets.VSCE_TOKEN }}
```

## Guidelines

- Run on push to main and pull requests
- Use Node.js 18 or later
- Cache npm dependencies
- Run lint, test, and build in sequence
- Package extension as artifact
- Publish only on main branch with secure token
