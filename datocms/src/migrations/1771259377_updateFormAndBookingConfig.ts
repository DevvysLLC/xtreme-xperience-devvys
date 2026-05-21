import { type Client, SimpleSchemaTypes } from '@datocms/cli/lib/cma-client-node'

export default async function (client: Client) {
  console.log('Creating new fields/fieldsets')

  console.log(
    'Create fieldset "\uD83D\uDCC6 Booking" in model "\uD83C\uDF0E Global Settings" (`global_config`)'
  )
  await client.fieldsets.create('AJkWIHW1QnSBRleF4BAbvQ', {
    id: 'JaRuEC5JSx-0SNPby9tJQg',
    title: '\uD83D\uDCC6 Booking',
    collapsible: true,
    start_collapsed: true
  })

  console.log(
    'Create Boolean field "Enable Legacy Booking" (`booking_enable_legacy_booking`) in model "\uD83C\uDF0E Global Settings" (`global_config`)'
  )
  await client.fields.create('AJkWIHW1QnSBRleF4BAbvQ', {
    id: 'HZhsxwdlR-66_fXRzeJ6gQ',
    label: 'Enable Legacy Booking',
    field_type: 'boolean',
    api_key: 'booking_enable_legacy_booking',
    appearance: { addons: [], editor: 'boolean', parameters: {} },
    fieldset: { id: 'JaRuEC5JSx-0SNPby9tJQg', type: 'fieldset' }
  })

  console.log(
    'Create Single-line string field "Handle" (`handle`) in model "\u2709\uFE0F Form" (`form`)'
  )
  await client.fields.create('C6DjvSD1ROS8yUrlCRK5qQ', {
    id: 'Ik5CUshlSfqjRUUNka3pdA',
    label: 'Handle',
    field_type: 'string',
    api_key: 'handle',
    validators: { unique: {} },
    appearance: {
      addons: [],
      editor: 'single_line',
      parameters: { heading: false, placeholder: null }
    }
  })

  console.log(
    'Create Single-line string field "Iframe Embed" (`iframe_embed`) in model "\u2709\uFE0F Form" (`form`)'
  )
  await client.fields.create('C6DjvSD1ROS8yUrlCRK5qQ', {
    id: 'T1CnN253RtKNKSsC10H_9w',
    label: 'Iframe Embed',
    field_type: 'string',
    api_key: 'iframe_embed',
    appearance: {
      addons: [],
      editor: 'single_line',
      parameters: { heading: false, placeholder: null }
    }
  })

  console.log(
    'Create Single-line string field "Hubspot Version" (`hubspot_version`) in model "\u2709\uFE0F Form" (`form`)'
  )
  await client.fields.create('C6DjvSD1ROS8yUrlCRK5qQ', {
    id: 'Q8XfMpEfQEmubJtZA1Devg',
    label: 'Hubspot Version',
    field_type: 'string',
    api_key: 'hubspot_version',
    appearance: {
      addons: [],
      editor: 'string_select',
      parameters: {
        options: [
          { hint: '', label: 'Version 2', value: 'v2' },
          { hint: '', label: 'Version 4', value: 'v4' }
        ]
      }
    }
  })

  console.log(
    'Create Single-line string field "Hubspot Embed" (`hubspot_embed`) in model "\u2709\uFE0F Form" (`form`)'
  )
  await client.fields.create('C6DjvSD1ROS8yUrlCRK5qQ', {
    id: 'R7f2QuVXTpqxXVYqL_ZhHA',
    label: 'Hubspot Embed',
    field_type: 'string',
    api_key: 'hubspot_embed',
    appearance: {
      addons: [],
      editor: 'single_line',
      parameters: { heading: false, placeholder: null }
    }
  })

  console.log(
    'Create Single-line string field "Layout" (`layout`) in block model "\uD83C\uDFCE\uFE0F Section - Supercar Grid Config" (`section_supercar_grid_config`)'
  )
  await client.fields.create('DBzu2ruuTDyK6arjZwLMkg', {
    id: 'DY7-x00RRayXEU1fFmkFJA',
    label: 'Layout',
    field_type: 'string',
    api_key: 'layout',
    appearance: {
      addons: [],
      editor: 'string_select',
      parameters: {
        options: [
          { hint: '', label: 'Tabs', value: 'tabs' },
          { hint: '', label: 'Stacked', value: 'stacked' }
        ]
      }
    }
  })

  console.log(
    'Create Modular Content (Single block) field "Notify Me CTA" (`notify_me_cta`) in block model "\uD83D\uDEE3\uFE0F Track - Model" (`track_model`)'
  )
  await client.fields.create('bar4Ch5hTFKfs2wLU2k63A', {
    id: 'CFrd_72lR0mCU7mlAfT_kw',
    label: 'Notify Me CTA',
    field_type: 'single_block',
    api_key: 'notify_me_cta',
    hint: 'This is show when the track has no upcoming events',
    validators: {
      single_block_blocks: { item_types: ['Dpb0LeFvRym9PXvdyVaIew'] }
    },
    appearance: {
      addons: [],
      editor: 'framed_single_block',
      parameters: { start_collapsed: false }
    }
  })

  console.log(
    'Create Boolean field "Show Back Link" (`show_back_link`) in model "\uD83D\uDCC5 Booking Settings" (`booking_config`)'
  )
  await client.fields.create('e6HDmBugSWy7Ma0ZLo5vQg', {
    id: 'BFwBP7xiTk2fzvxBcZ6JRA',
    label: 'Show Back Link',
    field_type: 'boolean',
    api_key: 'show_back_link',
    appearance: { addons: [], editor: 'boolean', parameters: {} },
    fieldset: { id: 'TBlRe9jxR1KN9QvRxknGNQ', type: 'fieldset' }
  })

  console.log(
    'Create Modular Content (Single block) field "Back Link" (`back_link`) in model "\uD83D\uDCC5 Booking Settings" (`booking_config`)'
  )
  await client.fields.create('e6HDmBugSWy7Ma0ZLo5vQg', {
    id: 'X4XCyJTORI2SsOLlEkqfWQ',
    label: 'Back Link',
    field_type: 'single_block',
    api_key: 'back_link',
    validators: {
      single_block_blocks: { item_types: ['Dpb0LeFvRym9PXvdyVaIew'] }
    },
    appearance: {
      addons: [],
      editor: 'framed_single_block',
      parameters: { start_collapsed: false }
    },
    fieldset: { id: 'TBlRe9jxR1KN9QvRxknGNQ', type: 'fieldset' }
  })

  console.log('Update existing fields/fieldsets')

  console.log(
    'Update fieldset "\uD83D\uDCC6 Booking" in model "\uD83C\uDF0E Global Settings" (`global_config`)'
  )
  await client.fieldsets.update('JaRuEC5JSx-0SNPby9tJQg', { position: 3 })

  console.log(
    'Update Boolean field "Enable Legacy Booking" (`booking_enable_legacy_booking`) in model "\uD83C\uDF0E Global Settings" (`global_config`)'
  )
  await client.fields.update('HZhsxwdlR-66_fXRzeJ6gQ', { position: 0 })

  console.log(
    'Update Single link field "Form" (`form`) in block model "\uD83D\uDDA5\uFE0F Section - Contact" (`section_contact`)'
  )
  await client.fields.update('KziIs4ZNSkebpuBko13wRQ', { position: 5 })

  console.log(
    'Update Multiple-paragraph text field "Hubspot Embed Form (Deprecated)" (`embed_form`) in block model "\uD83D\uDDA5\uFE0F Section - Contact" (`section_contact`)'
  )
  await client.fields.update('KwYWuh1cTKCqdF7209EHmA', {
    label: 'Hubspot Embed Form (Deprecated)'
  })

  console.log(
    'Update Modular Content (Single block) field "Model" (`model`) in model "\u2709\uFE0F Form" (`form`)'
  )
  await client.fields.update('N3hQeRmbQRqLYzEXTVop1g', { position: 6 })

  console.log(
    'Update Single-line string field "Layout" (`layout`) in block model "\uD83C\uDFCE\uFE0F Section - Supercar Grid Config" (`section_supercar_grid_config`)'
  )
  await client.fields.update('DY7-x00RRayXEU1fFmkFJA', { position: 4 })

  console.log(
    'Update Single-line string field "Action" (`action`) in block model "\u2699\uFE0F Core - CTA" (`core_cta`)'
  )
  await client.fields.update('Cpd1WKRnTciXkWrG-28WfA', {
    appearance: {
      addons: [],
      editor: 'string_select',
      parameters: {
        options: [
          { hint: '', label: 'Scroll To', value: 'scrollto:section' },
          { hint: '', label: 'Open Drawer', value: 'open:drawer' },
          { hint: '', label: 'Open Form', value: 'open:form' }
        ]
      }
    }
  })

  console.log(
    'Update Single-line string field "(DEPRECATED) HubSpot Form ID" (`form_hubspot_guid`) in block model "\u2709\uFE0F Form - Model" (`form_model`)'
  )
  await client.fields.update('Br0qSlFTQ7GgS8hpmrFYug', { position: 9 })

  console.log(
    'Update Modular Content (Single block) field "Notify Me CTA" (`notify_me_cta`) in block model "\uD83D\uDEE3\uFE0F Track - Model" (`track_model`)'
  )
  await client.fields.update('CFrd_72lR0mCU7mlAfT_kw', { position: 30 })
}
