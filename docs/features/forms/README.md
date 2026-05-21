# Forms Feature

## Overview

The forms feature handles rendering dynamic forms within the application. Forms are configured in DatoCMS and can be rendered inline (e.g. in a contact section) or in a dialog triggered by a CTA button. Three rendering strategies are supported based on the CMS configuration:

1. **Iframe Embed** — raw HTML iframe rendered via `dangerouslySetInnerHTML` after safety validation
2. **HubSpot Embed (v4)** — HubSpot's data-attribute embed with per-portal script (default)
3. **HubSpot Embed (v2)** — HubSpot's Forms v2 JS SDK using `hbspt.forms.create()`
4. **Native Form** — custom form fields defined in DatoCMS, rendered with `CoreForm`

- [Client Docs](./client/readme.md) — Client-facing, digestible overview
- [Flow Diagrams](./diagrams.md) — Technical flow diagrams for developers

## CMS Data Model

### FormRecord

The `FormRecord` in DatoCMS contains the following fields:

| Field | Type | Description |
|-------|------|-------------|
| `iframeEmbed` | String | Raw HTML iframe embed code (e.g. HubSpot CTA popup) |
| `hubspotEmbed` | String | HubSpot form embed HTML with data attributes |
| `hubspotVersion` | String | HubSpot API version: `v2` or `v4` |
| `model` | FormModelRecord | Native form configuration (fields, submit button, success/error states) |

**Priority:** `iframeEmbed` > `hubspotEmbed` > native `model`

### FormModelRecord

Used for native forms (not HubSpot). Contains form field definitions, submit button text, success/error messaging, and a form provider identifier.

## Entry Points

### Dialog (CTA Trigger)

A `CoreCta` with `action: "open:form"` and `actionDetail: "<form-handle>"` triggers the form dialog:

1. `CoreCta` calls `openFormDialog(handle)` via the `FormDialogContext`
2. `GlobalFormDialog` opens a `Drawer` and fetches form data via `useForm(handle)`
3. `useForm` calls `GET /api/v1/frontend/form/:handle` which queries DatoCMS
4. The dialog renders the appropriate form type based on the response

**Location:** `src/components/global-form-dialog/`

### Inline (Section Contact)

The `SectionContact` component renders a form directly in the page. If `embedForm` (a raw HubSpot embed string on the section) is present, it renders `CoreHubspotForm`. Otherwise it falls back to `CoreForm` with native fields.

**Location:** `src/components/section-contact/`

## Components

### CoreHubspotForm

Delegates to the correct HubSpot renderer based on the `hubspotVersion` prop.

- `hubspotVersion: "v2"` renders `HubspotFormV2`
- `hubspotVersion: "v4"` (or unset) renders `HubspotFormV4`

**Location:** `src/components/core-hubspot-form/index.tsx`

### HubspotFormV4

Renders HubSpot forms using the **v4 data-attribute embed approach**:

1. Parses the embed HTML to extract `scriptSrc`, `data-region`, `data-form-id`, `data-portal-id`
2. Dynamically loads the per-portal script (e.g. `https://js.hsforms.net/forms/embed/developer/43829367.js`)
3. Renders a `<div>` with `class="hs-form-html"` and data attributes
4. HubSpot's script picks up the div and renders the form

**Location:** `src/components/core-hubspot-form/components/hubspot-form-v4.tsx`

### HubspotFormV2

Renders HubSpot forms using the **v2 Forms JS SDK**:

1. Parses the embed HTML to extract `data-region`, `data-form-id`, `data-portal-id`
2. Dynamically loads the shared v2 script (`//js.hsforms.net/forms/embed/v2.js`)
3. Calls `window.hbspt.forms.create()` with the extracted configuration
4. HubSpot renders the form into the target container

**Location:** `src/components/core-hubspot-form/components/hubspot-form-v2.tsx`

### CoreForm

Renders native forms defined in DatoCMS with custom form fields, validation, and submit handling.

**Location:** `src/components/core-form/index.tsx`

### GlobalFormDialog

A drawer-based dialog that loads and displays a form by handle. Uses the message bus to coordinate open/close with the global drawer system.

**Location:** `src/components/global-form-dialog/index.tsx`

## Hooks

### useForm

Fetches form data from the API by handle. Uses React Query with the key `['frontend', 'form', handle]`. Validates the response with `ApiFormGetFormByHandleResponseSchema`.

**Location:** `src/hooks/use-form/use-form.ts`

### useFormDialog

Context hook providing `isOpen`, `handle`, `openFormDialog(handle)`, and `closeFormDialog()`.

**Location:** `src/components/global-form-dialog/context.tsx`

## API

### GET /api/v1/frontend/form/:handle

Fetches a `FormRecord` from DatoCMS by its handle.

**Location:** `src/app/api/v1/frontend/form/[handle]/route.ts`

## Safety

Iframe embed content from the CMS is validated before rendering via `validateHtmlForEmbed()`. This function:

1. Unwraps DatoCMS markdown processing artifacts (`<p>` wrapping, HTML entity encoding)
2. Rejects content containing `<script>` tags, `javascript:` URLs, or inline event handlers
3. Returns the sanitised HTML only if safe

**Location:** `src/utils/is-html-safe-for-embed.ts`

## HubSpot Version Comparison

| Aspect | v4 (default) | v2 |
|--------|-------------|-----|
| Script | Per-portal (`/embed/developer/{portalId}.js`) | Shared (`/embed/v2.js`) |
| Rendering | Data-attribute div, auto-detected by script | `hbspt.forms.create()` programmatic call |
| CSS classes | `hsfc-*` prefixed (e.g. `hsfc-TextInput`) | `hs-*` prefixed (e.g. `hs-input`) |
| CMS field | `hubspotVersion: "v4"` or empty | `hubspotVersion: "v2"` |

## CMS Configuration

### HubSpot Form (v4 — default)

Set `hubspotEmbed` to the full embed snippet from HubSpot:

```html
<script src="https://js.hsforms.net/forms/embed/developer/43829367.js" defer></script>
<div class="hs-form-html" data-region="na1" data-form-id="809dc90b-..." data-portal-id="43829367"></div>
```

Leave `hubspotVersion` empty or set to `v4`.

### HubSpot Form (v2)

Set `hubspotEmbed` to the same embed snippet (or just the `<div>` portion — the script tag is ignored):

```html
<div class="hs-form-html" data-region="na1" data-form-id="809dc90b-..." data-portal-id="43829367"></div>
```

Set `hubspotVersion` to `v2`.

### Iframe Embed

Set `iframeEmbed` to the raw iframe HTML. This takes priority over `hubspotEmbed`.

```html
<iframe src="https://..." style="border: none; height: 100%; width: 100%;"></iframe>
```
