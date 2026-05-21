import { entriesToXml, getEntriesForSegment, isSegment } from '../_lib/entries'

export const revalidate = 3600

export const GET = async (
  _request: Request,
  props: { params: Promise<{ slug: string }> }
): Promise<Response> => {
  const { slug } = await props.params
  const segment = slug.replace(/\.xml$/, '')

  if (!isSegment(segment)) {
    return new Response('Not found', { status: 404 })
  }

  const entries = await getEntriesForSegment(segment)

  return new Response(entriesToXml(entries), {
    headers: { 'Content-Type': 'application/xml' }
  })
}
