export const SCROLL_TO_SECTION_MESSAGE_NAME = 'scrollto:section'

export type ScrollToSectionDetails = {
  id: string
}

export type ScrollToSection = {
  name: typeof SCROLL_TO_SECTION_MESSAGE_NAME
  details: ScrollToSectionDetails
}
