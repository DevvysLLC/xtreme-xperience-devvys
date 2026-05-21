# Error Message Component

Displays an error message to the user. If no message is provided, displays a general error message from translations.

## Props

- `message?: string` - Optional error message. If not provided, falls back to a general error message from translations.

## Usage

```tsx
import { ErrorMessage } from '@/components/error-message'

// With custom message
<ErrorMessage message="Failed to load data" />

// Without message (uses translation fallback)
<ErrorMessage />
```

## Translations

The component uses the `error-message` namespace for translations:
- `error-message.general` - General error message fallback


