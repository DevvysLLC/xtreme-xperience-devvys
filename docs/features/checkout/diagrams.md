# Checkout Feature Flow Diagrams

> **Client-facing overview:** See [Checkout — User Journey](./client/readme.md) for a digestible, non-technical summary.

Checkout payment supports redirect-based methods (for example, Affirm) through a return URL and resume protocol between the parent page and iframe.

## Checkout Process Flow

[View diagram source](./diagrams/checkout-process-flow.mmd)

```mermaid
flowchart TD
    Start([Cart Ready]) --> Guard[CheckoutWizardGuard]
    Guard -->|"cart.totalItems > 0 && checkout.details == null"| ContactsPage["/checkout/contacts"]
    Guard -->|"cart.totalItems > 0 && checkout.details != null"| PaymentPage["/checkout/payment"]
    Guard -->|"pathname starts with /checkout/complete"| CompletePage["/checkout/complete/[id]"]
    Guard -->|"cart.totalItems == 0 && not complete page"| Home([Redirect to Home])

    ContactsPage --> SaveDetails["useCheckoutPageDetails.set()"]
    SaveDetails --> PaymentPage

    PaymentPage --> GetSecret["useCheckoutGatewayClientSecret"]
    GetSecret --> PaymentIframe["PaymentV2 + useRocketRezPayment"]
    PaymentIframe --> Init["Parent -> iframe: INIT"]
    Init --> Ready["iframe -> parent: READY"]
    Ready --> ResumeBranch{"resumePayment exists?"}
    ResumeBranch -->|"No"| PersistState["Persist sessionStorage state before PROCESS_PAYMENT"]
    PersistState --> ProcessPayment["Parent -> iframe: PROCESS_PAYMENT"]
    ResumeBranch -->|"Yes"| ResumePayment["Parent -> iframe: RESUME_PAYMENT"]

    ProcessPayment --> RedirectBranch{"Redirect-based method?"}
    RedirectBranch -->|"No"| AuthSuccess["iframe -> parent: PAYMENT_AUTH_SUCCESS"]
    RedirectBranch -->|"Yes"| RedirectOut["Top-level redirect to returnUrl"]
    RedirectOut --> ReturnToPage["Parent URL has payment_intent_client_secret"]
    ReturnToPage --> RestoreState["Restore state + strip redirect params"]
    RestoreState --> ReInit["Reload iframe -> INIT -> READY"]
    ReInit --> ResumePayment

    ResumePayment --> AuthSuccess
    AuthSuccess --> FinalResult{"Terminal event"}
    FinalResult -->|"PAYMENT_SUCCESS"| CompleteCart["useCartComplete"]
    FinalResult -->|"PAYMENT_ERROR or PAYMENT_AUTH_ERROR"| PaymentError[Show payment error]
    PaymentError --> PaymentPage

    CompleteCart --> SavePayment["useCheckoutPagePayment.save(orderId)"]
    SavePayment --> CompletePage
    CompletePage --> ClearStores["useCartClearAfterComplete + mark viewed"]
    ClearStores --> OrderPage(["Redirect to Order Page"])
```

## Checkout State Management

[View diagram source](./diagrams/checkout-state-management.mmd)

```mermaid
sequenceDiagram
    participant User
    participant Guard as CheckoutWizardGuard
    participant ContactsPage
    participant CheckoutStore as Checkout Store<br/>(Zustand + localStorage)
    participant PaymentPage
    participant PaymentV2 as PaymentV2 + useRocketRezPayment
    participant SessionStorage
    participant BrowserURL
    participant CartAPI as Cart API
    participant CompletePage
    participant OrderAPI as Order API
    participant ClearHook as useCartClearAfterComplete

    User->>Guard: Navigate to /checkout/contacts
    Guard->>Guard: Check cart.totalItems > 0
    Guard->>ContactsPage: Allow access

    ContactsPage->>CheckoutStore: useCheckoutPageDetails.set(details)
    ContactsPage->>User: Navigate to /checkout/payment

    User->>Guard: Navigate to /checkout/payment
    Guard->>Guard: Check checkout.details != null
    Guard->>PaymentPage: Allow access

    PaymentPage->>PaymentV2: Render iframe + send INIT
    PaymentV2-->>PaymentPage: READY
    alt Redirect resume context exists
        PaymentPage->>PaymentV2: RESUME_PAYMENT
    else Normal payment start
        PaymentPage->>SessionStorage: Persist redirect state
        PaymentPage->>PaymentV2: PROCESS_PAYMENT
    end

    alt Redirect-based payment returns
        BrowserURL-->>PaymentPage: payment_intent_client_secret + redirect_status
        PaymentPage->>SessionStorage: Restore saved redirect state
        PaymentPage->>BrowserURL: history.replaceState (strip payment params)
        PaymentPage->>PaymentV2: INIT
        PaymentV2-->>PaymentPage: READY
        PaymentPage->>PaymentV2: RESUME_PAYMENT
    end

    PaymentV2-->>PaymentPage: PAYMENT_AUTH_SUCCESS / PAYMENT_AUTH_ERROR
    PaymentV2-->>PaymentPage: PAYMENT_SUCCESS / PAYMENT_ERROR
    PaymentPage->>SessionStorage: Clear redirect state on terminal outcome
    alt Payment success
    PaymentPage->>CartAPI: useCartComplete (POST /api/v1/cart/complete)
    CartAPI-->>PaymentPage: Order created (orderId)
    else Payment failure
        PaymentPage-->>User: Show payment error toast
    end

    Note over PaymentPage: Stores are NOT cleared here<br/>to prevent guard redirect race condition

    PaymentPage->>CheckoutStore: useCheckoutPagePayment.save(orderId)

    User->>Guard: Navigate to /checkout/complete/[id]
    Guard->>Guard: isCompletePage → bypass all checks
    Guard->>CompletePage: Allow access

    CompletePage->>OrderAPI: useOrder (GET /api/v1/booking/order/[id])
    OrderAPI-->>CompletePage: Order data
    CompletePage->>CompletePage: analytics.trackPurchase
    CompletePage->>CompletePage: Wait 5s for analytics flush

    CompletePage->>ClearHook: clearAfterComplete()
    ClearHook->>ClearHook: clearCart() + clearBooking() + clearCheckout()
    ClearHook->>ClearHook: Invalidate React Query caches

    CompletePage->>OrderAPI: markOrderViewed (PATCH)
    CompletePage->>User: router.push(/order/[id])
```

## Checkout Page Flow

[View diagram source](./diagrams/checkout-page-flow.mmd)

```mermaid
stateDiagram-v2
    [*] --> Contacts: cart.totalItems > 0
    Contacts --> Payment: Details Saved to Store
    Payment --> Redirected: Redirect-based payment leaves checkout page
    Redirected --> PaymentResumed: Return to /checkout/payment with redirect params
    Payment --> PaymentResumed: Non-redirect payment continues in iframe
    PaymentResumed --> Complete: Cart Completed (Order Created)
    Complete --> OrderPage: Stores Cleared + Order Marked Viewed
    OrderPage --> [*]

    Contacts: /checkout/contacts
    Contacts: Enter name, email, phone, address
    Contacts: Guard requires: cart not empty

    Payment: /checkout/payment
    Payment: INIT -> READY -> PROCESS_PAYMENT
    Payment: Guard requires: checkout.details != null

    Redirected: External provider page (e.g. Affirm)
    Redirected: Uses paymentRequest.returnUrl

    PaymentResumed: /checkout/payment#checkout-iframe
    PaymentResumed: INIT -> READY -> RESUME_PAYMENT
    PaymentResumed: URL params stripped after restore

    Complete: /checkout/complete/[id]
    Complete: Track purchase analytics
    Complete: Wait 5s → clear stores → redirect
    Complete: Guard bypassed (isCompletePage)

    OrderPage: /order/[id]
    OrderPage: Final destination

    note right of Payment
        Stores NOT cleared on payment success.
        useCartClearAfterComplete runs on
        Complete page to avoid guard race condition.
    end note
```

## Data Flow

[View diagram source](./diagrams/data-flow.mmd)

```mermaid
flowchart LR
    CartStore[(Cart Store<br/>Zustand)] -->|"cart data"| useCheckoutWithCart
    CheckoutStore[(Checkout Store<br/>Zustand)] -->|"checkout state"| useCheckoutWithCart[useCheckoutWithCart]
    SessionStorage[(sessionStorage)]
    BrowserURL[(Browser URL)]

    useCheckoutWithCart --> Guard[CheckoutWizardGuard]
    Guard -->|"controls access"| ContactsPage[Contacts Page]
    Guard -->|"controls access"| PaymentPage[Payment Page]
    Guard -->|"bypasses checks"| CompletePage[Complete Page]

    ContactsPage --> useCheckoutPageDetails[useCheckoutPageDetails]
    useCheckoutPageDetails -->|"set details"| CheckoutStore

    PaymentPage --> useRocketRezPayment[useRocketRezPayment]
    useRocketRezPayment -->|"INIT, PROCESS_PAYMENT, RESUME_PAYMENT"| PaymentIframe[PaymentV2 Iframe]
    PaymentIframe -->|"READY, PAYMENT_AUTH_*, PAYMENT_*"| useRocketRezPayment
    PaymentPage -->|"persist redirect state before PROCESS_PAYMENT"| SessionStorage
    BrowserURL -->|"payment_intent_client_secret, redirect_status"| PaymentPage
    PaymentPage -->|"strip payment params via history.replaceState"| BrowserURL
    SessionStorage -->|"restore redirect state"| PaymentPage
    PaymentPage --> useCartComplete[useCartComplete]
    useCartComplete -->|"POST complete"| CartAPI[(/api/v1/cart/complete)]
    CartAPI -->|"creates order"| OrderDB[(Orders DB)]

    CompletePage --> useOrder[useOrder]
    useOrder -->|"GET order"| OrderAPI[(/api/v1/booking/order)]

    CompletePage --> useCartClearAfterComplete[useCartClearAfterComplete]
    useCartClearAfterComplete -->|"clearCart"| CartStore
    useCartClearAfterComplete -->|"clearBooking"| BookingStore[(Booking Store<br/>Zustand)]
    useCartClearAfterComplete -->|"clearCheckout"| CheckoutStore
    useCartClearAfterComplete -->|"invalidate"| ReactQuery[React Query Cache]

```
