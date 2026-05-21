# Translation System (i18n)

This project uses [next-intl](https://next-intl-docs.vercel.app/) for internationalization with build-time component translation gathering.

## Overview

The translation system automatically discovers and gathers translations for all components at build time. Components with a `translations/` directory are automatically detected and merged into the locale files. No manual registration is required!

## How It Works

1. **Build-Time Gathering**: Before each build, the system runs a script that scans `src/components/` for translation files
2. **Automatic Discovery**: The script finds all `component/translations/*.json` files and groups them by locale
3. **Merging**: Component translations are merged into the corresponding `src/locales/[locale].json` files
4. **Cookie-Based Locale Detection**: At runtime, the system reads the locale from a `locale` cookie. If no cookie is present, it defaults to `en` (English)
5. **Static Loading**: The merged locale files are loaded statically based on the current locale
6. **Configuration**: The i18n system is configured via `request.ts` and integrated with Next.js via `next.config.ts`

## Adding Translations to a Component

To add translations for a new component, follow these steps:

### Step 1: Create the Translation Directory

Create a `translations/` directory inside your component folder:

```
src/components/my-component/
  ├── index.tsx
  ├── translations/
  │   ├── en.json
  │   └── de.json
  └── ...
```

### Step 2: Create Translation Files

Create JSON files for each locale you want to support. The file structure should match the component namespace used in `useTranslations()`.

**Example: `src/components/my-component/translations/en.json`**

```json
{
  "my-component": {
    "title": "Hello World",
    "subtitle": "Welcome to my component",
    "button": "Click me"
  }
}
```

**Example: `src/components/my-component/translations/de.json`**

```json
{
  "my-component": {
    "title": "Hallo Welt",
    "subtitle": "Willkommen bei meiner Komponente",
    "button": "Klick mich"
  }
}
```

### Step 3: Use Translations in Your Component

Import and use `useTranslations` from `next-intl` with your component namespace:

```typescript
'use client'

import { useTranslations } from 'next-intl'
import type { FC } from 'react'

export const MyComponent: FC = () => {
  const t = useTranslations('my-component')

  return (
    <div>
      <h1>{t('title')}</h1>
      <p>{t('subtitle')}</p>
      <button>{t('button')}</button>
    </div>
  )
}
```

**Important Notes:**
- The namespace passed to `useTranslations()` (e.g., `'my-component'`) must match the key in your translation JSON files
- Component names in file paths use kebab-case (e.g., `my-component`)
- The namespace in translation files and `useTranslations()` also uses kebab-case

## Translation File Structure

Translation files must export a JSON object where the top-level key matches the component namespace:

```json
{
  "component-name": {
    "key1": "Translation for key1",
    "key2": "Translation for key2",
    "nested": {
      "key": "Nested translation"
    }
  }
}
```

You can access nested keys using dot notation:

```typescript
const t = useTranslations('component-name')
t('nested.key') // Returns "Nested translation"
```

## Locale Detection

The application uses **cookie-based locale detection**. The locale is determined by reading a `locale` cookie from the request:

- **Cookie Name**: `locale`
- **Default Locale**: `en` (English) - used if the cookie is not present or invalid
- **Implementation**: Located in `src/i18n/request.ts` using Next.js `cookies()` API

The locale cookie is read on each request, allowing users to switch languages dynamically. The value is used to load the appropriate translation files for that locale.

**Example cookie values:**
- `locale=en` → Loads English translations
- `locale=de` → Loads German translations

To change the locale, set the `locale` cookie to the desired locale code. The change will take effect on the next request.

## Supported Locales

Currently supported locales:
- `en` (English) - Default
- `de` (German)

To add support for a new locale:
1. Create translation files with the new locale code (e.g., `fr.json`, `es.json`)
2. Set the `locale` cookie to the new locale code (e.g., `locale=fr`)
3. The system will automatically discover and load the new locale files

## Examples

### Example 1: SectionHero Component

**File Structure:**
```
src/components/section-hero/
  ├── index.tsx
  └── translations/
      ├── en.json
      └── de.json
```

**Translation File (`en.json`):**
```json
{
  "section-hero": {
    "title": "Hello world! Section Hero"
  }
}
```

**Component Usage:**
```typescript
const t = useTranslations('section-hero')
// ...
<section data-title={t('title')}>
```

### Example 2: Component with Nested Translations

**Translation File:**
```json
{
  "my-component": {
    "common": {
      "save": "Save",
      "cancel": "Cancel"
    },
    "errors": {
      "required": "This field is required",
      "invalid": "Invalid input"
    }
  }
}
```

**Component Usage:**
```typescript
const t = useTranslations('my-component')
// ...
<button>{t('common.save')}</button>
<span>{t('errors.required')}</span>
```

## File Structure Reference

```
src/
├── i18n/
│   ├── README.md (this file)
│   └── request.ts              # next-intl configuration
├── locales/
│   ├── en.json                 # Merged translations (updated by build script)
│   └── de.json                 # Merged translations (updated by build script)
└── components/
    └── [component-name]/
        ├── index.tsx
        └── translations/
            ├── en.json
            └── de.json
```

## Technical Details

- **Build-Time Gathering**: Translations are gathered before build using `devops/bin/build-locales.ts`
- **Script Execution**: The script runs automatically before each build via `prebuild` hook, or manually via `pnpm run gather-translations`
- **Merging Strategy**: Component translations are deep-merged into locale files using `remeda.mergeDeep`
- **Locale Detection**: Cookie-based locale detection via `cookies()` from `next/headers` in `request.ts`
- **Error Handling**: Missing translation files for a locale are handled gracefully (component is skipped)
- **Next.js Integration**: Uses `createNextIntlPlugin()` in `next.config.ts`
- **Request Config**: Locale messages are loaded statically via `getRequestConfig` in `request.ts`

## Troubleshooting

### Translations Not Loading

1. **Check namespace match**: Ensure the namespace in `useTranslations('namespace')` matches the key in your JSON file
2. **Check file location**: Translation files must be in `src/components/[component-name]/translations/[locale].json`
3. **Check file format**: Ensure JSON files are valid JSON with proper structure
4. **Run gather-translations**: Run `pnpm run gather-translations` to update locale files after adding/modifying component translations
5. **Rebuild**: Translations are gathered at build time, so rebuild if you add new components

### Missing Translations for a Locale

If a component doesn't have translations for a specific locale:
- The component will be skipped for that locale (no errors thrown)
- Other locales will continue to work normally
- Add the missing locale file to fix it

### Component Not Discovered

If your component isn't being discovered:
- Ensure the `translations/` directory exists and is named exactly `translations`
- Check that it's directly under `src/components/[component-name]/`
- The component directory name should match the namespace in your JSON files

## Related Files

- `src/i18n/request.ts` - Next.js request configuration for next-intl
- `devops/bin/build-locales.ts` - Build-time script that gathers and merges component translations
- `next.config.ts` - Next.js configuration with next-intl plugin
- `src/app/layout.tsx` - Root layout with NextIntlClientProvider

