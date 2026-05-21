import { defineConfig } from 'drizzle-kit'
import { z } from 'zod'

const Env = z.object({
  DATABASE_URL_NON_POOLING: z.string().min(1)
})

const envResult = Env.safeParse(process.env)

if (!envResult.success) {
  console.error(
    'Invalid environment variable configuration:',
    JSON.stringify(envResult.error.issues[0], null, 2)
  )
  if (envResult.error.issues.length > 1) {
    console.error(JSON.stringify(envResult.error.issues.slice(1), null, 2))
  }
  throw new Error('Invalid environment variable configuration')
}

const { DATABASE_URL_NON_POOLING } = envResult.data

export default defineConfig({
  breakpoints: true,
  dbCredentials: { url: DATABASE_URL_NON_POOLING },
  dialect: 'postgresql',
  out: './db/migrations',
  schema: './src/db/schema/**/*.ts',
  schemaFilter: ['app'],
  strict: true,
  verbose: true
})
