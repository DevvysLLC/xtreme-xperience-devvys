import type React from 'react'

export const getMegaMenuHandlers = (
  hasChildren: boolean,
  itemId: string,
  setOpenMegaMenuId: (id: string | null) => void
) => {
  if (!hasChildren) {
    return {}
  }

  return {
    onMouseEnter: () => {
      setOpenMegaMenuId(itemId)
    },
    onMouseLeave: () => {
      setOpenMegaMenuId(null)
    },
    onFocus: () => {
      setOpenMegaMenuId(itemId)
    },
    onBlur: (event: React.FocusEvent<HTMLElement>) => {
      const { currentTarget, relatedTarget } = event
      if (
        relatedTarget instanceof Node &&
        currentTarget.contains(relatedTarget)
      ) {
        return
      }

      setOpenMegaMenuId(null)
    }
  }
}
