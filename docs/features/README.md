# Features Documentation

This directory contains documentation for the main features of the application.

## Features

- [Booking](./booking/README.md) - Booking wizard and event selection
- [Analytics](./analytics/README.md) - Event tracking for GA4/GTM and Facebook Pixel
- [Cart](./cart/README.md) - Shopping cart management
- [Checkout](./checkout/README.md) - Checkout process
- [Forms](./forms/README.md) - Form rendering (iframe, HubSpot v2/v4, native)
- [Trackfinder](./trackfinder/README.md) - Track finding and location services

## Diagrams

Each feature directory contains:
- `diagrams.md` - Markdown file with rendered Mermaid diagrams
- `diagrams/` - Directory containing individual `.mmd` source files for each diagram

The `.mmd` files can be used with Mermaid CLI tools or imported into diagramming tools that support Mermaid format.

## PDF

A combined PDF of all client readmes (with Mermaid diagrams rendered) is built by the generate-client-docs-pdf workflow on push to `main`. Run locally: `./devops/src/build-docs-pdf.sh docs/` (requires `pip install md2pdf-mermaid` and `playwright install chromium`).
