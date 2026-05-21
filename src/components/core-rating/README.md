# Core Rating

A component that displays a rating as stars (1-5 scale).

## Usage

```tsx
import { CoreRating } from '@/components/core-rating'

<CoreRating rating={3.7} />
```

## Props

- `rating` (number): The rating value (will be clamped between 1-5 and rounded up to nearest 0.25)

## Behavior

- Clamps rating between 1 and 5
- Rounds up to the nearest 0.25 (e.g., 3.1 → 3.25, 3.3 → 3.5, 3.6 → 3.75)
- Displays 5 stars using full, half, or empty star icons

