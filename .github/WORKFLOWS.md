# Workflows

## CI (`ci.yml`)

Runs on every push and PR to `main`. Validates types, tests, and build.

## Publish (`publish.yml`)

Runs when you push a version tag (`v*`). Publishes to npm if all checks pass.

Requires `NPM_TOKEN` secret in repository settings.

## Publishing

```bash
cd packages/better-email
npm version patch
git push origin main --tags
```

The workflow handles the rest.
