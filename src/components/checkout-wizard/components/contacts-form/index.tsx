'use client'

import clsx from 'clsx'
import { useTranslations } from 'next-intl'
import type { FC } from 'react'
import {
  ContactEmailSchema,
  ContactPhoneSchema,
  ContactPostalCodeSchema
} from '../../../../io/schemas'
import type { TypedFormField } from '../../../../io/types'
import {
  createRequiredValidator,
  createSchemaValidator
} from '../../../../utils/form-validators'
import { US_STATES } from '../../config'
import styles from './style.module.scss'

type ContactsFormField = Omit<TypedFormField, 'handleChange' | 'handleBlur'> & {
  handleChange: (value: string) => void
  handleBlur: () => void
}

type Props = {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  form: any
}

export const ContactsForm: FC<Props> = ({ form }) => {
  const t = useTranslations('contacts_form')

  return (
    <form
      onSubmit={(e) => {
        e.preventDefault()
        e.stopPropagation()
        form.handleSubmit()
      }}
      className={styles.form}
    >
      <fieldset className={styles.form__section}>
        <legend className={clsx(styles.form__legend)}>
          {t('fields.title')}
        </legend>
        <div className={styles.form__fields}>
          <form.Field name="isValid">
            {(field: { name: string; state: { value: boolean } }) => (
              <input
                type="hidden"
                name={field.name}
                value={field.state.value ? 'true' : 'false'}
              />
            )}
          </form.Field>
          <form.Field name="isSubmitted">
            {(field: { name: string; state: { value: boolean } }) => (
              <input
                type="hidden"
                name={field.name}
                value={field.state.value ? 'true' : 'false'}
              />
            )}
          </form.Field>
          <form.Field
            name="firstName"
            validators={{
              onChange: createRequiredValidator(
                t('fields.first_name_error_required')
              )
            }}
          >
            {(field: ContactsFormField) => (
              <div
                className={clsx(styles.form__field, styles['form__field--50%'])}
              >
                <label htmlFor={field.name} className={styles.form__label}>
                  {t('fields.first_name')}
                  <span className={styles.form__required}>*</span>
                </label>
                <input
                  id={field.name}
                  type="text"
                  value={field.state.value}
                  onChange={(e) => {
                    field.handleChange(e.target.value)
                  }}
                  onBlur={field.handleBlur}
                  placeholder={t('fields.first_name_placeholder')}
                  className={clsx(
                    styles.form__input,
                    field.state.meta.errors.length > 0 &&
                      styles.form__input_error
                  )}
                />
                {field.state.meta.errors.length > 0 && (
                  <span className={styles.form__error}>
                    {field.state.meta.errors[0]}
                  </span>
                )}
              </div>
            )}
          </form.Field>

          {/* Last Name */}
          <form.Field
            name="lastName"
            validators={{
              onChange: createRequiredValidator(
                t('fields.last_name_error_required')
              )
            }}
          >
            {(field: ContactsFormField) => (
              <div
                className={clsx(styles.form__field, styles['form__field--50%'])}
              >
                <label htmlFor={field.name} className={styles.form__label}>
                  {t('fields.last_name')}
                  <span className={styles.form__required}>*</span>
                </label>
                <input
                  id={field.name}
                  type="text"
                  value={field.state.value}
                  onChange={(e) => {
                    field.handleChange(e.target.value)
                  }}
                  onBlur={field.handleBlur}
                  placeholder={t('fields.last_name_placeholder')}
                  className={clsx(
                    styles.form__input,
                    field.state.meta.errors.length > 0 &&
                      styles.form__input_error
                  )}
                />
                {field.state.meta.errors.length > 0 && (
                  <span className={styles.form__error}>
                    {field.state.meta.errors[0]}
                  </span>
                )}
              </div>
            )}
          </form.Field>

          {/* Email */}
          <form.Field
            name="email"
            validators={{
              onChange: createSchemaValidator(
                ContactEmailSchema,
                t('fields.email_error_required'),
                t('fields.email_error')
              ),
              onBlur: createSchemaValidator(
                ContactEmailSchema,
                t('fields.email_error_required'),
                t('fields.email_error')
              )
            }}
          >
            {(field: ContactsFormField) => (
              <div
                className={clsx(styles.form__field, styles['form__field--50%'])}
              >
                <label htmlFor={field.name} className={styles.form__label}>
                  {t('fields.email')}
                  <span className={styles.form__required}>*</span>
                </label>
                <input
                  id={field.name}
                  type="email"
                  value={field.state.value}
                  onChange={(e) => {
                    field.handleChange(e.target.value)
                  }}
                  onBlur={field.handleBlur}
                  placeholder={t('fields.email_placeholder')}
                  className={clsx(
                    styles.form__input,
                    field.state.meta.errors.length > 0 &&
                      styles.form__input_error
                  )}
                />
                {field.state.meta.errors.length > 0 && (
                  <span className={styles.form__error}>
                    {field.state.meta.errors[0]}
                  </span>
                )}
              </div>
            )}
          </form.Field>

          {/* Phone – required, tel input */}
          <form.Field
            name="phone"
            validators={{
              onChange: createSchemaValidator(
                ContactPhoneSchema,
                t('fields.phone_error_required'),
                t('fields.phone_error')
              ),
              onBlur: createSchemaValidator(
                ContactPhoneSchema,
                t('fields.phone_error_required'),
                t('fields.phone_error')
              )
            }}
          >
            {(field: ContactsFormField) => (
              <div
                className={clsx(styles.form__field, styles['form__field--50%'])}
              >
                <label htmlFor={field.name} className={styles.form__label}>
                  {t('fields.phone')}
                  <span className={styles.form__required}>*</span>
                </label>
                <input
                  id={field.name}
                  type="tel"
                  value={field.state.value}
                  onChange={(e) => {
                    field.handleChange(e.target.value)
                  }}
                  onBlur={field.handleBlur}
                  placeholder={t('fields.phone_placeholder')}
                  className={clsx(
                    styles.form__input,
                    field.state.meta.errors.length > 0 &&
                      styles.form__input_error
                  )}
                />
                {field.state.meta.errors.length > 0 && (
                  <span className={styles.form__error}>
                    {field.state.meta.errors[0]}
                  </span>
                )}
              </div>
            )}
          </form.Field>

          {/* Address Line 1 */}
          <form.Field
            name="addressLine1"
            validators={{
              onChange: createRequiredValidator(
                t('fields.address_line_1_error_required')
              )
            }}
          >
            {(field: ContactsFormField) => (
              <div
                className={clsx(styles.form__field, styles['form__field--50%'])}
              >
                <label htmlFor={field.name} className={styles.form__label}>
                  {t('fields.address_line_1')}
                  <span className={styles.form__required}>*</span>
                </label>
                <input
                  id={field.name}
                  type="text"
                  value={field.state.value}
                  onChange={(e) => {
                    field.handleChange(e.target.value)
                  }}
                  onBlur={field.handleBlur}
                  placeholder={t('fields.address_line_1_placeholder')}
                  className={clsx(
                    styles.form__input,
                    field.state.meta.errors.length > 0 &&
                      styles.form__input_error
                  )}
                />
                {field.state.meta.errors.length > 0 && (
                  <span className={styles.form__error}>
                    {field.state.meta.errors[0]}
                  </span>
                )}
              </div>
            )}
          </form.Field>

          {/* Address Line 2 */}
          <form.Field name="addressLine2">
            {(field: ContactsFormField) => (
              <div
                className={clsx(styles.form__field, styles['form__field--50%'])}
              >
                <label htmlFor={field.name} className={styles.form__label}>
                  {t('fields.address_line_2')}
                </label>
                <input
                  id={field.name}
                  type="text"
                  value={field.state.value}
                  onChange={(e) => {
                    field.handleChange(e.target.value)
                  }}
                  onBlur={field.handleBlur}
                  placeholder={t('fields.address_line_2_placeholder')}
                  className={styles.form__input}
                />
              </div>
            )}
          </form.Field>

          {/* City */}
          <form.Field
            name="city"
            validators={{
              onChange: createRequiredValidator(t('fields.city_error_required'))
            }}
          >
            {(field: ContactsFormField) => (
              <div
                className={clsx(styles.form__field, styles['form__field--33%'])}
              >
                <label htmlFor={field.name} className={styles.form__label}>
                  {t('fields.city')}
                  <span className={styles.form__required}>*</span>
                </label>
                <input
                  id={field.name}
                  type="text"
                  value={field.state.value}
                  onChange={(e) => {
                    field.handleChange(e.target.value)
                  }}
                  onBlur={field.handleBlur}
                  placeholder={t('fields.city_placeholder')}
                  className={clsx(
                    styles.form__input,
                    field.state.meta.errors.length > 0 &&
                      styles.form__input_error
                  )}
                />
                {field.state.meta.errors.length > 0 && (
                  <span className={styles.form__error}>
                    {field.state.meta.errors[0]}
                  </span>
                )}
              </div>
            )}
          </form.Field>

          {/* Province */}
          <form.Field
            name="province"
            validators={{
              onChange: createRequiredValidator(
                t('fields.province_error_required')
              )
            }}
          >
            {(field: ContactsFormField) => (
              <div
                className={clsx(styles.form__field, styles['form__field--33%'])}
              >
                <label htmlFor={field.name} className={styles.form__label}>
                  {t('fields.province')}
                  <span className={styles.form__required}>*</span>
                </label>
                <select
                  id={field.name}
                  value={field.state.value}
                  onChange={(e) => {
                    field.handleChange(e.target.value)
                  }}
                  onBlur={field.handleBlur}
                  className={clsx(
                    styles.form__input,
                    field.state.meta.errors.length > 0 &&
                      styles.form__input_error
                  )}
                >
                  <option value="">
                    {t('fields.province_select_placeholder')}
                  </option>
                  {US_STATES.map((state) => (
                    <option key={state.code} value={state.code}>
                      {state.name}
                    </option>
                  ))}
                </select>
                {field.state.meta.errors.length > 0 && (
                  <span className={styles.form__error}>
                    {field.state.meta.errors[0]}
                  </span>
                )}
              </div>
            )}
          </form.Field>

          {/* Postal Code */}
          <form.Field
            name="postalCode"
            validators={{
              onChange: createSchemaValidator(
                ContactPostalCodeSchema,
                t('fields.postal_code_error_required'),
                t('fields.postal_code_error')
              ),
              onBlur: createSchemaValidator(
                ContactPostalCodeSchema,
                t('fields.postal_code_error_required'),
                t('fields.postal_code_error')
              )
            }}
          >
            {(field: ContactsFormField) => (
              <div
                className={clsx(styles.form__field, styles['form__field--33%'])}
              >
                <label htmlFor={field.name} className={styles.form__label}>
                  {t('fields.postal_code')}
                  <span className={styles.form__required}>*</span>
                </label>
                <input
                  id={field.name}
                  type="text"
                  value={field.state.value}
                  onChange={(e) => {
                    field.handleChange(e.target.value)
                  }}
                  onBlur={field.handleBlur}
                  placeholder={t('fields.postal_code_placeholder')}
                  className={clsx(
                    styles.form__input,
                    field.state.meta.errors.length > 0 &&
                      styles.form__input_error
                  )}
                />
                {field.state.meta.errors.length > 0 && (
                  <span className={styles.form__error}>
                    {field.state.meta.errors[0]}
                  </span>
                )}
              </div>
            )}
          </form.Field>

          {/* Country – fixed as US, hidden (not user-editable) */}
          <form.Field name="country">
            {(field: ContactsFormField) => (
              <input
                type="hidden"
                name={field.name}
                value={field.state.value}
              />
            )}
          </form.Field>
        </div>
      </fieldset>
    </form>
  )
}
