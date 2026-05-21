import { type Client, SimpleSchemaTypes } from '@datocms/cli/lib/cma-client-node'

export default async function (client: Client) {
  console.log('Creating new fields/fieldsets')

  console.log(
    'Create fieldset "404" in model "\uD83C\uDF0E Global Settings" (`global_config`)'
  )
  await client.fieldsets.create('AJkWIHW1QnSBRleF4BAbvQ', {
    id: 'cXttHg7JRyukzIRlJkVRVA',
    title: '404',
    collapsible: true,
    start_collapsed: true
  })

  console.log(
    'Create Single-line string field "Title 404" (`title404`) in model "\uD83C\uDF0E Global Settings" (`global_config`)'
  )
  await client.fields.create('AJkWIHW1QnSBRleF4BAbvQ', {
    id: 'SXiW9nUyQGGAF0EfXWTbTg',
    label: 'Title 404',
    field_type: 'string',
    api_key: 'title404',
    appearance: {
      addons: [],
      editor: 'single_line',
      parameters: { heading: false, placeholder: null }
    },
    fieldset: { id: 'cXttHg7JRyukzIRlJkVRVA', type: 'fieldset' }
  })

  console.log(
    'Create Single-line string field "Subtitle 404" (`subtitle404`) in model "\uD83C\uDF0E Global Settings" (`global_config`)'
  )
  await client.fields.create('AJkWIHW1QnSBRleF4BAbvQ', {
    id: 'Eqyvn6i8Q0istwtHV3ShbQ',
    label: 'Subtitle 404',
    field_type: 'string',
    api_key: 'subtitle404',
    appearance: {
      addons: [],
      editor: 'single_line',
      parameters: { heading: false, placeholder: null }
    },
    fieldset: { id: 'cXttHg7JRyukzIRlJkVRVA', type: 'fieldset' }
  })

  console.log(
    'Create Multiple-paragraph text field "Description 404" (`description404`) in model "\uD83C\uDF0E Global Settings" (`global_config`)'
  )
  await client.fields.create('AJkWIHW1QnSBRleF4BAbvQ', {
    id: 'IvLE20U8RL6deyoLu5gqLg',
    label: 'Description 404',
    field_type: 'text',
    api_key: 'description404',
    appearance: {
      addons: [],
      editor: 'markdown',
      parameters: { toolbar: ['bold', 'italic', 'link'] }
    },
    fieldset: { id: 'cXttHg7JRyukzIRlJkVRVA', type: 'fieldset' }
  })

  console.log(
    'Create Modular Content (Multiple blocks) field "CTAs 404" (`ctas404`) in model "\uD83C\uDF0E Global Settings" (`global_config`)'
  )
  await client.fields.create('AJkWIHW1QnSBRleF4BAbvQ', {
    id: 'Ndhj_AeiRXO0XTEELuJeqA',
    label: 'CTAs 404',
    field_type: 'rich_text',
    api_key: 'ctas404',
    validators: {
      rich_text_blocks: { item_types: ['Dpb0LeFvRym9PXvdyVaIew'] },
      size: { min: 0, max: 2 }
    },
    appearance: {
      addons: [],
      editor: 'rich_text',
      parameters: { start_collapsed: false }
    },
    fieldset: { id: 'cXttHg7JRyukzIRlJkVRVA', type: 'fieldset' }
  })

  console.log('Update existing fields/fieldsets')

  console.log(
    'Update Single-line string field "Title 404" (`title404`) in model "\uD83C\uDF0E Global Settings" (`global_config`)'
  )
  await client.fields.update('SXiW9nUyQGGAF0EfXWTbTg', { position: 0 })

  console.log(
    'Update Single-line string field "Subtitle 404" (`subtitle404`) in model "\uD83C\uDF0E Global Settings" (`global_config`)'
  )
  await client.fields.update('Eqyvn6i8Q0istwtHV3ShbQ', { position: 1 })

  console.log(
    'Update Multiple-paragraph text field "Description 404" (`description404`) in model "\uD83C\uDF0E Global Settings" (`global_config`)'
  )
  await client.fields.update('IvLE20U8RL6deyoLu5gqLg', { position: 2 })

  console.log(
    'Update Modular Content (Multiple blocks) field "CTAs 404" (`ctas404`) in model "\uD83C\uDF0E Global Settings" (`global_config`)'
  )
  await client.fields.update('Ndhj_AeiRXO0XTEELuJeqA', { position: 3 })

  console.log(
    'Update Single asset field "(DEPRECATED) Audio" (`audio`) in block model "\uD83C\uDFCE\uFE0F Section - Supercar Brand Hero" (`section_supercar_brand_hero`)'
  )
  await client.fields.update('SrAInfX0RvmAJnruDJ63eQ', {
    label: '(DEPRECATED) Audio'
  })
}
