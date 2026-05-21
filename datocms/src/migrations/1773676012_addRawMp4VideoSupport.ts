import { type Client, SimpleSchemaTypes } from '@datocms/cli/lib/cma-client-node'

export default async function (client: Client) {
  console.log('Creating new fields/fieldsets')

  console.log(
    'Create Single-line string field "Video Raw MP4 File Url" (`video_raw_mp4_file_url`) in block model "\u2699\uFE0F Core - Video" (`core_video`)'
  )
  await client.fields.create('PrRwA303RhehdZdoIR8DJA', {
    id: 'KORsxloRRq-BAR_hX1ui8A',
    label: 'Video Raw MP4 File Url',
    field_type: 'string',
    api_key: 'video_raw_mp4_file_url',
    hint: 'Use with caution. Use for above the fold videos 5-10MB',
    validators: { format: { predefined_pattern: 'url' } },
    appearance: {
      addons: [],
      editor: 'single_line',
      parameters: { heading: false, placeholder: null }
    }
  })

  console.log(
    'Create Single-line string field "Desktop Video Raw MP4 File Url" (`desktop_video_raw_mp4_file_url`) in block model "\u2699\uFE0F Core - Video" (`core_video`)'
  )
  await client.fields.create('PrRwA303RhehdZdoIR8DJA', {
    id: 'JdyyUNyuR7uLNbiyXJlEuQ',
    label: 'Desktop Video Raw MP4 File Url',
    field_type: 'string',
    api_key: 'desktop_video_raw_mp4_file_url',
    hint: 'Use with caution. Use for above the fold videos 5-10MB',
    validators: { format: { predefined_pattern: 'url' } },
    appearance: {
      addons: [],
      editor: 'single_line',
      parameters: { heading: false, placeholder: null }
    }
  })

  console.log('Update existing fields/fieldsets')

  console.log(
    'Update Single-line string field "Video Raw MP4 File Url" (`video_raw_mp4_file_url`) in block model "\u2699\uFE0F Core - Video" (`core_video`)'
  )
  await client.fields.update('KORsxloRRq-BAR_hX1ui8A', { position: 2 })

  console.log(
    'Update Single-line string field "Desktop Video Raw MP4 File Url" (`desktop_video_raw_mp4_file_url`) in block model "\u2699\uFE0F Core - Video" (`core_video`)'
  )
  await client.fields.update('JdyyUNyuR7uLNbiyXJlEuQ', { position: 4 })

  console.log('Finalize models/block models')

  console.log('Update block model "\u2699\uFE0F Core - Video" (`core_video`)')
  await client.itemTypes.update('PrRwA303RhehdZdoIR8DJA', {
    presentation_title_field: { id: 'KORsxloRRq-BAR_hX1ui8A', type: 'field' }
  })
}
