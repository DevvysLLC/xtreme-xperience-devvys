import { type NextRequest, NextResponse } from 'next/server'
export const dynamic = 'force-dynamic'
export const maxDuration = 30
export const GET = async (request: NextRequest) => {
  // Vercel sends CRON_SECRET as Authorization: Bearer <secret>
  const authHeader = request.headers.get('authorization')
  const cronSecret = process.env.CRON_SECRET
  if (!cronSecret || authHeader !== `Bearer ${cronSecret}`) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }
  const token = process.env.GITHUB_TOKEN
  const owner = process.env.GITHUB_OWNER
  const repo = process.env.GITHUB_REPO
  const workflow = process.env.GITHUB_WORKFLOW_ROCKETREZ_SYNC // e.g. "sync-rocket-rez-schedules-prod.yml"
  const ref = process.env.GITHUB_REF ?? 'main'
  if (!token || !owner || !repo || !workflow) {
    return NextResponse.json(
      { error: 'Missing GitHub configuration' },
      { status: 500 }
    )
  }
  const url = `https://api.github.com/repos/${owner}/${repo}/actions/workflows/${workflow}/dispatches`
  const response = await fetch(url, {
    method: 'POST',
    headers: {
      Authorization: `Bearer ${token}`,
      Accept: 'application/vnd.github+json',
      'X-GitHub-Api-Version': '2022-11-28',
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({
      ref,
      inputs: {} // add workflow inputs here if your YAML defines them
    })
  })
  if (!response.ok) {
    const body = await response.text()
    console.error('GitHub dispatch failed:', response.status, body)
    return NextResponse.json(
      { error: 'GitHub dispatch failed', status: response.status, body },
      { status: 502 }
    )
  }
  return NextResponse.json({
    ok: true,
    workflow,
    ref,
    triggeredAt: new Date().toISOString()
  })
}
