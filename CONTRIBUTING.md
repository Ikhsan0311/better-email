# Contributing

## Development

```bash
git clone https://github.com/nuntly/better-email.git
cd better-email
pnpm install
```

Run tests:
```bash
pnpm --filter better-email test
pnpm --filter better-email test run --coverage
```

Build:
```bash
pnpm --filter better-email build
```

## Publishing

Releases are automated via GitHub Actions when you push a version tag.

```bash
cd packages/better-email
npm version patch  # or minor, major
git push origin main --tags
```

The workflow will run tests and publish to npm. You'll need an `NPM_TOKEN` secret configured in the repository settings.

## Pull Requests

Fork, create a branch, make changes, run tests. Standard workflow.

Requirements:
- Tests must pass
- 100% coverage maintained
- TypeScript must compile

By contributing, you agree your code is licensed under MIT.
