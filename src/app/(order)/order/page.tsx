'use client'

import { useRouter } from 'next/navigation'
import { useEffect } from 'react'
import { ROUTES } from '../../../config/routes'

export default function OrderHomePage() {
  const router = useRouter()

  useEffect(() => {
    // Redirect to home if no order ID is provided
    // Orders should be accessed via /order/[id]
    router.replace(ROUTES.FRONTEND.HOME)
  }, [router])

  return null
}
