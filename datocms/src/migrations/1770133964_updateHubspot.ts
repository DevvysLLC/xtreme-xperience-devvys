import { type Client, SimpleSchemaTypes } from '@datocms/cli/lib/cma-client-node'

export default async function (client: Client) {
  console.log("Update environment's settings")
  await client.site.update({ favicon: null })

  console.log('Update existing fields/fieldsets')

  console.log(
    'Update Multiple-paragraph text field "Hubspot Embed Form" (`embed_form`) in block model "\uD83D\uDDA5\uFE0F Section - Contact" (`section_contact`)'
  )
  await client.fields.update('KwYWuh1cTKCqdF7209EHmA', {
    label: 'Hubspot Embed Form',
    hint: 'If populated, it will overwrite the Form field.\nYou can find the code in  Form Lists &gt; Actions &gt; Share &gt; Developer code (Advanced).\n(https://app.hubspot.com/forms/43829367/views/all_forms)'
  })

  console.log(
    'Update Single-line string field "Form Provider" (`form_provider`) in block model "\u2709\uFE0F Form - Model" (`form_model`)'
  )
  await client.fields.update('SFF3XDHUTISXbrYawVRw5w', {
    appearance: {
      addons: [],
      editor: 'string_select',
      parameters: {
        options: [{ hint: '', label: 'Zendesk', value: 'zendesk' }]
      }
    }
  })
}
