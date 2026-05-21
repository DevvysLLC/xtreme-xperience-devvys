import { type Client, SimpleSchemaTypes } from '@datocms/cli/lib/cma-client-node'

export default async function (client: Client) {
  console.log('Creating new fields/fieldsets')

  console.log(
    'Create Multiple-paragraph text field "Spec Modal Description" (`spec_modal_description`) in block model "\uD83C\uDFCE\uFE0F Supercar - Model" (`supercar_model`)'
  )
  await client.fields.create('WMMAMKRaR9WsN5-kq8N-SA', {
    id: 'LicRt7nKSCKgnGncIG1PKw',
    label: 'Spec Modal Description',
    field_type: 'text',
    api_key: 'spec_modal_description',
    appearance: {
      addons: [],
      editor: 'markdown',
      parameters: { toolbar: ['bold', 'italic', 'link'] }
    }
  })

  console.log(
    'Create Modular Content (Single block) field "Spec Modal Image" (`spec_modal_image`) in block model "\uD83C\uDFCE\uFE0F Supercar - Model" (`supercar_model`)'
  )
  await client.fields.create('WMMAMKRaR9WsN5-kq8N-SA', {
    id: 'LKqCjEJtTo2fku3MMt09oA',
    label: 'Spec Modal Image',
    field_type: 'single_block',
    api_key: 'spec_modal_image',
    validators: {
      single_block_blocks: { item_types: ['QHloTWPPR8Cw9V4xeFlaDg'] }
    },
    appearance: {
      addons: [],
      editor: 'framed_single_block',
      parameters: { start_collapsed: true }
    }
  })

  console.log(
    'Create Single asset field "Model Viewer 3D" (`model_viewer3d`) in block model "\uD83C\uDFCE\uFE0F Supercar - Model" (`supercar_model`)'
  )
  await client.fields.create('WMMAMKRaR9WsN5-kq8N-SA', {
    id: 'MZbFU8FMRUqWhvmKI79r1g',
    label: 'Model Viewer 3D',
    field_type: 'file',
    api_key: 'model_viewer3d',
    validators: { extension: { extensions: ['glb'] } },
    appearance: { addons: [], editor: 'file', parameters: {} }
  })

  console.log('Destroy fields in existing models/block models')

  console.log(
    'Delete Single-line string field "Starting Price for 3 Laps" (`starting_price_for3_laps`) in block model "\uD83C\uDFCE\uFE0F Supercar - Model" (`supercar_model`)'
  )
  await client.fields.destroy('KMcsPbI6RLCl2RapTdDmDQ')

  console.log('Update existing fields/fieldsets')

  console.log(
    'Update Multiple-paragraph text field "Spec Modal Description" (`spec_modal_description`) in block model "\uD83C\uDFCE\uFE0F Supercar - Model" (`supercar_model`)'
  )
  await client.fields.update('LicRt7nKSCKgnGncIG1PKw', { position: 20 })

  console.log(
    'Update Multiple links field "Supercars" (`supercars`) in block model "\uD83C\uDFCE\uFE0F Supercar - Model" (`supercar_model`)'
  )
  await client.fields.update('XlFS57GBRPSbpnHBbv6dNg', { position: 31 })

  console.log(
    'Update Modular Content (Single block) field "Spec Modal Image" (`spec_modal_image`) in block model "\uD83C\uDFCE\uFE0F Supercar - Model" (`supercar_model`)'
  )
  await client.fields.update('LKqCjEJtTo2fku3MMt09oA', { position: 28 })

  console.log('Finalize models/block models')

  console.log(
    'Update block model "\uD83C\uDFCE\uFE0F Supercar - Model" (`supercar_model`)'
  )
  await client.itemTypes.update('WMMAMKRaR9WsN5-kq8N-SA', {
    presentation_image_field: { id: 'MZbFU8FMRUqWhvmKI79r1g', type: 'field' }
  })
}
