import { type Client, SimpleSchemaTypes } from '@datocms/cli/lib/cma-client-node'

export default async function (client: Client) {
  console.log('Creating new fields/fieldsets')

  console.log(
    'Create fieldset "\uD83C\uDF0E Facebook" in model "\uD83C\uDF0E Global Settings" (`global_config`)'
  )
  await client.fieldsets.create('AJkWIHW1QnSBRleF4BAbvQ', {
    id: 'RFeX7fiwSIW68_hYjxtuFw',
    title: '\uD83C\uDF0E Facebook',
    collapsible: true,
    start_collapsed: true
  })

  console.log(
    'Create Boolean field "Enable Facebook Pixel" (`enable_facebook_pixel`) in model "\uD83C\uDF0E Global Settings" (`global_config`)'
  )
  await client.fields.create('AJkWIHW1QnSBRleF4BAbvQ', {
    id: 'ZyIDzYRUSWi9ONTu7k8bcA',
    label: 'Enable Facebook Pixel',
    field_type: 'boolean',
    api_key: 'enable_facebook_pixel',
    appearance: { addons: [], editor: 'boolean', parameters: {} },
    fieldset: { id: 'RFeX7fiwSIW68_hYjxtuFw', type: 'fieldset' }
  })

  console.log(
    'Create Single-line string field "Upsells Title" (`upsells_title`) in model "\uD83D\uDCC5 Booking Settings" (`booking_config`)'
  )
  await client.fields.create('e6HDmBugSWy7Ma0ZLo5vQg', {
    id: 'JjD5mMbrS4Ccpds-9v4VRQ',
    label: 'Upsells Title',
    field_type: 'string',
    api_key: 'upsells_title',
    appearance: {
      addons: [],
      editor: 'single_line',
      parameters: { heading: false, placeholder: null }
    },
    fieldset: { id: 'TBlRe9jxR1KN9QvRxknGNQ', type: 'fieldset' }
  })

  console.log(
    'Create Multiple-paragraph text field "Upsells Description" (`upsells_description`) in model "\uD83D\uDCC5 Booking Settings" (`booking_config`)'
  )
  await client.fields.create('e6HDmBugSWy7Ma0ZLo5vQg', {
    id: 'fxKpSdC5Q6iB1uUPj-jliQ',
    label: 'Upsells Description',
    field_type: 'text',
    api_key: 'upsells_description',
    appearance: {
      addons: [],
      editor: 'markdown',
      parameters: { toolbar: ['bold', 'italic'] }
    },
    fieldset: { id: 'TBlRe9jxR1KN9QvRxknGNQ', type: 'fieldset' }
  })

  console.log(
    'Create Single-line string field "Reserved Cart" (`reserved_cart`) in model "\uD83D\uDCC5 Booking Settings" (`booking_config`)'
  )
  await client.fields.create('e6HDmBugSWy7Ma0ZLo5vQg', {
    id: 'at0D6eoLQqG7Oq2iNCd7tA',
    label: 'Reserved Cart',
    field_type: 'string',
    api_key: 'reserved_cart',
    hint: 'If populated, it will display below Order Summary. Use {time} to output the time left.',
    appearance: {
      addons: [],
      editor: 'single_line',
      parameters: { heading: false, placeholder: null }
    },
    default_value: 'We have reserved your cart for [time]',
    fieldset: { id: 'TBlRe9jxR1KN9QvRxknGNQ', type: 'fieldset' }
  })

  console.log('Update existing fields/fieldsets')

  console.log(
    'Update Boolean field "Enable Facebook Pixel" (`enable_facebook_pixel`) in model "\uD83C\uDF0E Global Settings" (`global_config`)'
  )
  await client.fields.update('ZyIDzYRUSWi9ONTu7k8bcA', { position: 0 })

  console.log(
    'Update Multiple links field "Upsell" (`upsell`) in model "\uD83D\uDCC5 Booking Settings" (`booking_config`)'
  )
  await client.fields.update('UQPlM0VXSLuXVsYla5HOBQ', { position: 6 })

  console.log(
    'Update Integer number field "Price" (`price`) in block model "\u2699\uFE0F Core - Price" (`core_price`)'
  )
  await client.fields.update('TI1xh5apRWWeNyGz46nXEQ', { hint: 'In cents' })

  console.log(
    'Update Integer number field "Compare At Price" (`compare_at_price`) in block model "\u2699\uFE0F Core - Price" (`core_price`)'
  )
  await client.fields.update('b3r3CEbaSS-dJCSqj1IBrQ', { hint: 'In cents' })

  console.log('Finalize models/block models')

  console.log('Update model "\uD83D\uDCC5 Booking Settings" (`booking_config`)')
  await client.itemTypes.update('e6HDmBugSWy7Ma0ZLo5vQg', {
    presentation_title_field: { id: 'JjD5mMbrS4Ccpds-9v4VRQ', type: 'field' },
    title_field: { id: 'JjD5mMbrS4Ccpds-9v4VRQ', type: 'field' }
  })
}
