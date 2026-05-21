import { type Client, SimpleSchemaTypes } from '@datocms/cli/lib/cma-client-node'

export default async function (client: Client) {
  console.log('Update existing fields/fieldsets')

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
          { hint: '', label: 'Travel', value: 'travel' },
          { hint: '', label: 'Turnkey Orange', value: 'turnkey-orange' },
          {
            hint: '',
            label: 'Pro Instructions Orange',
            value: 'pro-instructions-orange'
          },
          { hint: '', label: 'Location Orange', value: 'location-orange' },
          { hint: '', label: 'Speed Orange', value: 'speed-orange' },
          { hint: '', label: 'Handshake v2', value: 'handshake-v2' },
          { hint: '', label: 'Helmet v2', value: 'helmet-v2' },
          { hint: '', label: 'Marker v2', value: 'marker-v2' },
          { hint: '', label: 'Ratings v2', value: 'ratings-v2' },
          { hint: '', label: 'Speedometer v2', value: 'speedometer-v2' },
          { hint: '', label: 'Track v2', value: 'track-v2' }
        ]
      }
    }
  })
}
