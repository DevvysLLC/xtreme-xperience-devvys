# add CoreCta fallback to track spec when there are no upcoming events
- review: src/components/section-track-spec
- review new track.model field "notifyMeCta"
  - if eventsToShow is empty
  - render CoreCta with notifyMeCta
