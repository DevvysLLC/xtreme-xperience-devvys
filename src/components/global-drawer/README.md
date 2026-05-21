# Global Drawer Component

A generic drawer component that listens to drawer lifecycle events.

## Usage

```tsx
import { Drawer } from '@/components/global-drawer'

// ...

<Drawer id="my-drawer">
  <h2>My Drawer Content</h2>
  <p>...</p>
</Drawer>
```

## Message Events

The drawer system uses the following message events:

- `drawer:request:open` - Request to open a drawer
- `drawer:request:close` - Request to close a drawer
- `drawer:open` - Emitted when a drawer opens
- `drawer:close` - Emitted when a drawer closes

## Triggering

To open the drawer, dispatch the `drawer:request:open` event:

```ts
import { useMainBus } from '@/core/messaging/main/react'
import { DRAWER_REQUEST_OPEN_MESSAGE_NAME } from '@/core/messaging/main/messages/open-drawer'

// ...
const bus = useMainBus()

bus.emit({
  name: DRAWER_REQUEST_OPEN_MESSAGE_NAME,
  details: { id: 'my-drawer' }
})
```

## Behavior

- Only one drawer is open at a time.
- If a `drawer:request:open` event is received with a different ID, the current drawer closes first (with transition), then the new drawer opens.
- The `DrawerManager` component handles sequential transitions automatically.

