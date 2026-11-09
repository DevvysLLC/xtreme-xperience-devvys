import { readFile } from 'node:fs/promises'
import { join } from 'node:path'

export const GET = async () => {
  const filePath = join(
    process.cwd(),
    'public',
    'tools',
    'event-roi-calculator.html'
  )
  const html = await readFile(filePath, 'utf8')

  return new Response(html, {
    headers: {
      'Content-Type': 'text/html; charset=utf-8'
    }
  })
}

