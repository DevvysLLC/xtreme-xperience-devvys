'use client'

import { useRouter } from 'next/navigation'
import { useEffect } from 'react'
import { ROUTES } from '../../../config/routes'

export default function CheckoutHomePage() {
  const router = useRouter()
  useEffect(() => {
    router.replace(ROUTES.CHECKOUT.CONTACTS)
  }, [router])
  return null
}
