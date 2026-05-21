import { useMemo } from 'react'

const matchesPath = (pathname: string, pattern: string): boolean => {
  // Handle wildcard patterns (e.g., "/products/*")
  if (pattern.endsWith('/*')) {
    const basePath = pattern.slice(0, -2)
    return pathname === basePath || pathname.startsWith(`${basePath}/`)
  }

  // Handle exact matches and prefix matches
  return pathname === pattern || pathname.startsWith(`${pattern}/`)
}

export const useHeaderTransparency = (
  pathname: string,
  relativePaths?: string | null,
  isTransparentOverride?: boolean | null
) => {
  const transparentPaths = useMemo(
    () => (relativePaths ? relativePaths.split(',').map((p) => p.trim()) : []),
    [relativePaths]
  )

  const isTransparent = useMemo(() => {
    // If isTransparentOverride is explicitly set, use it and ignore relative path logic
    if (isTransparentOverride !== undefined && isTransparentOverride !== null) {
      return isTransparentOverride
    }

    // If no paths are configured, header is transparent by default
    if (!transparentPaths.length) {
      return true
    }

    // Check if pathname matches any of the configured paths
    const matchesConfiguredPath = transparentPaths.some((path) =>
      matchesPath(pathname, path)
    )

    // Header is transparent if pathname doesn't match any configured path
    return !matchesConfiguredPath
  }, [pathname, transparentPaths, isTransparentOverride])

  return isTransparent
}
