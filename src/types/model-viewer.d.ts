/// <reference types="react" />

declare global {
  namespace JSX {
    // eslint-disable-next-line @typescript-eslint/consistent-type-definitions
    interface IntrinsicElements {
      'model-viewer': React.DetailedHTMLProps<
        React.HTMLAttributes<HTMLElement> & {
          src?: string
          alt?: string
          'auto-rotate'?: boolean
          'camera-controls'?: boolean
          'camera-orbit'?: string
          'min-camera-orbit'?: string
          'max-camera-orbit'?: string
          'interaction-prompt'?: 'none' | 'auto' | 'when-focused'
          ar?: boolean
          'ar-modes'?: string
        },
        HTMLElement
      >
    }
  }
}

export {}
