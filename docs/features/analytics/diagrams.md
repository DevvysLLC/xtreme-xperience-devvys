# Analytics Feature Flow Diagrams

> **Client-facing overview:** See [Analytics — User Journey](./client/readme.md) for a digestible, non-technical summary.

## Analytics Architecture Overview

[View diagram source](./diagrams/analytics-architecture-overview.mmd)

```mermaid
flowchart TD
    UserAction[User Interaction] --> Entry{Tracking Entry Point}

    Entry -->|click/submit| ScriptsGA[ScriptsGoogleAnalytics]
    Entry -->|cart/checkout hooks| EcommerceHook[useAnalyticsEcommerceEvent]
    Entry -->|book/view hooks| GA4Custom[useAnalyticsGA4Event custom events]

    ScriptsGA --> DataLayer[(window.dataLayer)]
    GA4Custom --> DataLayer

    EcommerceHook --> GA4Hook[useAnalyticsGA4Event]
    EcommerceHook --> FBHook[useAnalyticsFacebookPixelEvent]

    GA4Hook --> DataLayer
    FBHook --> FBQ[(window.fbq)]

    DataLayer --> GTM[Google Tag Manager]
    GTM --> GA4[GA4 Property]
    FBQ --> FacebookPixel[Facebook Pixel]

    style DataLayer fill:#d0d0d0,color:#000
    style FBQ fill:#d0d0d0,color:#000
    style GTM fill:#b0b0b0,color:#000
    style GA4 fill:#a0a0a0,color:#000
    style FacebookPixel fill:#a0a0a0,color:#000
```

## E-commerce Event Routing

[View diagram source](./diagrams/ecommerce-event-routing.mmd)

```mermaid
flowchart LR
    Start([trackEvent(type, data)]) --> Type{Event Type}

    Type -->|add_to_cart| AddCart[Send to FB + GA4]
    Type -->|remove_from_cart| RemoveCart[Send to GA4 only]
    Type -->|begin_checkout| BeginCheckout[Send to FB + GA4]
    Type -->|add_payment_info| AddPayment[Send to FB + GA4]
    Type -->|purchase| Purchase{Has transactionId?}

    Purchase -->|Yes| PurchaseBoth[Send to FB + GA4]
    Purchase -->|No| WarnOnly[Log warning, skip provider calls]

    AddCart --> End([Done])
    RemoveCart --> End
    BeginCheckout --> End
    AddPayment --> End
    PurchaseBoth --> End
    WarnOnly --> End

    style Type fill:#d0d0d0,color:#000
    style Purchase fill:#d0d0d0,color:#000
    style WarnOnly fill:#a0a0a0,color:#000
```

## Global Interaction Tracking Flow

[View diagram source](./diagrams/global-interaction-tracking-flow.mmd)

```mermaid
sequenceDiagram
    participant User
    participant DOM
    participant ScriptsGoogleAnalytics
    participant dataLayer as window.dataLayer
    participant GTM

    User->>DOM: click / submit
    DOM->>ScriptsGoogleAnalytics: document listener (capture)
    ScriptsGoogleAnalytics->>ScriptsGoogleAnalytics: find target + extract data-ga-* metadata
    ScriptsGoogleAnalytics->>ScriptsGoogleAnalytics: apply section context + rate limit
    ScriptsGoogleAnalytics->>dataLayer: push { event: xx_frontend_*, ...payload }
    dataLayer->>GTM: GTM reads event
    GTM-->>User: downstream tags fire (GA4, etc.)
```
