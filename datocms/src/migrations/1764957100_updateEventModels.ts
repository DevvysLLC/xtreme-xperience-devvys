import { type Client, SimpleSchemaTypes } from '@datocms/cli/lib/cma-client-node'

export default async function (client: Client) {
  console.log('Creating new fields/fieldsets')

  console.log(
    'Create Single-line string field "Sticky Track Finder Heading" (`sticky_track_finder_heading`) in model "\uD83D\uDD27 Global Settings" (`global_config`)'
  )
  await client.fields.create('AJkWIHW1QnSBRleF4BAbvQ', {
    id: 'UIlV3VrXQd-IBFlU6aPiSA',
    label: 'Sticky Track Finder Heading',
    field_type: 'string',
    api_key: 'sticky_track_finder_heading',
    appearance: {
      addons: [],
      editor: 'single_line',
      parameters: { heading: false, placeholder: null }
    }
  })

  console.log(
    'Create Single link field "Sticky Track Finder Links" (`sticky_track_finder_links`) in model "\uD83D\uDD27 Global Settings" (`global_config`)'
  )
  await client.fields.create('AJkWIHW1QnSBRleF4BAbvQ', {
    id: 'E_SEG13FSQ2UyVbkmE6aEg',
    label: 'Sticky Track Finder Links',
    field_type: 'link',
    api_key: 'sticky_track_finder_links',
    validators: {
      item_item_type: {
        on_publish_with_unpublished_references_strategy: 'fail',
        on_reference_unpublish_strategy: 'delete_references',
        on_reference_delete_strategy: 'delete_references',
        item_types: ['dnuYSe4hTg2GK6p5aRlZZQ']
      }
    },
    appearance: { addons: [], editor: 'link_select', parameters: {} }
  })

  console.log(
    'Create Modular Content (Multiple blocks) field "CTAs" (`ctas`) in block model "\uD83D\uDEE3\uFE0F Section - Track Spec" (`section_track_spec`)'
  )
  await client.fields.create('FOo5sFWlS-6DEPY76lvhww', {
    id: 'K-z0pLyLS7SKHeQdrEq5bA',
    label: 'CTAs',
    field_type: 'rich_text',
    api_key: 'ctas',
    validators: {
      rich_text_blocks: { item_types: ['Dpb0LeFvRym9PXvdyVaIew'] },
      size: { min: 0, max: 2 }
    },
    appearance: {
      addons: [],
      editor: 'rich_text',
      parameters: { start_collapsed: true }
    }
  })

  console.log(
    'Create Single-line string field "Spec Title" (`spec_title`) in block model "\uD83D\uDEE3\uFE0F Track - Model" (`track_model`)'
  )
  await client.fields.create('bar4Ch5hTFKfs2wLU2k63A', {
    id: 'fM3G2Q_fRFapjhqD7U-dPg',
    label: 'Spec Title',
    field_type: 'string',
    api_key: 'spec_title',
    appearance: {
      addons: [],
      editor: 'single_line',
      parameters: { heading: false, placeholder: null }
    }
  })

  console.log(
    'Create Modular Content (Single block) field "Spec Media" (`spec_media`) in block model "\uD83D\uDEE3\uFE0F Track - Model" (`track_model`)'
  )
  await client.fields.create('bar4Ch5hTFKfs2wLU2k63A', {
    id: 'QrGDB2ROTIW7Ly0kgV0TCQ',
    label: 'Spec Media',
    field_type: 'single_block',
    api_key: 'spec_media',
    hint: 'Used in the specifications section. If empty, it will fallback to Featured Media',
    validators: {
      single_block_blocks: {
        item_types: ['PrRwA303RhehdZdoIR8DJA', 'QHloTWPPR8Cw9V4xeFlaDg']
      }
    },
    appearance: {
      addons: [],
      editor: 'framed_single_block',
      parameters: { start_collapsed: true }
    }
  })

  console.log(
    'Create Single asset field "Track SVG Dark" (`track_svg_dark`) in block model "\uD83D\uDEE3\uFE0F Track - Model" (`track_model`)'
  )
  await client.fields.create('bar4Ch5hTFKfs2wLU2k63A', {
    id: 'O649q9gUQduaPZMWMpC1hA',
    label: 'Track SVG Dark',
    field_type: 'file',
    api_key: 'track_svg_dark',
    validators: { extension: { extensions: ['svg'] } },
    appearance: { addons: [], editor: 'file', parameters: {} }
  })

  console.log('Destroy fields in existing models/block models')

  console.log(
    'Delete Modular Content (Multiple blocks) field "CTAs" (`ctas`) in block model "\uD83D\uDEE3\uFE0F Section - Track Hero" (`section_track_hero`)'
  )
  await client.fields.destroy('V0WR8j8YS6enFNraziOfHA')

  console.log('Update existing fields/fieldsets')

  console.log(
    'Update Date field "Start Date" (`start_date`) in block model "\uD83D\uDCC5 Event - Model" (`event_model`)'
  )
  await client.fields.update('XsIfZmhNRFCLLzbWHsJOaA', {
    label: 'Start Date',
    api_key: 'start_date'
  })

  console.log(
    'Update Modular Content (Single block) field "Media" (`media`) in block model "\uD83D\uDEE3\uFE0F Section - Track Hero" (`section_track_hero`)'
  )
  await client.fields.update('MzNOkB1iTSup5fsY8piGew', {
    validators: {
      single_block_blocks: {
        item_types: ['PrRwA303RhehdZdoIR8DJA', 'QHloTWPPR8Cw9V4xeFlaDg']
      }
    }
  })

  console.log(
    'Update Single-line string field "Icon" (`icon`) in block model "\u2699\uFE0F Core - Icon" (`core_icon`)'
  )
  await client.fields.update('ZpHbgnA1Si-Uz3esffCORw', {
    appearance: {
      addons: [],
      editor: 'string_select',
      parameters: {
        options: [
          { hint: '', label: '3D', value: '3d' },
          { hint: '', label: 'Account', value: 'account' },
          { hint: '', label: 'Check', value: 'check' },
          { hint: '', label: 'Date', value: 'date' },
          { hint: '', label: 'Double Column', value: 'double-column' },
          { hint: '', label: 'Car', value: 'car' },
          { hint: '', label: 'Heart', value: 'heart' },
          { hint: '', label: 'Location', value: 'location' },
          { hint: '', label: 'Location Solid', value: 'location-solid' },
          { hint: '', label: 'Plus', value: 'plus' },
          { hint: '', label: 'Premium', value: 'premium' },
          { hint: '', label: 'Reviews', value: 'reviews' },
          { hint: '', label: 'Security', value: 'security' },
          { hint: '', label: 'Shipping', value: 'shipping' },
          { hint: '', label: 'Single Column', value: 'single-column' },
          { hint: '', label: 'Travel', value: 'travel' }
        ]
      }
    }
  })

  console.log(
    'Update Single-line string field "Spec Title" (`spec_title`) in block model "\uD83D\uDEE3\uFE0F Track - Model" (`track_model`)'
  )
  await client.fields.update('fM3G2Q_fRFapjhqD7U-dPg', { position: 16 })

  console.log(
    'Update Modular Content (Single block) field "Spec Media" (`spec_media`) in block model "\uD83D\uDEE3\uFE0F Track - Model" (`track_model`)'
  )
  await client.fields.update('QrGDB2ROTIW7Ly0kgV0TCQ', { position: 23 })

  console.log(
    'Update Single asset field "Track SVG Dark" (`track_svg_dark`) in block model "\uD83D\uDEE3\uFE0F Track - Model" (`track_model`)'
  )
  await client.fields.update('O649q9gUQduaPZMWMpC1hA', { position: 26 })

  console.log('Manage schema menu items')

  console.log(
    'Update block schema menu item for block model "\uD83D\uDEE3\uFE0F Section - Track Hero" (`section_track_hero`)'
  )
  await client.schemaMenuItems.update('XJLB6OzWQpC1umD8tNwrpQ', {
    position: 60
  })
}
