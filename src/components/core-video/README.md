# Core Video Component

A lazy-loaded HLS video player component that renders a video element with integrated or external controls.

## Overview

The `CoreVideo` component is designed to handle HLS (HTTP Live Streaming) videos with intelligent viewport-based playback. It automatically:
- Starts playing when the video enters the viewport
- Pauses when it leaves the viewport
- Unmounts the video player after 3 seconds to save resources (preventing Chrome stuttering issues)
- Handles responsive video sources for desktop and mobile
- Supports autoplay with muted state (required by browser policies)

## Props

### CoreVideo Props

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `data` | `CoreVideoFragment` | **required** | Video data from Dato CMS including video sources, poster images, and configuration |
| `uniqueVideoId` | `string` | Auto-generated | Unique identifier for the video instance. Used to sync with `CoreVideoControls` |
| `hasOutsideControls` | `boolean` | `false` | When `true`, renders controls outside the component, requires separate `<CoreVideoControls>` component |

### Data Schema (`CoreVideoFragment`)

The `data` prop expects:
- `video`: Main video source object with `streamingUrl`, `thumbnailUrl`, `width`, `height`
- `desktopVideo`: Optional desktop-specific video source
- `customPosterImage`: Optional custom poster image
- `autoplay`: `boolean` - Enable/disable autoplay
- `controls`: `boolean` - Show/hide controls
- `loop`: `boolean` - Loop playback

## Features

### Intelligent Playback
- **Viewport-based playback**: Uses `react-intersection-observer` with a 100% top margin and 50% bottom margin
- **Auto-pause**: Pauses when video leaves viewport
- **Resource management**: Unmounts video element after 3 seconds when out of view to prevent Chrome stuttering with multiple videos

### HLS Streaming
- **Native HLS support**: Automatically uses native HLS when supported (Safari)
- **HLS.js fallback**: Uses HLS.js library for browsers without native support
- **Resolution optimization**:
  - Desktop: Up to 1080p
  - Mobile: Up to 720p

### State Management
Uses a global Zustand store (`use-video.ts`) to manage video state across components:
- Play/Pause status
- Muted state
- Component lifecycle

## Usage

### Basic Usage with Integrated Controls

```typescript
import { CoreVideo } from '@/components/core-video'

<CoreVideo data={videoData} />
```

### With External Controls

When you need to position controls separately:

```typescript
import { CoreVideo } from '@/components/core-video'
import { CoreVideoControls } from '@/components/core-video-controls'

// Generate a shared ID
const videoId = uuidv4() // or any unique string

<CoreVideo
  data={videoData}
  uniqueVideoId={videoId}
  hasOutsideControls={true}
/>

<CoreVideoControls uniqueVideoId={videoId} />
```

## How It Works

1. **Initialization**: Component generates or receives a `uniqueVideoId`
2. **Viewport Detection**: Uses intersection observer to detect when video enters viewport
3. **Playback Start**: When `inView` and `autoplay`, video starts playing
4. **Viewport Exit**: When video leaves viewport:
   - Video immediately pauses
   - After 3 seconds, video unmounts to free resources
5. **Re-entry**: If video re-enters viewport before unmounting, playback resumes

## Video State

The component uses a shared Zustand store that can be accessed via hooks:

```typescript
import { useVideo, useVideoActions } from '@/core/video/use-video'

// In any component
const status = useVideo(videoId, (s) => s.status) // 'playing' | 'paused' | 'unmounted'
const isMuted = useVideo(videoId, (s) => s.muted)
const { play, pause, setMuted } = useVideoActions(videoId)
```

## Related Components

### CoreVideoControls

Standalone controls component for external placement. Includes:
- Play/Pause button
- Mute/Unmute button

```typescript
<CoreVideoControls uniqueVideoId={videoId} />
```

## Browser Support

- **Safari**: Native HLS support
- **Chrome/Edge**: HLS.js implementation
- **Firefox**: HLS.js implementation

## Technical Details

- Built with React hooks and Zustand for state management
- Uses HLS.js for cross-browser HLS support
- Supports responsive video sources (desktop vs mobile)
- Implements resource cleanup to prevent memory issues
- Handles browser autoplay policies by defaulting to muted state
