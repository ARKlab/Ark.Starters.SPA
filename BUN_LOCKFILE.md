# Bun Lockfile Setup

## Important: bun.lock Generation

This project is configured to use Bun's **text-based lockfile format** (`bun.lock`), not the legacy binary format (`bun.lockb`).

### Why Text-Based?

- ✅ **Human-readable** - Can be reviewed in pull requests
- ✅ **Git-friendly** - Easy to diff and resolve merge conflicts
- ✅ **Version control** - Should always be committed to the repository
- ✅ **Modern default** - Bun 1.2+ uses text format by default

### Generating bun.lock

The `bun.lock` file needs to be generated before CI/CD can run successfully with `--frozen-lockfile`.

#### Option 1: Generate Locally (Recommended)

```bash
# Run bun install - it will automatically create bun.lock
bun install

# Commit the generated lockfile
git add bun.lock
git commit -m "chore: add bun.lock for deterministic builds"
git push
```

#### Option 2: Use GitHub Actions Workflow

If you cannot run bun locally, trigger the workflow:

1. Go to Actions → "Generate Bun Lockfile"
2. Click "Run workflow"
3. The workflow will generate and commit bun.lock automatically

The project includes `bunfig.toml` which configures Bun to:
- Use text-based lockfile format (`save-text-lockfile = true`)
- Generate `bun.lock` instead of `bun.lockb`

### After Generation

**IMPORTANT:** Once `bun.lock` is generated, it must be committed to the repository:

```bash
git add bun.lock
git commit -m "chore: add bun.lock for deterministic builds"
```

This ensures:
- Reproducible builds across all environments
- CI/CD pipelines use exact dependency versions
- Team members get consistent dependency resolution

### CI/CD Configuration

The GitHub Actions workflows use `bun install --frozen-lockfile` which:
- Requires `bun.lock` to exist
- Fails if dependencies don't match the lockfile
- Ensures deterministic builds

### Migration Note

This project has migrated from npm to Bun. The old `package-lock.json` has been removed and replaced with the text-based `bun.lock` format for better developer experience.

For more information, see: https://bun.sh/docs/install/lockfile
