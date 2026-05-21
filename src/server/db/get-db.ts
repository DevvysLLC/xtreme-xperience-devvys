import { drizzle } from 'drizzle-orm/node-postgres'
import { Pool } from 'pg'
import { z } from 'zod'
import { AppError } from '../../core/errors/app-error'
import * as schema from '../../db/schema'

const Env = z.object({
  DATABASE_URL: z.string().min(1)
})

let pool: Pool | null = null

export const getDb = () => {
  const envResult = Env.safeParse(process.env)
  if (!envResult.success) {
    throw new AppError('DATABASE_URL environment variable is not set', {
      traceTag: 'db.getDb'
    })
  }

  const { DATABASE_URL } = envResult.data

  pool =
    pool ??
    new Pool({
      connectionString: DATABASE_URL
    })

  return drizzle(pool, { schema })
}
