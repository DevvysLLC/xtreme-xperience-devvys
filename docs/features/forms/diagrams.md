# Forms Feature Flow Diagrams

> **Client-facing overview:** See [Forms — User Journey](./client/readme.md) for a digestible, non-technical summary.

## Form Rendering Decision Tree

[View diagram source](./diagrams/form-rendering-decision.mmd)

```mermaid
flowchart TD
    Start([Form Data Loaded]) --> HasIframe{"Has<br/>iframeEmbed?"}

    HasIframe -->|Yes| ValidateHtml[validateHtmlForEmbed]
    ValidateHtml --> IsSafe{"HTML<br/>Safe?"}
    IsSafe -->|Yes| RenderIframe["Render iframe<br/>dangerouslySetInnerHTML"]
    IsSafe -->|No| ShowError[Show Error Message]

    HasIframe -->|No| HasHubspot{"Has<br/>hubspotEmbed?"}

    HasHubspot -->|Yes| CheckVersion{"hubspotVersion?"}
    CheckVersion -->|v2| RenderV2["HubspotFormV2<br/>hbspt.forms.create()"]
    CheckVersion -->|v4 / empty| RenderV4["HubspotFormV4<br/>Data-attribute embed"]

    HasHubspot -->|No| HasModel{"Has native<br/>form model?"}
    HasModel -->|Yes| RenderNative["CoreForm<br/>Native fields"]
    HasModel -->|No| RenderNothing[Render Nothing]

    style ValidateHtml fill:#d0d0d0,color:#000
    style RenderIframe fill:#b0b0b0,color:#000
    style RenderV2 fill:#b0b0b0,color:#000
    style RenderV4 fill:#b0b0b0,color:#000
    style RenderNative fill:#b0b0b0,color:#000
    style ShowError fill:#a0a0a0,color:#000
```

## Form Dialog Flow (CTA Trigger)

[View diagram source](./diagrams/form-dialog-flow.mmd)

```mermaid
sequenceDiagram
    participant User
    participant CoreCta
    participant FormDialogContext
    participant GlobalFormDialog
    participant useForm
    participant API as /api/v1/frontend/form/:handle
    participant DatoCMS
    participant Drawer

    User->>CoreCta: Click CTA (action: open:form)
    CoreCta->>FormDialogContext: openFormDialog(handle)
    FormDialogContext->>GlobalFormDialog: isOpen: true, handle

    GlobalFormDialog->>Drawer: Send open message via bus
    Drawer-->>User: Drawer opens (loading spinner)

    GlobalFormDialog->>useForm: Fetch form by handle
    useForm->>API: GET /api/v1/frontend/form/:handle
    API->>DatoCMS: GraphQL getFormByHandle
    DatoCMS-->>API: FormRecord
    API-->>useForm: JSON response
    useForm-->>GlobalFormDialog: Form data

    alt iframeEmbed present
        GlobalFormDialog->>GlobalFormDialog: validateHtmlForEmbed()
        GlobalFormDialog-->>User: Render iframe
    else hubspotEmbed present
        alt hubspotVersion = v2
            GlobalFormDialog-->>User: Render HubspotFormV2
        else hubspotVersion = v4 or empty
            GlobalFormDialog-->>User: Render HubspotFormV4
        end
    else native form model
        GlobalFormDialog-->>User: Render CoreForm
    end
```

## HubSpot v4 Rendering Flow

[View diagram source](./diagrams/hubspot-v4-flow.mmd)

```mermaid
flowchart TD
    Start([HubspotFormV4 Mount]) --> Parse["Parse embed HTML<br/>Extract scriptSrc, region,<br/>formId, portalId"]

    Parse --> HasRequired{"scriptSrc +<br/>formId +<br/>portalId?"}
    HasRequired -->|No| RenderNothing[Render Nothing]
    HasRequired -->|Yes| CheckLoaded{"Script already<br/>loaded?"}

    CheckLoaded -->|Yes| SkipLoad[Skip script load]
    CheckLoaded -->|No| LoadScript["Append script to body<br/>e.g. /embed/developer/43829367.js"]

    LoadScript --> RenderDiv
    SkipLoad --> RenderDiv

    RenderDiv["Render div<br/>class=hs-form-html<br/>data-region, data-form-id,<br/>data-portal-id"]

    RenderDiv --> HubSpotSDK["HubSpot SDK detects div<br/>and renders form"]

    HubSpotSDK --> FormRendered["Form visible<br/>(hsfc-* CSS classes)"]

    style Parse fill:#d0d0d0,color:#000
    style LoadScript fill:#b0b0b0,color:#000
    style HubSpotSDK fill:#b0b0b0,color:#000
    style FormRendered fill:#a0a0a0,color:#000
```

## HubSpot v2 Rendering Flow

[View diagram source](./diagrams/hubspot-v2-flow.mmd)

```mermaid
flowchart TD
    Start([HubspotFormV2 Mount]) --> Parse["Parse embed HTML<br/>Extract region,<br/>formId, portalId"]

    Parse --> HasRequired{"formId +<br/>portalId?"}
    HasRequired -->|No| RenderNothing[Render Nothing]
    HasRequired -->|Yes| RenderContainer["Render container div<br/>id=hs-form-{formId}"]

    RenderContainer --> CheckScript{"v2 script<br/>loaded?"}
    CheckScript -->|Yes| CheckHbspt{"window.hbspt<br/>available?"}
    CheckScript -->|No| LoadScript["Load v2 script<br/>//js.hsforms.net/forms/embed/v2.js"]

    LoadScript --> PollReady["Poll for<br/>window.hbspt"]
    PollReady --> CheckHbspt

    CheckHbspt -->|Yes| CreateForm["hbspt.forms.create()<br/>region, portalId,<br/>formId, target"]
    CheckHbspt -->|No| PollReady

    CreateForm --> FormRendered["Form visible<br/>(hs-* CSS classes)"]

    style Parse fill:#d0d0d0,color:#000
    style LoadScript fill:#b0b0b0,color:#000
    style CreateForm fill:#b0b0b0,color:#000
    style FormRendered fill:#a0a0a0,color:#000
```
