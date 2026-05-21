// @ts-check

import eslint from '@eslint/js'
import tseslint from 'typescript-eslint'
import { baseConfigs } from './devops/lint/base-rules.mjs'

/** @type {import('typescript-eslint').ConfigArray} */
const config = tseslint.config(
  eslint.configs.recommended,
  tseslint.configs.strict,
  ...baseConfigs
)

export default config
