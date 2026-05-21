import { type Client, SimpleSchemaTypes } from '@datocms/cli/lib/cma-client-node'

export default async function (client: Client) {
  console.log('Creating new fields/fieldsets')

  console.log(
    'Create Modular Content (Single block) field "Logo Maker" (`logo_maker`) in block model "\uD83C\uDFCE\uFE0F Supercar - Model" (`supercar_model`)'
  )
  await client.fields.create('WMMAMKRaR9WsN5-kq8N-SA', {
    id: 'db1-uqiFS9OYJWCVcgaPiA',
    label: 'Logo Maker',
    field_type: 'single_block',
    api_key: 'logo_maker',
    validators: {
      single_block_blocks: { item_types: ['QHloTWPPR8Cw9V4xeFlaDg'] }
    },
    appearance: {
      addons: [],
      editor: 'framed_single_block',
      parameters: { start_collapsed: false }
    }
  })

  console.log('Update existing fields/fieldsets')

  console.log(
    'Update Modular Content (Single block) field "Logo Maker" (`logo_maker`) in block model "\uD83C\uDFCE\uFE0F Supercar - Model" (`supercar_model`)'
  )
  await client.fields.update('db1-uqiFS9OYJWCVcgaPiA', { position: 32 })

  console.log(
    'Update Single asset field "(Deprecated) Maker Logo" (`maker_logo`) in block model "\uD83C\uDFCE\uFE0F Supercar - Model" (`supercar_model`)'
  )
  await client.fields.update('BDbT3b_vT5O7382FPnJ6Kw', {
    label: '(Deprecated) Maker Logo'
  })
}
