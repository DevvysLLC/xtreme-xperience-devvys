'use client'

import { useEffect } from 'react'
import { INIT_BANNER_MESSAGE, INIT_BANNER_URL } from '../../config/messages'

export const ScriptsInitBanner = () => {
  useEffect(() => {
    // eslint-disable-next-line no-console
    console.info(INIT_BANNER_MESSAGE)
    // eslint-disable-next-line no-console
    console.info('Design and build by: %s', INIT_BANNER_URL)
  }, [])
  return null
}
