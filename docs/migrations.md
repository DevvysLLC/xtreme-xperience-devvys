# Migrations

## Overview

DatoCMS migrations allow you to version control schema changes and apply them programmatically. Instead of manually replicating changes across environments, migrations capture schema modifications as code.

**Documentation:**

- [DatoCMS Migrations](https://www.datocms.com/docs/scripting-migrations/introduction)
- [CLI Migration Commands](https://www.datocms.com/docs/scripting-migrations/installing-the-cli)

## Scripts

### `autogenerate-migration.sh`

Compares a sandbox environment against primary and generates a TypeScript migration file capturing the differences.

**Usage:** `./datocms/autogenerate-migration.sh 'migration-name' 'sandbox-environment-name'`

### `create-sandbox-from-primary.sh`

Applies all pending migrations to primary environment, creating a new sandbox. Automatically handles maintenance mode during migration.

**Usage:** `./datocms/create-sandbox-from-primary.sh 'new-sandbox-name'`

## Workflow

- Create a sandbox/fork in Dato UI from primary
- Make any changes you need in UI
- Run the following command in your container
  - `./datocms/autogenerate-migration.sh 'add-[describe-changes]' '[target-sandbox-environment]'`
- Run the following command in your container
  - `./datocms/create-sandbox-from-primary.sh 'added-[describe-changes]'`
- Promote RC sandbox above
- Delete previous sandboxes
