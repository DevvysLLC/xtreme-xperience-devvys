'use client'

import { createContext, type ReactNode, useContext, useState } from 'react'

type TrackFinderDrawerContextType = {
  hasSelectedLocation: boolean
  setHasSelectedLocation: (value: boolean) => void
  searchQuery: string
  setSearchQuery: (value: string) => void
}

const TrackFinderDrawerContext = createContext<
  TrackFinderDrawerContextType | undefined
>(undefined)

type Props = {
  children: ReactNode
}

export const TrackFinderDrawerProvider = ({ children }: Props) => {
  const [hasSelectedLocation, setHasSelectedLocation] = useState(false)
  const [searchQuery, setSearchQuery] = useState('')

  return (
    <TrackFinderDrawerContext.Provider
      value={{
        hasSelectedLocation,
        setHasSelectedLocation,
        searchQuery,
        setSearchQuery
      }}
    >
      {children}
    </TrackFinderDrawerContext.Provider>
  )
}

export const useTrackFinderDrawer = () => {
  const context = useContext(TrackFinderDrawerContext)
  if (context === undefined) {
    throw new Error(
      'useTrackFinderDrawer must be used within TrackFinderDrawerProvider'
    )
  }
  return context
}
