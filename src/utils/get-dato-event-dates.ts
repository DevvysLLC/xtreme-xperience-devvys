import type { Sdk } from '../core/dato/sdk'
import { initLogger } from '../core/logger'
import { formatDateToYYYYMMDD } from '../utils/date-time'

const logger = initLogger().child({ name: 'get-dato-event-dates' })

/**
 * Gets the corresponding Dato event by RocketRez ID and extracts startDate/endDate
 *
 * The GraphQL query filters by both rocketRezId and rocketRezType = 'Event',
 * so the result should already be filtered correctly.
 *
 * @param sdk - Dato SDK instance
 * @param rocketRezId - RocketRez event ID as string
 * @returns Object with startDate and endDate in YYYY-MM-DD format, or null if no matching event
 */
export const getDatoEventDates = async (
  sdk: Sdk,
  rocketRezId: string
): Promise<{ startDate: string | null; endDate: string | null } | null> => {
  try {
    const result = await sdk.getEventByRocketRezId({ id: rocketRezId })

    // The query already filters by rocketRezType = 'Event', so we can use the first result
    const event = result.allEvents[0]

    if (!event?.model) {
      logger.debug(
        { rocketRezId, foundEvents: result.allEvents.length },
        'No event found matching rocketRezId and rocketRezType = "Event"'
      )
      return null
    }

    const startDate = formatDateToYYYYMMDD(event.model.startDate)
    const endDate = formatDateToYYYYMMDD(event.model.endDate)

    return { startDate, endDate }
  } catch (error) {
    logger.warn({ rocketRezId, error }, 'Failed to query Dato event')
    return null
  }
}
