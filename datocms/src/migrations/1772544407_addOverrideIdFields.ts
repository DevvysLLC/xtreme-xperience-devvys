import { type Client, SimpleSchemaTypes } from '@datocms/cli/lib/cma-client-node'

export default async function (client: Client) {
  console.log('Create new models/block models')

  console.log(
    'Create block model "Booking - Seat Type Id Override " (`booking_seat_type_id_override`)'
  )
  await client.itemTypes.create(
    {
      id: 'Rp9j9kRiQ92aYGbWhRAbBw',
      name: 'Booking - Seat Type Id Override ',
      api_key: 'booking_seat_type_id_override',
      modular_block: true,
      draft_saving_active: false,
      hint: '',
      inverse_relationships_enabled: false
    },
    {
      skip_menu_item_creation: true,
      schema_menu_item_id: 'FZ7ayphkTEed0bQPPtvf-g'
    }
  )

  console.log('Creating new fields/fieldsets')

  console.log(
    'Create Single link field "Event" (`event`) in block model "Booking - Seat Type Id Override " (`booking_seat_type_id_override`)'
  )
  await client.fields.create('Rp9j9kRiQ92aYGbWhRAbBw', {
    id: 'a0OfkO8fREegJbLKOAae_A',
    label: 'Event',
    field_type: 'link',
    api_key: 'event',
    validators: {
      item_item_type: {
        on_publish_with_unpublished_references_strategy: 'fail',
        on_reference_unpublish_strategy: 'delete_references',
        on_reference_delete_strategy: 'delete_references',
        item_types: ['C5xdhHU0TxuME6A18rivgg']
      }
    },
    appearance: {
      addons: [],
      editor: 'link_select',
      parameters: { filters: [] }
    }
  })

  console.log(
    'Create Single-line string field "Rocket Rez Seat Type Id" (`rocket_rez_seat_type_id`) in block model "Booking - Seat Type Id Override " (`booking_seat_type_id_override`)'
  )
  await client.fields.create('Rp9j9kRiQ92aYGbWhRAbBw', {
    id: 'MuAstOdRQW-I4sLqfvZYcA',
    label: 'Rocket Rez Seat Type Id',
    field_type: 'string',
    api_key: 'rocket_rez_seat_type_id',
    appearance: {
      addons: [],
      editor: 'single_line',
      parameters: { heading: false, placeholder: null }
    }
  })

  console.log(
    'Create Modular Content (Multiple blocks) field "Rocket Rez Seat Type Id Overrides" (`rocket_rez_seat_type_id_overrides`) in block model "\uD83D\uDCC5 Booking - Supercar" (`booking_supercar`)'
  )
  await client.fields.create('BGZHvsRCTTu8vCgCKA_vEw', {
    id: 'MDcLGgdqSUuhRT__jMeu7w',
    label: 'Rocket Rez Seat Type Id Overrides',
    field_type: 'rich_text',
    api_key: 'rocket_rez_seat_type_id_overrides',
    validators: {
      rich_text_blocks: { item_types: ['Rp9j9kRiQ92aYGbWhRAbBw'] }
    },
    appearance: {
      addons: [],
      editor: 'rich_text',
      parameters: { start_collapsed: false }
    }
  })

  console.log(
    'Create Single-line string field "Highlight Color" (`highlight_color`) in block model "\uD83D\uDDA5\uFE0F Section - Config" (`section_config`)'
  )
  await client.fields.create('QG68cRN5Tr6_-emTklhMAg', {
    id: 'Ybi2RvKPQkeNG5TywoIJfw',
    label: 'Highlight Color',
    field_type: 'string',
    api_key: 'highlight_color',
    appearance: {
      addons: [],
      editor: 'string_select',
      parameters: {
        options: [
          { hint: '#eb642c', label: 'Orange', value: 'orange' },
          { hint: '#c6ff00', label: 'Lime', value: 'lime' }
        ]
      }
    }
  })

  console.log(
    'Create Single-line string field "Add to cart success message" (`add_to_cart_success_message`) in model "\uD83D\uDCC5 Booking Settings" (`booking_config`)'
  )
  await client.fields.create('e6HDmBugSWy7Ma0ZLo5vQg', {
    id: 'Ah0ToId4RYGHFs8A_8w98Q',
    label: 'Add to cart success message',
    field_type: 'string',
    api_key: 'add_to_cart_success_message',
    appearance: {
      addons: [],
      editor: 'single_line',
      parameters: { heading: false, placeholder: null }
    },
    fieldset: { id: 'U2Pd_CCXSiWttNYxSXdX9g', type: 'fieldset' }
  })

  console.log(
    'Create Single-line string field "Add to cart error message" (`add_to_cart_error_message`) in model "\uD83D\uDCC5 Booking Settings" (`booking_config`)'
  )
  await client.fields.create('e6HDmBugSWy7Ma0ZLo5vQg', {
    id: 'TsaaNmDnTvWGCCYvZizeLw',
    label: 'Add to cart error message',
    field_type: 'string',
    api_key: 'add_to_cart_error_message',
    appearance: {
      addons: [],
      editor: 'single_line',
      parameters: { heading: false, placeholder: null }
    },
    fieldset: { id: 'U2Pd_CCXSiWttNYxSXdX9g', type: 'fieldset' }
  })

  console.log(
    'Create Single-line string field "Layout" (`layout`) in block model "\uD83D\uDDA5\uFE0F Section - Media Card Grid" (`section_media_card_grid`)'
  )
  await client.fields.create('fEe3XtEfRrOrChEzbCSmHw', {
    id: 'JqDwCFaiSwGW2S0Rqfu8hg',
    label: 'Layout',
    field_type: 'string',
    api_key: 'layout',
    appearance: {
      addons: [],
      editor: 'string_select',
      parameters: {
        options: [
          { hint: '', label: 'Carousel', value: 'carousel' },
          { hint: '', label: 'Grid', value: 'grid' }
        ]
      }
    }
  })

  console.log('Destroy fields in existing models/block models')

  console.log(
    'Delete JSON field "Rocket Rez Seat Type Id (override)" (`rocket_rez_seat_type_id_override`) in block model "\uD83D\uDCC5 Booking - Supercar" (`booking_supercar`)'
  )
  await client.fields.destroy('LqwFGIcwTJ2C8XhoNIGylw')

  console.log(
    'Delete Multiple-paragraph text field "Hubspot Embed Form (Deprecated)" (`embed_form`) in block model "\uD83D\uDDA5\uFE0F Section - Contact" (`section_contact`)'
  )
  await client.fields.destroy('KwYWuh1cTKCqdF7209EHmA')

  console.log('Update existing fields/fieldsets')

  console.log(
    'Update Modular Content (Multiple blocks) field "Rocket Rez Seat Type Id Overrides" (`rocket_rez_seat_type_id_overrides`) in block model "\uD83D\uDCC5 Booking - Supercar" (`booking_supercar`)'
  )
  await client.fields.update('MDcLGgdqSUuhRT__jMeu7w', { position: 3 })

  console.log(
    'Update Single-line string field "Highlight Color" (`highlight_color`) in block model "\uD83D\uDDA5\uFE0F Section - Config" (`section_config`)'
  )
  await client.fields.update('Ybi2RvKPQkeNG5TywoIJfw', { position: 4 })

  console.log(
    'Update Single-line string field "Mode" (`mode`) in block model "\uD83D\uDDA5\uFE0F Section - Config" (`section_config`)'
  )
  await client.fields.update('NIyD6NVBQ5e0KGErFHlm_Q', {
    appearance: {
      addons: [],
      editor: 'string_select',
      parameters: {
        options: [
          { hint: '#ffffff', label: 'White', value: 'white' },
          { hint: '#111111', label: 'Black', value: 'black' },
          { hint: '#f0edeb', label: 'Carrara', value: 'carrara' },
          { hint: '#eb642c', label: 'Orange', value: 'orange' },
          { hint: '#53565a', label: 'Gray', value: 'gray' },
          { hint: '#c6ff00', label: 'Lime', value: 'lime' }
        ]
      }
    }
  })

  console.log(
    'Update Single-line string field "Add to cart success message" (`add_to_cart_success_message`) in model "\uD83D\uDCC5 Booking Settings" (`booking_config`)'
  )
  await client.fields.update('Ah0ToId4RYGHFs8A_8w98Q', { position: 6 })

  console.log(
    'Update Single-line string field "Add to cart error message" (`add_to_cart_error_message`) in model "\uD83D\uDCC5 Booking Settings" (`booking_config`)'
  )
  await client.fields.update('TsaaNmDnTvWGCCYvZizeLw', { position: 7 })

  console.log(
    'Update Single-line string field "Layout" (`layout`) in block model "\uD83D\uDDA5\uFE0F Section - Media Card Grid" (`section_media_card_grid`)'
  )
  await client.fields.update('JqDwCFaiSwGW2S0Rqfu8hg', { position: 2 })

  console.log('Finalize models/block models')

  console.log(
    'Update block model "Booking - Seat Type Id Override " (`booking_seat_type_id_override`)'
  )
  await client.itemTypes.update('Rp9j9kRiQ92aYGbWhRAbBw', {
    presentation_title_field: { id: 'MuAstOdRQW-I4sLqfvZYcA', type: 'field' }
  })
}
