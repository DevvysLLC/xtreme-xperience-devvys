import { NextResponse } from 'next/server'
import { initLogger } from '../../../../../core/logger/index'
import type { SectionAddonsGridFragment } from '../../../../../components/section-addons-grid/section-addons-grid.typegen'
import { initDatoSdk } from '../../../../../core/dato/sdk'

const logger = initLogger().child({ name: 'gift-cards-api' })

export const runtime = 'nodejs'

export const GET = async (): Promise<NextResponse> => {
  try {
    const sdk = initDatoSdk()
    const response = await sdk.getPage({ handle: 'gift-cards' })
    const page = response?.allPages?.[0]
    const sections = page?.content?.sections ?? []

    // Look for SectionAddonsGridRecord
    const isSectionAddonsGrid = (sec: (typeof sections)[number]): sec is SectionAddonsGridFragment => {
      return sec?.__typename === 'SectionAddonsGridRecord'
    }

    const addonsGridSection = sections.find(isSectionAddonsGrid)
    const addons = addonsGridSection?.addons ?? []

    return NextResponse.json(
      {
        status: 'success',
        data: {
          addons
        }
      },
      {
        status: 200
      }
    )
  } catch (error) {
    logger.error(error, 'Internal error fetching gift cards from DatoCMS')
    return NextResponse.json(
      {
        status: 'error',
        message: 'Internal server error'
      },
      {
        status: 500
      }
    )
  }
}
