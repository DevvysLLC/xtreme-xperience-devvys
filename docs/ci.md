# Continuous Integration

Automated tests are run on every commit to the `main` branch and on every pull request.

GraphQL codegen is run on every commit to the `main` branch, **but not on pull requests**. Run `bb run codegen-graphql` manually before submitting a pull request.

## GitHub Actions

The CI tasks are powered by GitHub Actions. All devops-related source files are located in the [devops](/devops) and [.github](/.github) folders.

### Required Secrets

- `DATABASE_URL` - Neon database url (retrieve from the Neon project dashboard)
- `SHOPIFY_ADMIN_API_TOKEN` - used by graphql codegen task
- `SHOPIFY_SHOP`
