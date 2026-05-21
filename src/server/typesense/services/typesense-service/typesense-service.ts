import type { Logger } from '../../../../core/logger'
import {
  PageCollectionSchema,
  type PageDocument,
  SupercarCollectionSchema,
  type SupercarDocument,
  TrackCollectionSchema,
  type TrackDocument
} from '../../../../io/typesense'
import type { TypesenseClient } from '../../client/typesense-client'

export class TypesenseService {
  constructor(
    private readonly client: TypesenseClient,
    private readonly logger: Logger
  ) {}

  private isNotFoundError(error: unknown): boolean {
    return (
      error instanceof Error &&
      error.message.startsWith('Typesense request failed: 404')
    )
  }

  private async ensureCollectionExists<T extends { name: string }>(
    schema: T
  ): Promise<void> {
    try {
      await this.client.getCollection(schema.name)
      this.logger.info({ collection: schema.name }, 'Collection already exists')
      return
    } catch (error) {
      if (!this.isNotFoundError(error)) {
        throw error
      }
    }

    await this.client.createCollection(schema)
    this.logger.info({ collection: schema.name }, 'Created collection')
  }

  async initializeCollections(): Promise<void> {
    this.logger.info('Initializing Typesense collections')
    await this.initializeSupercarsCollection()
    await this.initializeTracksCollection()
    await this.initializePagesCollection()
  }

  async ensureCollections(): Promise<void> {
    this.logger.info('Ensuring Typesense collections exist')
    await this.ensureSupercarsCollection()
    await this.ensureTracksCollection()
    await this.ensurePagesCollection()
  }

  async ensureSupercarsCollection(): Promise<void> {
    await this.ensureCollectionExists(SupercarCollectionSchema)
  }

  async ensureTracksCollection(): Promise<void> {
    await this.ensureCollectionExists(TrackCollectionSchema)
  }

  async ensurePagesCollection(): Promise<void> {
    await this.ensureCollectionExists(PageCollectionSchema)
  }

  async initializeSupercarsCollection(): Promise<void> {
    try {
      await this.client.deleteCollection(SupercarCollectionSchema.name)
      this.logger.info('Deleted existing supercars collection')
    } catch (error) {
      // Collection might not exist, which is fine - ignore delete errors
      this.logger.debug(
        { error },
        'Could not delete supercars collection (may not exist)'
      )
    }

    try {
      await this.client.createCollection(SupercarCollectionSchema)
      this.logger.info('Created supercars collection')
    } catch (error) {
      const errorMessage =
        error instanceof Error ? error.message : String(error)
      const errorStack = error instanceof Error ? error.stack : undefined
      this.logger.error(
        {
          error: errorMessage,
          stack: errorStack,
          errorObject: error
        },
        'Failed to create supercars collection'
      )
      throw error
    }
  }

  async initializeTracksCollection(): Promise<void> {
    try {
      await this.client.deleteCollection(TrackCollectionSchema.name)
      this.logger.info('Deleted existing tracks collection')
    } catch (error) {
      // Collection might not exist, which is fine - ignore delete errors
      this.logger.debug(
        { error },
        'Could not delete tracks collection (may not exist)'
      )
    }

    try {
      await this.client.createCollection(TrackCollectionSchema)
      this.logger.info('Created tracks collection')
    } catch (error) {
      const errorMessage =
        error instanceof Error ? error.message : String(error)
      const errorStack = error instanceof Error ? error.stack : undefined
      this.logger.error(
        {
          error: errorMessage,
          stack: errorStack,
          errorObject: error
        },
        'Failed to create tracks collection'
      )
      throw error
    }
  }

  async initializePagesCollection(): Promise<void> {
    try {
      await this.client.deleteCollection(PageCollectionSchema.name)
      this.logger.info('Deleted existing pages collection')
    } catch (error) {
      // Collection might not exist, which is fine - ignore delete errors
      this.logger.debug(
        { error },
        'Could not delete pages collection (may not exist)'
      )
    }

    try {
      await this.client.createCollection(PageCollectionSchema)
      this.logger.info('Created pages collection')
    } catch (error) {
      const errorMessage =
        error instanceof Error ? error.message : String(error)
      const errorStack = error instanceof Error ? error.stack : undefined
      this.logger.error(
        {
          error: errorMessage,
          stack: errorStack,
          errorObject: error
        },
        'Failed to create pages collection'
      )
      throw error
    }
  }

  async syncSupercars(documents: SupercarDocument[]): Promise<void> {
    this.logger.info(
      { count: documents.length },
      'Syncing supercars to Typesense'
    )

    if (documents.length === 0) {
      this.logger.warn('No supercars to sync')
      return
    }

    await this.client.indexDocuments(SupercarCollectionSchema.name, documents)
    this.logger.info(
      { count: documents.length },
      'Successfully synced supercars'
    )
  }

  async syncTracks(documents: TrackDocument[]): Promise<void> {
    this.logger.info({ count: documents.length }, 'Syncing tracks to Typesense')

    if (documents.length === 0) {
      this.logger.warn('No tracks to sync')
      return
    }

    await this.client.indexDocuments(TrackCollectionSchema.name, documents)
    this.logger.info({ count: documents.length }, 'Successfully synced tracks')
  }

  async syncPages(documents: PageDocument[]): Promise<void> {
    this.logger.info({ count: documents.length }, 'Syncing pages to Typesense')

    if (documents.length === 0) {
      this.logger.warn('No pages to sync')
      return
    }

    await this.client.indexDocuments(PageCollectionSchema.name, documents)
    this.logger.info({ count: documents.length }, 'Successfully synced pages')
  }
}
