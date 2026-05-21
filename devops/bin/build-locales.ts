#!/usr/bin/env node

/**
 * Gathers component translations from component translation directories
 * and merges them into src/locales/[locale].json files.
 *
 * Scans src/components/[component-name]/translations/[locale].json files
 *
 * This script:
 * 1. Scans src/components directory for translation files
 * 2. Groups translations by locale (e.g., en.json, de.json)
 * 3. Merges component translations into the corresponding locale files
 * 4. Writes the merged translations back to src/locales/[locale].json
 *
 * Run this script before building to ensure all component translations
 * are included in the locale files.
 */

import { accessSync } from 'node:fs'
import { readdir, readFile, stat, writeFile } from 'node:fs/promises'
import { dirname, join } from 'node:path'
import { fileURLToPath } from 'node:url'
import { mergeDeep } from 'remeda'
import { initLogger } from '../../src/core/logger/index.js'

const logger = initLogger()

const __filename = fileURLToPath(import.meta.url)
const __dirname = dirname(__filename)

// Get project root (3 levels up from devops/bin/ or use process.cwd() as fallback)
const scriptBasedRoot = join(__dirname, '../../..')
const cwdBasedRoot = process.cwd()

// Use script-based root if it contains src/components, otherwise use cwd
const getProjectRoot = (): string => {
  const testPath = join(scriptBasedRoot, 'src', 'components')
  try {
    accessSync(testPath)
    return scriptBasedRoot
  } catch {
    return cwdBasedRoot
  }
}

const projectRoot = getProjectRoot()
const componentsDir = join(projectRoot, 'src', 'components')
const localesDir = join(projectRoot, 'src', 'locales')

/**
 * Type guard to check if a value is a valid messages object
 */
const isMessagesObject = (value: unknown): value is Record<string, unknown> => {
  return value !== null && typeof value === 'object' && !Array.isArray(value)
}

/**
 * Discovers all component translation files and groups them by locale
 */
const discoverComponentTranslations = async (): Promise<
  Map<
    string,
    Array<{ componentName: string; translations: Record<string, unknown> }>
  >
> => {
  const translationsByLocale = new Map<
    string,
    Array<{ componentName: string; translations: Record<string, unknown> }>
  >()

  try {
    const entries = await readdir(componentsDir, { withFileTypes: true })

    for (const entry of entries) {
      if (!entry.isDirectory()) {
        continue
      }

      const componentPath = join(componentsDir, entry.name)
      const translationsPath = join(componentPath, 'translations')

      try {
        const stats = await stat(translationsPath)
        if (!stats.isDirectory()) {
          continue
        }

        // Read all JSON files in the translations directory
        const translationFiles = await readdir(translationsPath)
        const jsonFiles = translationFiles.filter((file) =>
          file.endsWith('.json')
        )

        for (const jsonFile of jsonFiles) {
          const locale = jsonFile.replace('.json', '')
          const filePath = join(translationsPath, jsonFile)

          try {
            const fileContent = await readFile(filePath, 'utf-8')
            const parsed = JSON.parse(fileContent)

            if (isMessagesObject(parsed)) {
              if (!translationsByLocale.has(locale)) {
                translationsByLocale.set(locale, [])
              }

              // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
              translationsByLocale.get(locale)!.push({
                componentName: entry.name,
                translations: parsed
              })
            } else {
              logger.warn(
                { filePath },
                'Translation file is not a valid JSON object, skipping'
              )
            }
          } catch (error) {
            logger.error(
              {
                filePath,
                error: error instanceof Error ? error.message : String(error)
              },
              'Failed to read/parse translation file'
            )
          }
        }
      } catch {
        logger.trace("Component doesn't have translations, skip it")
      }
    }
  } catch (error) {
    logger.error(
      {
        componentsDir,
        error: error instanceof Error ? error.message : String(error)
      },
      'Failed to read components directory'
    )
    process.exit(1)
  }

  return translationsByLocale
}

/**
 * Loads existing locale file or returns empty object
 */
const loadLocaleFile = async (
  locale: string
): Promise<Record<string, unknown>> => {
  const localePath = join(localesDir, `${locale}.json`)

  try {
    const fileContent = await readFile(localePath, 'utf-8')
    const parsed = JSON.parse(fileContent)

    if (isMessagesObject(parsed)) {
      return parsed
    }

    logger.warn(
      { localePath },
      'Locale file is not a valid JSON object, starting fresh'
    )
    return {}
  } catch (error) {
    if (error instanceof Error && 'code' in error && error.code === 'ENOENT') {
      // File doesn't exist, return empty object
      return {}
    }

    logger.warn(
      {
        localePath,
        error: error instanceof Error ? error.message : String(error)
      },
      'Failed to read locale file, starting fresh'
    )
    return {}
  }
}

/**
 * Writes merged translations to locale file
 */
const writeLocaleFile = async (
  locale: string,
  translations: Record<string, unknown>
): Promise<void> => {
  const localePath = join(localesDir, `${locale}.json`)

  try {
    const content = JSON.stringify(translations, null, 2) + '\n'
    await writeFile(localePath, content, 'utf-8')
    logger.info({ localePath }, 'Updated locale file')
  } catch (error) {
    logger.error(
      {
        localePath,
        error: error instanceof Error ? error.message : String(error)
      },
      'Failed to write locale file'
    )
    throw error
  }
}

/**
 * Discovers all existing locale files
 */
const discoverExistingLocales = async (): Promise<string[]> => {
  try {
    const files = await readdir(localesDir)
    return files
      .filter((file) => file.endsWith('.json'))
      .map((file) => file.replace('.json', ''))
  } catch {
    return []
  }
}

/**
 * Main function to gather and merge component translations
 */
const main = async (): Promise<void> => {
  logger.info({ componentsDir, localesDir }, 'Gathering component translations')

  // Discover all component translations
  const translationsByLocale = await discoverComponentTranslations()

  // Discover all existing locale files to ensure we process all of them
  const existingLocales = await discoverExistingLocales()
  const allLocales = new Set([
    ...existingLocales,
    ...translationsByLocale.keys()
  ])

  if (allLocales.size === 0) {
    logger.info('No locale files found')
    return
  }

  logger.info(
    {
      localeCount: allLocales.size,
      componentTranslationCount: translationsByLocale.size
    },
    'Processing locales'
  )

  // Process each locale (even if it has no component translations)
  for (const locale of allLocales) {
    logger.info({ locale }, 'Processing locale')

    // Load existing locale file (preserves styleguide and other manual translations)
    let mergedTranslations = await loadLocaleFile(locale)

    // Merge component translations if they exist for this locale
    const componentTranslations = translationsByLocale.get(locale)
    if (componentTranslations) {
      for (const { componentName, translations } of componentTranslations) {
        logger.info(
          { componentName, locale },
          'Merging translations from component'
        )
        // Merge component translations into existing translations
        // This preserves existing keys like 'styleguide'
        mergedTranslations = mergeDeep(mergedTranslations, translations)
      }
    }

    // Write merged translations back (preserves all existing keys)
    await writeLocaleFile(locale, mergedTranslations)
  }

  logger.info('Component translations gathered successfully')
}

// Run the script
main().catch((error) => {
  logger.error(
    { error: error instanceof Error ? error.message : String(error) },
    'Script failed'
  )
  process.exit(1)
})
