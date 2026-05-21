import { type Client, SimpleSchemaTypes } from '@datocms/cli/lib/cma-client-node'

export default async function (client: Client) {
  console.log('Creating new fields/fieldsets')

  console.log(
    'Create Single-line string field "Contact Phone Number" (`contact_phone_number`) in model "\uD83D\uDD27 Global Config" (`global_config`)'
  )
  await client.fields.create('AJkWIHW1QnSBRleF4BAbvQ', {
    id: 'KkWVaUAjTAWRukXH5rL5lA',
    label: 'Contact Phone Number',
    field_type: 'string',
    api_key: 'contact_phone_number',
    appearance: {
      addons: [],
      editor: 'single_line',
      parameters: { heading: false, placeholder: null }
    }
  })

  console.log('Finalize models/block models')

  console.log('Update model "\uD83D\uDD27 Global Config" (`global_config`)')
  await client.itemTypes.update('AJkWIHW1QnSBRleF4BAbvQ', {
    presentation_title_field: { id: 'KkWVaUAjTAWRukXH5rL5lA', type: 'field' },
    title_field: { id: 'KkWVaUAjTAWRukXH5rL5lA', type: 'field' }
  })
}
