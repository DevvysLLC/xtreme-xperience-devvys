import type { GetHeaderQuery } from '../get-header.typegen'

export type MegaMenuItem = NonNullable<
  NonNullable<NonNullable<GetHeaderQuery['header']>['config']>['navigation']
>[number]['children'][number]

export const useMegaMenu = (items: MegaMenuItem[] = []) => {
  const supercars: MegaMenuItem[] = []
  const regular: MegaMenuItem[] = []

  items.forEach((item) => {
    if (item.link?.__typename === 'SupercarRecord') {
      supercars.push(item)
    } else {
      regular.push(item)
    }
  })

  const regularHasMedia = regular.some((item) => item.media)

  return {
    supercars,
    regular,
    regularHasMedia
  }
}
