import { type Client, SimpleSchemaTypes } from '@datocms/cli/lib/cma-client-node'

export default async function (client: Client) {
  console.log('Creating new fields/fieldsets')

  console.log(
    'Create Single-line string field "Custom CSS Gradient" (`custom_css_gradient`) in block model "\u2699\uFE0F Core - Gradient" (`core_gradient`)'
  )
  await client.fields.create('TOfj9tVmS320OVdSwEzVLQ', {
    id: 'Hvx8tLWtQGG8qShgIz14Iw',
    label: 'Custom CSS Gradient',
    field_type: 'string',
    api_key: 'custom_css_gradient',
    appearance: {
      addons: [],
      editor: 'single_line',
      parameters: { heading: false, placeholder: null }
    }
  })

  console.log(
    'Create Single-line string field "Target" (`target`) in model "\u27A1\uFE0F Navigation" (`navigation_item`)'
  )
  await client.fields.create('dnuYSe4hTg2GK6p5aRlZZQ', {
    id: 'Hbl7AwsbTquwgy5Xt638SQ',
    label: 'Target',
    field_type: 'string',
    api_key: 'target',
    appearance: {
      addons: [],
      editor: 'string_select',
      parameters: {
        options: [
          { hint: '', label: 'Self', value: '_self' },
          { hint: '', label: 'Blank', value: '_blank' }
        ]
      }
    }
  })

  console.log(
    'Create Multiple-paragraph text field "Large Text" (`large_text`) in block model "\uD83D\uDDA5\uFE0F Section - Hero" (`section_hero`)'
  )
  await client.fields.create('foSIpVN8RVeYKx6DoIYa0Q', {
    id: 'eOdka7OzSR6O5BlJtNy7iQ',
    label: 'Large Text',
    field_type: 'text',
    api_key: 'large_text',
    appearance: {
      addons: [],
      editor: 'markdown',
      parameters: { toolbar: ['bold', 'italic', 'link'] }
    }
  })

  console.log('Update existing fields/fieldsets')

  console.log(
    'Update Multiple-paragraph text field "Description" (`description`) in block model "\uD83D\uDDA5\uFE0F Section - Media Hero" (`section_media_hero`)'
  )
  await client.fields.update('UpIwyr8LRNusMEdIlFF1FQ', {
    appearance: {
      addons: [],
      editor: 'markdown',
      parameters: { toolbar: ['bold', 'italic', 'link'] }
    }
  })

  console.log(
    'Update Single-line string field "Target" (`target`) in model "\u27A1\uFE0F Navigation" (`navigation_item`)'
  )
  await client.fields.update('Hbl7AwsbTquwgy5Xt638SQ', { position: 3 })

  console.log(
    'Update Multiple-paragraph text field "Large Text" (`large_text`) in block model "\uD83D\uDDA5\uFE0F Section - Hero" (`section_hero`)'
  )
  await client.fields.update('eOdka7OzSR6O5BlJtNy7iQ', { position: 4 })
}
