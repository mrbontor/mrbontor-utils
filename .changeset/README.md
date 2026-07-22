# Changesets

This folder contains changeset files for tracking package changes.

## Creating a changeset

Run the following command to create a new changeset:

```bash
pnpm changeset
```

Follow the prompts to:

1. Select which packages have changed
2. Choose the version bump type (major, minor, patch)
3. Provide a summary of the changes

## Publishing

To version and publish packages:

```bash
# Update package versions based on changesets
pnpm changeset version

# Build packages
pnpm build

# Publish to npm
pnpm changeset publish
```
