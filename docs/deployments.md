# Deployments

The project uses custom GitHub Actions for automated deployments to Shopify.

| Stage        | Branch       | Deployment Workflow                |
| ------------ | ------------ | ---------------------------------- |
| `uat`        | `main`       | automatic, on every push to `main` |
| `production` | `production` | manual, `deploy-to-production`     |

Developers should create feature branches from the `main` branch and create
pull-requests back to `main` when they are ready to merge the feature.

Developers should never push commits directly to the `main` or `production` branches.

## How To Initiate Staging (UAT) Deployments

The system automatically updates the UAT preview in Vercel on every change in the
`main` branch. No manual action required.

## How To Initiate Production Deployments

To initiate the update of the production app:

1. Navigate to Actions tab of the repository.
1. Select "Deploy to production" workflow in the sidebar.
1. Tap "Run workflow" action and confirm.

## Database

### Migrations

The app generates database migrations as part of the CI `run-tests` workflow.

The migrations are applied to the database **during Vercel build** on every deployment to `production` or `uat` Vercel environment.

The preview branch (PR) deployments use the `uat` Neon database environment.

We should create separate PRs for database migrations and ensure all newly added
columns or JSONB column properties are optional to avoid breaking production.

## Hosting

The project is deployed to Vercel.

### Required Environment Variables

- `DATABASE_URL` - Neon database url (retrieve from the Neon project dashboard)
- `DATABASE_URL_NON_POOLING` - Neon database url for migrations (retrieve from the Neon project dashboard)
- `NEXT_PUBLIC_DB_MODE=http` - ensure the app uses Neon http connection
- `SHOPIFY_ADMIN_API_TOKEN`
- `SHOPIFY_SHOP`

## GitHub Actions

The CD tasks are powered by GitHub Actions. All devops-related source files are located in the [devops](/devops) and [.github](/.github) folders.
