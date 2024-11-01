import { useId } from 'react'
import {
  Fieldset,
  Label,
  TextArea,
  type TextAreaProps,
  Theme,
  useThemeName,
} from 'tamagui'

import { FieldError } from '@/components/form/field-error'
import type { FieldError as FieldErrorType } from 'react-hook-form'

type TextAreaFieldProps = TextAreaProps & {
  label?: string
  placeholder?: string
  isSubmitting?: boolean
  field: TextAreaProps
  error?: FieldErrorType
}

export const TextAreaField = ({
  label,
  placeholder,
  isSubmitting,
  field,
  error,
  ...rest
}: TextAreaFieldProps) => {
  const { maxLength, value, onBlur, onChange, size } = field

  const themeName = useThemeName()
  const id = useId()

  return (
    <Theme name={error ? 'red' : themeName} forceClassName>
      <Fieldset>
        {!!label && (
          <Label theme="alt1" size={size || '$3'} htmlFor={id}>
            {label}
          </Label>
        )}
        <TextArea
          disabled={isSubmitting}
          value={value}
          onChangeText={(text) => {
            if (onChange) {
              // biome-ignore lint/suspicious/noExplicitAny: <explanation>
              onChange(text as any) // TO SOLVE
            }
          }}
          placeholder={placeholder}
          id={id}
          rows={5}
          h={150}
          maxLength={maxLength}
          onBlur={onBlur}
          {...rest}
        />
        <FieldError message={error?.message} />
      </Fieldset>
    </Theme>
  )
}
