# GlobalToast

A toast notification component that displays messages triggered via the message bus.

## Usage

### Rendering the Toast Container

Add the `CoreToast` component to your layout (typically in the root layout):

```tsx
import { CoreToast } from '@/components/core-toast'

export default function RootLayout({ children }) {
  return (
    <html>
      <body>
        {children}
        <CoreToast />
      </body>
    </html>
  )
}
```

### Triggering a Toast

Use the message bus to show a toast:

```tsx
import { useMainBus } from '@/core/messaging/main/react'
import { SHOW_TOAST_MESSAGE_NAME } from '@/core/messaging/main/messages/show-toast'

const MyComponent = () => {
  const bus = useMainBus(SHOW_TOAST_MESSAGE_NAME, () => {})

  const showSuccessToast = () => {
    bus.send({
      name: SHOW_TOAST_MESSAGE_NAME,
      details: {
        message: 'Operation completed successfully!',
        type: 'success',
        duration: 5000
      }
    })
  }

  return <button onClick={showSuccessToast}>Show Toast</button>
}
```

## Props (via message bus)

| Property   | Type                              | Default | Description                        |
| ---------- | --------------------------------- | ------- | ---------------------------------- |
| `message`  | `string`                          | -       | The message to display             |
| `type`     | `'success' \| 'error' \| 'info'`  | `info`  | The visual style of the toast      |
| `duration` | `number`                          | `5000`  | Auto-close duration in milliseconds |

## Toast Types

- **success**: Green background, used for success messages
- **error**: Red background, used for error messages
- **info**: Dark background (default), used for informational messages

