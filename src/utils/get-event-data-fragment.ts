import type { EventDataFragment } from '../core/dato/fragments/event-data.typegen'

type EventModelInput = {
  id: string
  title: string | null
  startDate: string | null
  endDate: string | null
  enabled: boolean
  soldOut: boolean
  popular: boolean
  rocketRezId: string
  rocketRezType: string
  rocketRezRootId: string
}

type TrackConfigInput = {
  id: string
  title: string | null
  handle: string | null
}

type TrackModelInput = {
  title: string | null
  nickname: string | null
  city: string | null
  state: string | null
  location: {
    latitude: number
    longitude: number
  } | null
}

export const getEventDataFragment = (
  eventId: string,
  eventModel: EventModelInput,
  trackConfig: TrackConfigInput,
  trackModel: TrackModelInput | null
): EventDataFragment => {
  return {
    __typename: 'EventRecord',
    id: eventId,
    model: {
      __typename: 'EventModelRecord',
      id: eventModel.id,
      title: eventModel.title,
      startDate: eventModel.startDate,
      endDate: eventModel.endDate,
      enabled: eventModel.enabled,
      soldOut: eventModel.soldOut,
      popular: eventModel.popular,
      rocketRezId: eventModel.rocketRezId,
      rocketRezType: eventModel.rocketRezType,
      rocketRezRootId: eventModel.rocketRezRootId,
      media: null,
      gradient: null,
      track: {
        __typename: 'TrackRecord',
        config: {
          __typename: 'TrackConfigRecord',
          id: trackConfig.id,
          title: trackConfig.title,
          handle: trackConfig.handle
        },
        model: trackModel
          ? {
              __typename: 'TrackModelRecord',
              title: trackModel.title,
              nickname: trackModel.nickname,
              city: trackModel.city,
              state: trackModel.state,
              location: trackModel.location
                ? {
                    __typename: 'LatLonField',
                    latitude: trackModel.location.latitude,
                    longitude: trackModel.location.longitude
                  }
                : null,
              trackSvg: null
            }
          : null
      }
    }
  }
}
