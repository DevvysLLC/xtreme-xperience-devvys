import { type Client, SimpleSchemaTypes } from '@datocms/cli/lib/cma-client-node'

export default async function (client: Client) {
  console.log('Creating new fields/fieldsets')

  console.log(
    'Create JSON field "Rocket Rez Seat Type Id (override)" (`rocket_rez_seat_type_id_override`) in block model "\uD83D\uDCC5 Booking - Supercar" (`booking_supercar`)'
  )
  await client.fields.create('BGZHvsRCTTu8vCgCKA_vEw', {
    id: 'LqwFGIcwTJ2C8XhoNIGylw',
    label: 'Rocket Rez Seat Type Id (override)',
    field_type: 'json',
    api_key: 'rocket_rez_seat_type_id_override',
    hint: 'Override seat type ids for specific event IDs. Supports an array of objects with keys: \n{ "event_id": "[event_id]", "seat_type_id": "[seat_type_id]"}',
    appearance: { addons: [], editor: 'json', parameters: {} }
  })

  console.log(
    'Create Single-line string field "Sendlane Embed" (`sendlane_embed`) in model "\u2709\uFE0F Form" (`form`)'
  )
  await client.fields.create('C6DjvSD1ROS8yUrlCRK5qQ', {
    id: 'SkC1epw4R9-68241CcDw9A',
    label: 'Sendlane Embed',
    field_type: 'string',
    api_key: 'sendlane_embed',
    appearance: {
      addons: [],
      editor: 'single_line',
      parameters: { heading: false, placeholder: null }
    }
  })

  console.log(
    'Create Boolean field "Allow cars to be clickable on desktop" (`allow_slide_link_desktop`) in block model "\uD83C\uDFCE\uFE0F Section - Supercar Showcase" (`section_supercar_showcase`)'
  )
  await client.fields.create('I6tUJOc9SA6B7fOaErBo1g', {
    id: 'ZdmN_PdUTGW7XhhiqYlm4w',
    label: 'Allow cars to be clickable on desktop',
    field_type: 'boolean',
    api_key: 'allow_slide_link_desktop',
    appearance: { addons: [], editor: 'boolean', parameters: {} }
  })

  console.log(
    'Create Single-line string field "Select Car Button Label" (`select_car_button_label`) in model "\uD83D\uDCC5 Booking Settings" (`booking_config`)'
  )
  await client.fields.create('e6HDmBugSWy7Ma0ZLo5vQg', {
    id: 'MPFHKg8jQj-YXUNTzthXVw',
    label: 'Select Car Button Label',
    field_type: 'string',
    api_key: 'select_car_button_label',
    appearance: {
      addons: [],
      editor: 'single_line',
      parameters: { heading: false, placeholder: null }
    },
    fieldset: { id: 'U2Pd_CCXSiWttNYxSXdX9g', type: 'fieldset' }
  })

  console.log(
    'Create Single-line string field "Remove Car Button Label" (`remove_car_button_label`) in model "\uD83D\uDCC5 Booking Settings" (`booking_config`)'
  )
  await client.fields.create('e6HDmBugSWy7Ma0ZLo5vQg', {
    id: 'M-OrTrirQ9yr-ebcZz0gVQ',
    label: 'Remove Car Button Label',
    field_type: 'string',
    api_key: 'remove_car_button_label',
    appearance: {
      addons: [],
      editor: 'single_line',
      parameters: { heading: false, placeholder: null }
    },
    fieldset: { id: 'U2Pd_CCXSiWttNYxSXdX9g', type: 'fieldset' }
  })

  console.log(
    'Create Single-line string field "Quantity Label (3 laps)" (`quantity_label_three_laps`) in model "\uD83D\uDCC5 Booking Settings" (`booking_config`)'
  )
  await client.fields.create('e6HDmBugSWy7Ma0ZLo5vQg', {
    id: 'WtizxZtVTGKdFstj7awnNw',
    label: 'Quantity Label (3 laps)',
    field_type: 'string',
    api_key: 'quantity_label_three_laps',
    appearance: {
      addons: [],
      editor: 'single_line',
      parameters: { heading: false, placeholder: null }
    },
    fieldset: { id: 'U2Pd_CCXSiWttNYxSXdX9g', type: 'fieldset' }
  })

  console.log(
    'Create Single-line string field "Quantity Label (6 laps)" (`quantity_label_six_laps`) in model "\uD83D\uDCC5 Booking Settings" (`booking_config`)'
  )
  await client.fields.create('e6HDmBugSWy7Ma0ZLo5vQg', {
    id: 'Zzuqc-bATrGAvRf8MdguIg',
    label: 'Quantity Label (6 laps)',
    field_type: 'string',
    api_key: 'quantity_label_six_laps',
    appearance: {
      addons: [],
      editor: 'single_line',
      parameters: { heading: false, placeholder: null }
    },
    fieldset: { id: 'U2Pd_CCXSiWttNYxSXdX9g', type: 'fieldset' }
  })

  console.log(
    'Create Single-line string field "Quantity Label (9 laps)" (`quantity_label_nine_laps`) in model "\uD83D\uDCC5 Booking Settings" (`booking_config`)'
  )
  await client.fields.create('e6HDmBugSWy7Ma0ZLo5vQg', {
    id: 'eyg9DiMjRtKp7dBxUtgJww',
    label: 'Quantity Label (9 laps)',
    field_type: 'string',
    api_key: 'quantity_label_nine_laps',
    appearance: {
      addons: [],
      editor: 'single_line',
      parameters: { heading: false, placeholder: null }
    },
    fieldset: { id: 'U2Pd_CCXSiWttNYxSXdX9g', type: 'fieldset' }
  })

  console.log(
    'Create Multiple-paragraph text field "Order Complete Notice" (`order_complete_notice`) in model "\uD83D\uDCC5 Booking Settings" (`booking_config`)'
  )
  await client.fields.create('e6HDmBugSWy7Ma0ZLo5vQg', {
    id: 'HcA30OmVQGemj99e5JPQzQ',
    label: 'Order Complete Notice',
    field_type: 'text',
    api_key: 'order_complete_notice',
    appearance: {
      addons: [],
      editor: 'markdown',
      parameters: {
        toolbar: ['bold', 'heading', 'italic', 'ordered_list', 'unordered_list']
      }
    },
    fieldset: { id: 'U2Pd_CCXSiWttNYxSXdX9g', type: 'fieldset' }
  })

  console.log('Update existing fields/fieldsets')

  console.log(
    'Update JSON field "Rocket Rez Seat Type Id (override)" (`rocket_rez_seat_type_id_override`) in block model "\uD83D\uDCC5 Booking - Supercar" (`booking_supercar`)'
  )
  await client.fields.update('LqwFGIcwTJ2C8XhoNIGylw', { position: 3 })

  console.log(
    'Update Single-line string field "Sendlane Embed" (`sendlane_embed`) in model "\u2709\uFE0F Form" (`form`)'
  )
  await client.fields.update('SkC1epw4R9-68241CcDw9A', { position: 6 })

  console.log(
    'Update Boolean field "Allow cars to be clickable on desktop" (`allow_slide_link_desktop`) in block model "\uD83C\uDFCE\uFE0F Section - Supercar Showcase" (`section_supercar_showcase`)'
  )
  await client.fields.update('ZdmN_PdUTGW7XhhiqYlm4w', { position: 4 })

  console.log(
    'Update Multiple-paragraph text field "Cancellation Policy" (`cancellation_policy`) in model "\uD83D\uDCC5 Booking Settings" (`booking_config`)'
  )
  await client.fields.update('dY7n2-maRn-Yo7KHV-I9iA', { position: 6 })

  console.log(
    'Update Multiple-paragraph text field "Legal Notice" (`legal_notice`) in model "\uD83D\uDCC5 Booking Settings" (`booking_config`)'
  )
  await client.fields.update('IAFpe-ovTIm2tdniBtIKfw', { position: 7 })

  console.log(
    'Update Single-line string field "Quantity Label (9 laps)" (`quantity_label_nine_laps`) in model "\uD83D\uDCC5 Booking Settings" (`booking_config`)'
  )
  await client.fields.update('eyg9DiMjRtKp7dBxUtgJww', { position: 5 })

  console.log(
    'Update fieldset "\u270F\uFE0F Content Settings" in model "\uD83D\uDCC5 Booking Settings" (`booking_config`)'
  )
  await client.fieldsets.update('U2Pd_CCXSiWttNYxSXdX9g', {
    title: '\u270F\uFE0F Content Settings'
  })

  console.log('Manage schema menu items')

  console.log(
    'Update block schema menu item for block model "\uD83D\uDDA5\uFE0F Section - Iframe" (`section_iframe`)'
  )
  await client.schemaMenuItems.update('CQzjcS0HQaK7YmyHZHY1YQ', {
    position: 67
  })
}
