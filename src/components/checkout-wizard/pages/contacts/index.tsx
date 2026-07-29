'use client'

import { useForm } from '@tanstack/react-form'
import { useQueryClient } from '@tanstack/react-query'
import { useTranslations } from 'next-intl'
import { type FC, useEffect, useMemo, useRef, useState } from 'react'
import { UNAVAILABLE_ANALYTICS_VALUE } from '../../../../config/analytics'
import { ROUTES } from '../../../../config/routes'
import { logger } from '../../../../core/logger/logger'
import { useAnalyticsEcommerceEvent } from '../../../../features/analytics'
import {
  useCartContactAdd,
  useCartContactUpdate
} from '../../../../features/cart'
import { CART_QUERY_KEY } from '../../../../features/cart/keys'
import { cartRepository } from '../../../../features/cart/repository'
import {
  DEFAULT_FORM_VALUES,
  useCheckoutPageDetails,
  useCheckoutWithCart
} from '../../../../features/checkout'
import {
  CheckoutDetailsFormInputSchema,
  ContactEmailSchema,
  type ContactsFormValues,
  RocketRezAddContactsRequestSchema,
  RocketRezBillingAddressSchema,
  RocketRezCartStatusSchema
} from '../../../../io/schemas'
import type { CartState, RocketRezAddContactsRequest } from '../../../../io/types'
import { CoreCta } from '../../../core-cta'
import { CartSummary } from '../../../global-cart/components/summary'
import { ContactsForm } from '../../components/contacts-form'
import { PageFooter } from '../../components/page-footer'
import styles from './style.module.scss'

type Props = {
  onValidChange?: (isValid: boolean) => void
  onValuesChange?: (values: ContactsFormValues) => void
}

type DetailsFormValues = ContactsFormValues & {
  isValid?: boolean
  isSubmitted?: boolean
}

const ContactBillingAddressSchema = RocketRezBillingAddressSchema

export const ContactsPage: FC<Props> = () => {
  const t = useTranslations('contacts_page')
  const tForm = useTranslations('contacts_form')
  const { persisted, save } = useCheckoutPageDetails()
  const { cart } = useCheckoutWithCart()
  const addContact = useCartContactAdd()
  const updateContact = useCartContactUpdate()
  const analytics = useAnalyticsEcommerceEvent()
  const beginCheckoutTrackedRef = useRef(false)
  const qc = useQueryClient()
  const [isSubmitting, setIsSubmitting] = useState(false)

  // Determine if a gift card is being purchased
  const isGiftCard = useMemo(() => {
    const hasGiftCardInLineItems = cart?.cartData?.lineItems?.some((item) => {
      const typeStr = String(item.productType ?? item.type ?? '').toLowerCase()
      return (
        typeStr === 'giftcard' ||
        typeStr === 'gift_card' ||
        typeStr === 'gift card'
      )
    })
    const hasGiftCardInMetadata = cart?.metadata?.some(
      (item) => item.type === 'gift_card'
    )
    return !!(hasGiftCardInLineItems || hasGiftCardInMetadata)
  }, [cart?.cartData?.lineItems, cart?.metadata])

  // Check if contact already exists in cart
  const existingContact = useMemo(() => {
    if (!cart?.cartData?.contacts || cart.cartData.contacts.length === 0) {
      return null
    }
    // Get the primary contact or first contact
    return (
      cart.cartData.contacts.find((c) => c.isPrimary) ||
      cart.cartData.contacts[0]
    )
  }, [cart?.cartData?.contacts])

  // Default values: persisted store first, then cart contact overrides (same shape via spread)
  const defaultValues = useMemo<DetailsFormValues>(() => {
    const persistedValue = persisted?.value ?? null
    const parsedPersistedValue =
      CheckoutDetailsFormInputSchema.safeParse(persistedValue)
    const fromStore = parsedPersistedValue.success
      ? parsedPersistedValue.data
      : {}
    const fromContact = existingContact
      ? {
          firstName: existingContact.firstName,
          lastName: existingContact.lastName,
          email: existingContact.email,
          phone: existingContact.phone ?? '',
          addressLine1: existingContact.billingAddress?.addressLine1 ?? '',
          addressLine2: existingContact.billingAddress?.addressLine2 ?? '',
          city: existingContact.billingAddress?.city ?? '',
          province: existingContact.billingAddress?.province ?? '',
          postalCode: existingContact.billingAddress?.postalCode ?? '',
          country: existingContact.billingAddress?.country ?? 'US'
        }
      : {}

    const giftCardMeta = cart?.metadata?.find((item) => item.type === 'gift_card')
    const fromGiftCardMetadata = {
      recipientEmail:
        giftCardMeta?.recipientEmail ??
        giftCardMeta?.properties?.recipientEmail ??
        '',
      recipientName:
        giftCardMeta?.recipientName ??
        giftCardMeta?.properties?.recipientName ??
        ''
    }

    return {
      ...DEFAULT_FORM_VALUES,
      ...fromGiftCardMetadata,
      ...fromStore,
      ...fromContact,
      country: 'US',
      isValid: persisted?.pageIsValid ?? false,
      isSubmitted: persisted?.userHasSubmitted ?? false
    }
  }, [persisted, existingContact, cart?.metadata])

  const form = useForm({
    defaultValues,
    onSubmit: async ({ value }) => {
      const contactValue = { ...value }
      delete contactValue.isSubmitted
      setIsSubmitting(true)
      logger.info({ value }, 'ContactsPage.onSubmit')
      try {
        // Validate billing address using schema from src/io
        const billingAddressResult = ContactBillingAddressSchema.safeParse({
          addressLine1: contactValue.addressLine1,
          addressLine2: contactValue.addressLine2 || null,
          city: contactValue.city,
          province: contactValue.province,
          postalCode: contactValue.postalCode,
          country: contactValue.country
        })

        if (!billingAddressResult.success) {
          logger.error(
            {
              errors: billingAddressResult.error.issues,
              value: contactValue
            },
            'ContactsPage.onSubmit.billingAddressValidationFailed'
          )
          return
        }

        const emailResult = ContactEmailSchema.safeParse(contactValue.email)
        if (!emailResult.success) {
          logger.error(
            {
              errors: emailResult.error.issues,
              email: contactValue.email
            },
            'ContactsPage.onSubmit.emailValidationFailed'
          )
          return
        }

        const request: RocketRezAddContactsRequest = {
          contacts: [
            {
              ...(existingContact?.id != null && { id: existingContact.id }),
              isPrimary: true,
              firstName: contactValue.firstName,
              lastName: contactValue.lastName,
              email: emailResult.data,
              phone: contactValue.phone || null,
              billingAddress: billingAddressResult.data
            }
          ]
        }

        // Validate the full request
        const requestResult =
          RocketRezAddContactsRequestSchema.safeParse(request)
        if (!requestResult.success) {
          logger.error(
            {
              errors: requestResult.error.issues,
              request
            },
            'ContactsPage.onSubmit.requestValidationFailed'
          )
          return
        }

        // Update existing contact or add new contact
        const contactMutationResponse = existingContact?.id
          ? await updateContact.mutateAsync({
              contactId: existingContact.id,
              request: requestResult.data
            })
          : await addContact.mutateAsync(requestResult.data)

        if (contactMutationResponse.status !== 'success') {
          logger.error(
            { contactMutationResponse },
            'ContactsPage.onSubmit.contactMutationNotSuccessful'
          )
          return
        }

        const submittedCart = contactMutationResponse.data.cart
        const pageIsValidAfterSubmit =
          submittedCart.status === RocketRezCartStatusSchema.enum.Active &&
          (submittedCart.contacts?.length ?? 0) > 0 &&
          (submittedCart.lineItems?.length ?? 0) > 0 &&
          (submittedCart.total ?? 0) > 0

        // Persist details to checkout store
        await save({
          value: contactValue,
          pageIsValid: pageIsValidAfterSubmit,
          userHasSubmitted: true
        })

        // Update recipient information on gift cards in cart metadata
        if (isGiftCard) {
          const currentCart = qc.getQueryData<CartState>(CART_QUERY_KEY)
          if (currentCart) {
            const giftCardLineItem = currentCart.cartData?.lineItems?.find((item) => {
              const typeStr = String(item.productType ?? item.type ?? '').toLowerCase()
              return (
                typeStr === 'giftcard' ||
                typeStr === 'gift_card' ||
                typeStr === 'gift card'
              )
            })

            let found = false
            const nextMetadata = currentCart.metadata.map((item) => {
              const isGiftCardItem =
                item.type === 'gift_card' ||
                (item.type === 'addon' &&
                  (item.title?.toLowerCase().includes('gift card') ||
                    (giftCardLineItem && item.key === `addon-${giftCardLineItem.id}`)))

              if (isGiftCardItem) {
                found = true
                return {
                  ...item,
                  type: 'gift_card' as const,
                  recipientEmail: contactValue.recipientEmail || null,
                  recipientName: contactValue.recipientName || null,
                  properties: {
                    ...item.properties,
                    recipientEmail: contactValue.recipientEmail || null,
                    recipientName: contactValue.recipientName || null
                  }
                }
              }
              return item
            })

            if (!found) {
              const key = giftCardLineItem ? `addon-${giftCardLineItem.id}` : 'gift-card-meta'
              nextMetadata.push({
                key,
                type: 'gift_card' as const,
                title: giftCardLineItem?.name ?? 'Gift Card',
                recipientEmail: contactValue.recipientEmail || null,
                recipientName: contactValue.recipientName || null,
                properties: {
                  recipientEmail: contactValue.recipientEmail || null,
                  recipientName: contactValue.recipientName || null
                }
              })
            }

            const nextCart = {
              ...currentCart,
              metadata: nextMetadata
            }
            qc.setQueryData<CartState>(CART_QUERY_KEY, nextCart)
            cartRepository.write(nextCart)
          }
        }

        const cartData = cart?.cartData
        if (cartData && (cartData.lineItems?.length ?? 0) > 0) {
          analytics.trackAddShippingInfo(
            cartData,
            cart.metadata,
            UNAVAILABLE_ANALYTICS_VALUE,
            {
              user_id: UNAVAILABLE_ANALYTICS_VALUE,
              email: contactValue.email || UNAVAILABLE_ANALYTICS_VALUE,
              phone: contactValue.phone || UNAVAILABLE_ANALYTICS_VALUE,
              name:
                `${contactValue.firstName} ${contactValue.lastName}`.trim() ||
                UNAVAILABLE_ANALYTICS_VALUE,
              zip_code: contactValue.postalCode || UNAVAILABLE_ANALYTICS_VALUE,
              address:
                [contactValue.addressLine1, contactValue.addressLine2]
                  .filter(Boolean)
                  .join(' ')
                  .trim() || UNAVAILABLE_ANALYTICS_VALUE
            }
          )
        }
      } catch (error) {
        logger.error(
          { error, existingContactId: existingContact?.id },
          'ContactsPage.onSubmit.failedToSaveContact'
        )
      } finally {
        setIsSubmitting(false)
      }
    }
  })

  // Track begin_checkout when user lands on contacts (first checkout step)
  useEffect(() => {
    const cartData = cart?.cartData
    if (
      !beginCheckoutTrackedRef.current &&
      cartData &&
      (cartData.lineItems?.length ?? 0) > 0
    ) {
      analytics.trackBeginCheckout(cartData, cart.metadata)
      beginCheckoutTrackedRef.current = true
    }
  }, [analytics, cart?.cartData, cart.metadata])

  return (
    <section className={styles.contacts}>
      <header className={styles.contacts__header}>
        <div>
          <CoreCta
            text={t('button.back')}
            className={styles.contacts__cta}
            href={ROUTES.BOOKING.REVIEW}
            layoutType="text"
            styleType="black"
            icon="arrow-left"
            iconPosition="left"
            sizeType="medium"
          />
        </div>

        <h1 className={styles.contacts__title}>{t('title')}</h1>
      </header>

      <div className={styles.contacts__content}>
        <ContactsForm form={form} isGiftCard={isGiftCard} />
      </div>

      <div className={styles.contacts__summary}>
        <CartSummary />
      </div>

      <PageFooter
        form={form}
        onSubmit={form.handleSubmit}
        isPending={isSubmitting}
        backText={t('button.back')}
        backHref={ROUTES.BOOKING.REVIEW}
        submitText={
          existingContact?.id ? tForm('button.update') : tForm('button.submit')
        }
        savingText={tForm('button.submitting')}
      />
    </section>
  )
}
