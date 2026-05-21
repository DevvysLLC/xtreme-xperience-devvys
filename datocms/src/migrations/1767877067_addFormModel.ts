import { type Client, SimpleSchemaTypes } from '@datocms/cli/lib/cma-client-node'

export default async function (client: Client) {
  console.log('Create new models/block models')

  console.log('Create model "\u2709\uFE0F Form" (`form`)')
  await client.itemTypes.create(
    {
      id: 'C6DjvSD1ROS8yUrlCRK5qQ',
      name: '\u2709\uFE0F Form',
      api_key: 'form',
      draft_mode_active: true,
      draft_saving_active: false,
      collection_appearance: 'table',
      inverse_relationships_enabled: false
    },
    {
      skip_menu_item_creation: true,
      schema_menu_item_id: 'EiwpCg9ATuKyMEyc5x6uXQ'
    }
  )

  console.log(
    'Create block model "\u2699\uFE0F Core - Form Field Option" (`core_form_field_option`)'
  )
  await client.itemTypes.create(
    {
      id: 'DP5LyhCdT32dGAzImqibFQ',
      name: '\u2699\uFE0F Core - Form Field Option',
      api_key: 'core_form_field_option',
      modular_block: true,
      draft_saving_active: false,
      inverse_relationships_enabled: false
    },
    {
      skip_menu_item_creation: true,
      schema_menu_item_id: 'fd1l0fFKQBSFkUSv6z4GYw'
    }
  )

  console.log(
    'Create block model "\u2699\uFE0F Core - Form Field" (`core_form_field`)'
  )
  await client.itemTypes.create(
    {
      id: 'P-SwncLLQ1WdocXLX7K8nQ',
      name: '\u2699\uFE0F Core - Form Field',
      api_key: 'core_form_field',
      modular_block: true,
      draft_saving_active: false,
      inverse_relationships_enabled: false
    },
    {
      skip_menu_item_creation: true,
      schema_menu_item_id: 'CU-1MY3iR7qbBuSA6k7tbg'
    }
  )

  console.log('Create block model "\u2709\uFE0F Form - Model" (`form_model`)')
  await client.itemTypes.create(
    {
      id: 'XlZ-hHvlS8OHHXD2Org6ww',
      name: '\u2709\uFE0F Form - Model',
      api_key: 'form_model',
      modular_block: true,
      draft_saving_active: false,
      inverse_relationships_enabled: false
    },
    {
      skip_menu_item_creation: true,
      schema_menu_item_id: 'VEbHH3qERAOAP_ChpMTGtg'
    }
  )

  console.log('Creating new fields/fieldsets')

  console.log(
    'Create Single-line string field "Title Internal" (`title_internal`) in model "\u2709\uFE0F Form" (`form`)'
  )
  await client.fields.create('C6DjvSD1ROS8yUrlCRK5qQ', {
    id: 'Z18BLNWVQkOOBL7edwKHrQ',
    label: 'Title Internal',
    field_type: 'string',
    api_key: 'title_internal',
    validators: { required: {} },
    appearance: {
      addons: [],
      editor: 'single_line',
      parameters: { heading: false, placeholder: null }
    }
  })

  console.log(
    'Create Modular Content (Single block) field "Model" (`model`) in model "\u2709\uFE0F Form" (`form`)'
  )
  await client.fields.create('C6DjvSD1ROS8yUrlCRK5qQ', {
    id: 'N3hQeRmbQRqLYzEXTVop1g',
    label: 'Model',
    field_type: 'single_block',
    api_key: 'model',
    validators: {
      single_block_blocks: { item_types: ['XlZ-hHvlS8OHHXD2Org6ww'] }
    },
    appearance: {
      addons: [],
      editor: 'framed_single_block',
      parameters: { start_collapsed: false }
    }
  })

  console.log(
    'Create Single-line string field "Label" (`option_label`) in block model "\u2699\uFE0F Core - Form Field Option" (`core_form_field_option`)'
  )
  await client.fields.create('DP5LyhCdT32dGAzImqibFQ', {
    id: 'SP6Sxyb6SA6FsMOraXIPVw',
    label: 'Label',
    field_type: 'string',
    api_key: 'option_label',
    validators: { required: {} },
    appearance: {
      addons: [],
      editor: 'single_line',
      parameters: { heading: false, placeholder: null }
    }
  })

  console.log(
    'Create Single-line string field "Value" (`option_value`) in block model "\u2699\uFE0F Core - Form Field Option" (`core_form_field_option`)'
  )
  await client.fields.create('DP5LyhCdT32dGAzImqibFQ', {
    id: 'KSxN82KPQd69eSY8P0O5eg',
    label: 'Value',
    field_type: 'string',
    api_key: 'option_value',
    validators: { required: {} },
    appearance: {
      addons: [],
      editor: 'single_line',
      parameters: { heading: false, placeholder: null }
    }
  })

  console.log(
    'Create Single-line string field "Type" (`field_type`) in block model "\u2699\uFE0F Core - Form Field" (`core_form_field`)'
  )
  await client.fields.create('P-SwncLLQ1WdocXLX7K8nQ', {
    id: 'YYyxKShmTequ1k-MOl_u5A',
    label: 'Type',
    field_type: 'string',
    api_key: 'field_type',
    validators: { required: {} },
    appearance: {
      addons: [],
      editor: 'string_select',
      parameters: {
        options: [
          { hint: '', label: 'Text', value: 'text' },
          { hint: '', label: 'Email', value: 'email' },
          { hint: '', label: 'Phone', value: 'tel' },
          { hint: '', label: 'Textarea', value: 'textarea' },
          { hint: '', label: 'Select', value: 'select' }
        ]
      }
    }
  })

  console.log(
    'Create Single-line string field "Name" (`field_name`) in block model "\u2699\uFE0F Core - Form Field" (`core_form_field`)'
  )
  await client.fields.create('P-SwncLLQ1WdocXLX7K8nQ', {
    id: 'MCgw6cpgTCSyPTkArTDysQ',
    label: 'Name',
    field_type: 'string',
    api_key: 'field_name',
    validators: { required: {} },
    appearance: {
      addons: [],
      editor: 'single_line',
      parameters: { heading: false, placeholder: null }
    }
  })

  console.log(
    'Create Boolean field "Required" (`field_required`) in block model "\u2699\uFE0F Core - Form Field" (`core_form_field`)'
  )
  await client.fields.create('P-SwncLLQ1WdocXLX7K8nQ', {
    id: 'Wp38VB7yRbyLXroQ-CSSlw',
    label: 'Required',
    field_type: 'boolean',
    api_key: 'field_required',
    appearance: { addons: [], editor: 'boolean', parameters: {} }
  })

  console.log(
    'Create Single-line string field "Label" (`field_label`) in block model "\u2699\uFE0F Core - Form Field" (`core_form_field`)'
  )
  await client.fields.create('P-SwncLLQ1WdocXLX7K8nQ', {
    id: 'OZW0nbE_Semg5v5BfY_jKg',
    label: 'Label',
    field_type: 'string',
    api_key: 'field_label',
    validators: { required: {} },
    appearance: {
      addons: [],
      editor: 'single_line',
      parameters: { heading: false, placeholder: null }
    }
  })

  console.log(
    'Create Single-line string field "Placeholder" (`field_placeholder`) in block model "\u2699\uFE0F Core - Form Field" (`core_form_field`)'
  )
  await client.fields.create('P-SwncLLQ1WdocXLX7K8nQ', {
    id: 'bCvDrO3rQvWYcd48t5x5Zg',
    label: 'Placeholder',
    field_type: 'string',
    api_key: 'field_placeholder',
    appearance: {
      addons: [],
      editor: 'single_line',
      parameters: { heading: false, placeholder: null }
    }
  })

  console.log(
    'Create Single-line string field "Size" (`field_size`) in block model "\u2699\uFE0F Core - Form Field" (`core_form_field`)'
  )
  await client.fields.create('P-SwncLLQ1WdocXLX7K8nQ', {
    id: 'UaHp-0ekSmees2PExG68fA',
    label: 'Size',
    field_type: 'string',
    api_key: 'field_size',
    validators: { required: {} },
    appearance: {
      addons: [],
      editor: 'string_select',
      parameters: {
        options: [
          { hint: '', label: 'Half width', value: '50%' },
          { hint: '', label: 'Full width', value: '100%' }
        ]
      }
    },
    default_value: '100%'
  })

  console.log(
    'Create Single-line string field "Error Text" (`field_error`) in block model "\u2699\uFE0F Core - Form Field" (`core_form_field`)'
  )
  await client.fields.create('P-SwncLLQ1WdocXLX7K8nQ', {
    id: 'ApENicYdRJeWztMXJuBQPA',
    label: 'Error Text',
    field_type: 'string',
    api_key: 'field_error',
    appearance: {
      addons: [],
      editor: 'single_line',
      parameters: { heading: false, placeholder: null }
    }
  })

  console.log(
    'Create Modular Content (Multiple blocks) field "Options" (`field_options`) in block model "\u2699\uFE0F Core - Form Field" (`core_form_field`)'
  )
  await client.fields.create('P-SwncLLQ1WdocXLX7K8nQ', {
    id: 'bsTvaEWvQ_SamgjVWM5cWQ',
    label: 'Options',
    field_type: 'rich_text',
    api_key: 'field_options',
    validators: {
      rich_text_blocks: { item_types: ['DP5LyhCdT32dGAzImqibFQ'] }
    },
    appearance: {
      addons: [],
      editor: 'rich_text',
      parameters: { start_collapsed: false }
    }
  })

  console.log(
    'Create Single-line string field "Form Provider" (`form_provider`) in block model "\u2709\uFE0F Form - Model" (`form_model`)'
  )
  await client.fields.create('XlZ-hHvlS8OHHXD2Org6ww', {
    id: 'SFF3XDHUTISXbrYawVRw5w',
    label: 'Form Provider',
    field_type: 'string',
    api_key: 'form_provider',
    validators: { required: {} },
    appearance: {
      addons: [],
      editor: 'string_select',
      parameters: {
        options: [
          { hint: '', label: 'Zendesk', value: 'zendesk' },
          { hint: '', label: 'Hubspot', value: 'hubspot' }
        ]
      }
    }
  })

  console.log(
    'Create Single-line string field "Form Submit Button Text" (`form_submit_button`) in block model "\u2709\uFE0F Form - Model" (`form_model`)'
  )
  await client.fields.create('XlZ-hHvlS8OHHXD2Org6ww', {
    id: 'T2h11tr0SE6FdDiFIv2C4g',
    label: 'Form Submit Button Text',
    field_type: 'string',
    api_key: 'form_submit_button',
    appearance: {
      addons: [],
      editor: 'single_line',
      parameters: { heading: false, placeholder: null }
    }
  })

  console.log(
    'Create Single-line string field "Success Title" (`success_title`) in block model "\u2709\uFE0F Form - Model" (`form_model`)'
  )
  await client.fields.create('XlZ-hHvlS8OHHXD2Org6ww', {
    id: 'a7NQ9nHMRf2r_R9UCk8FYg',
    label: 'Success Title',
    field_type: 'string',
    api_key: 'success_title',
    appearance: {
      addons: [],
      editor: 'single_line',
      parameters: { heading: false, placeholder: null }
    }
  })

  console.log(
    'Create Multiple-paragraph text field "Success Description" (`success_description`) in block model "\u2709\uFE0F Form - Model" (`form_model`)'
  )
  await client.fields.create('XlZ-hHvlS8OHHXD2Org6ww', {
    id: 'RwMwgB4jRquiL_gkOqYYoA',
    label: 'Success Description',
    field_type: 'text',
    api_key: 'success_description',
    appearance: {
      addons: [],
      editor: 'markdown',
      parameters: { toolbar: ['bold', 'italic'] }
    }
  })

  console.log(
    'Create Modular Content (Single block) field "Success Button" (`success_button`) in block model "\u2709\uFE0F Form - Model" (`form_model`)'
  )
  await client.fields.create('XlZ-hHvlS8OHHXD2Org6ww', {
    id: 'OF-vGk1LRoyiKDy-vTb0mQ',
    label: 'Success Button',
    field_type: 'single_block',
    api_key: 'success_button',
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
    'Create Single-line string field "Error Title" (`error_title`) in block model "\u2709\uFE0F Form - Model" (`form_model`)'
  )
  await client.fields.create('XlZ-hHvlS8OHHXD2Org6ww', {
    id: 'HA49x9HbTrmVEptJBik9wA',
    label: 'Error Title',
    field_type: 'string',
    api_key: 'error_title',
    appearance: {
      addons: [],
      editor: 'single_line',
      parameters: { heading: false, placeholder: null }
    }
  })

  console.log(
    'Create Multiple-paragraph text field "Error Description" (`error_description`) in block model "\u2709\uFE0F Form - Model" (`form_model`)'
  )
  await client.fields.create('XlZ-hHvlS8OHHXD2Org6ww', {
    id: 'dwFnqzmSSy25jiein4RpZw',
    label: 'Error Description',
    field_type: 'text',
    api_key: 'error_description',
    appearance: {
      addons: [],
      editor: 'markdown',
      parameters: { toolbar: ['bold', 'italic'] }
    }
  })

  console.log(
    'Create Modular Content (Multiple blocks) field "Form Fields" (`form_fields`) in block model "\u2709\uFE0F Form - Model" (`form_model`)'
  )
  await client.fields.create('XlZ-hHvlS8OHHXD2Org6ww', {
    id: 'M2l6x8BITdeyMvbhq0LY7A',
    label: 'Form Fields',
    field_type: 'rich_text',
    api_key: 'form_fields',
    validators: {
      rich_text_blocks: { item_types: ['P-SwncLLQ1WdocXLX7K8nQ'] }
    },
    appearance: {
      addons: [],
      editor: 'rich_text',
      parameters: { start_collapsed: false }
    }
  })

  console.log(
    'Create Single link field "Form" (`form`) in block model "\uD83D\uDDA5\uFE0F Section - Contact" (`section_contact`)'
  )
  await client.fields.create('Bd_J_3MrS6qpjlxzYbIssw', {
    id: 'KziIs4ZNSkebpuBko13wRQ',
    label: 'Form',
    field_type: 'link',
    api_key: 'form',
    validators: {
      item_item_type: {
        on_publish_with_unpublished_references_strategy: 'fail',
        on_reference_unpublish_strategy: 'delete_references',
        on_reference_delete_strategy: 'delete_references',
        item_types: ['C6DjvSD1ROS8yUrlCRK5qQ']
      }
    },
    appearance: { addons: [], editor: 'link_select', parameters: {} }
  })

  console.log('Finalize models/block models')

  console.log('Update model "\u2709\uFE0F Form" (`form`)')
  await client.itemTypes.update('C6DjvSD1ROS8yUrlCRK5qQ', {
    presentation_title_field: { id: 'Z18BLNWVQkOOBL7edwKHrQ', type: 'field' },
    title_field: { id: 'Z18BLNWVQkOOBL7edwKHrQ', type: 'field' }
  })

  console.log(
    'Update block model "\u2699\uFE0F Core - Form Field Option" (`core_form_field_option`)'
  )
  await client.itemTypes.update('DP5LyhCdT32dGAzImqibFQ', {
    presentation_title_field: { id: 'SP6Sxyb6SA6FsMOraXIPVw', type: 'field' }
  })

  console.log(
    'Update block model "\u2699\uFE0F Core - Form Field" (`core_form_field`)'
  )
  await client.itemTypes.update('P-SwncLLQ1WdocXLX7K8nQ', {
    presentation_title_field: { id: 'YYyxKShmTequ1k-MOl_u5A', type: 'field' }
  })

  console.log('Update block model "\u2709\uFE0F Form - Model" (`form_model`)')
  await client.itemTypes.update('XlZ-hHvlS8OHHXD2Org6ww', {
    presentation_title_field: { id: 'SFF3XDHUTISXbrYawVRw5w', type: 'field' }
  })

  console.log('Manage menu items')

  console.log('Create menu item "\u2709\uFE0F Form"')
  await client.menuItems.create({
    id: 'CRTYYLpfRW6rVWGjvnyUFA',
    label: '\u2709\uFE0F Form',
    item_type: { id: 'C6DjvSD1ROS8yUrlCRK5qQ', type: 'item_type' }
  })

  console.log('Create menu item "Event"')
  await client.menuItems.create({
    id: 'Ho6Tz5a5SpiQPuio857Gww',
    label: 'Event',
    item_type: { id: 'C5xdhHU0TxuME6A18rivgg', type: 'item_type' }
  })

  console.log('Update menu item "Event"')
  await client.menuItems.update('Ho6Tz5a5SpiQPuio857Gww', { position: 14 })

  console.log('Update menu item "\u2709\uFE0F Form"')
  await client.menuItems.update('CRTYYLpfRW6rVWGjvnyUFA', { position: 15 })

  console.log('Update menu item "\u270F\uFE0F Policy"')
  await client.menuItems.update('clwBsWn-Q4qSzwBBflQL_w', { position: 16 })

  console.log('Update menu item "\u270F\uFE0F Post"')
  await client.menuItems.update('Ojhd_c9RRpCB0KcWjQZwvA', { position: 17 })

  console.log('Update menu item "\u270F\uFE0F Category"')
  await client.menuItems.update('cAWLaWnwQZah2WfmNg4RGg', { position: 18 })

  console.log('Manage schema menu items')

  console.log(
    'Update model schema menu item for model "\u2709\uFE0F Form" (`form`)'
  )
  await client.schemaMenuItems.update('EiwpCg9ATuKyMEyc5x6uXQ', {
    position: 15
  })

  console.log(
    'Update block schema menu item for block model "\u2709\uFE0F Form - Model" (`form_model`)'
  )
  await client.schemaMenuItems.update('VEbHH3qERAOAP_ChpMTGtg', {
    position: 38
  })

  console.log(
    'Update block schema menu item for block model "\uD83D\uDCB5 Section - Addons Grid" (`section_addons_grid`)'
  )
  await client.schemaMenuItems.update('eL0Bup0rQn2qFOFYFty-2Q', {
    position: 42
  })
}
