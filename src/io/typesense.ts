import { z } from 'zod'

// =============================================================================
// Typesense - Pages
// =============================================================================

export const PageDocumentSchema = z.object({
  id: z.string(),
  data: z.record(z.string(), z.unknown()),
  searchText: z.string().optional(),
  updatedAt: z.number()
})

export type PageDocument = z.infer<typeof PageDocumentSchema>

export const PageCollectionSchema = {
  name: 'pages',
  fields: [
    { name: 'id', type: 'string' },
    { name: 'data', type: 'object', optional: true, index: false },
    { name: 'searchText', type: 'string', optional: true, index: true },
    { name: 'updatedAt', type: 'int64' }
  ],
  default_sorting_field: 'updatedAt',
  enable_nested_fields: true
} as const

// =============================================================================
// Typesense - Supercars
// =============================================================================

export const SupercarDocumentSchema = z.object({
  id: z.string(),
  data: z.record(z.string(), z.unknown()),
  searchText: z.string().optional(),
  updatedAt: z.number()
})

export type SupercarDocument = z.infer<typeof SupercarDocumentSchema>

export const SupercarCollectionSchema = {
  name: 'supercars',
  fields: [
    { name: 'id', type: 'string' },
    { name: 'data', type: 'object', optional: true, index: false },
    { name: 'searchText', type: 'string', optional: true, index: true },
    { name: 'updatedAt', type: 'int64' }
  ],
  default_sorting_field: 'updatedAt',
  enable_nested_fields: true
} as const

// =============================================================================
// Typesense - Tracks
// =============================================================================

export const TrackDocumentSchema = z.object({
  id: z.string(),
  data: z.record(z.string(), z.unknown()),
  searchText: z.string().optional(),
  updatedAt: z.number()
})

export type TrackDocument = z.infer<typeof TrackDocumentSchema>

export const TrackCollectionSchema = {
  name: 'tracks',
  fields: [
    { name: 'id', type: 'string' },
    { name: 'data', type: 'object', optional: true, index: false },
    { name: 'searchText', type: 'string', optional: true, index: true },
    { name: 'updatedAt', type: 'int64' }
  ],
  default_sorting_field: 'updatedAt',
  enable_nested_fields: true
} as const
