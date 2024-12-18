import { forwardRef, useId } from 'react'
import type { FieldError as FieldErrorType } from 'react-hook-form'
import {
  Fieldset,
  Input,
  type InputProps,
  Label,
  Theme,
  useThemeName,
} from 'tamagui'
import { FieldError } from './field-error'

type TextFieldProps = InputProps & {
  label?: string
  placeholder?: string
  isSubmitting?: boolean
  field: InputProps
  error?: FieldErrorType
}

export const TextField = forwardRef<Input, TextFieldProps>(
  ({ label, placeholder, isSubmitting, field, error, ...rest }, ref) => {
    const { maxLength, value, onBlur, onChange } = field

    const themeName = useThemeName()
    const id = useId()

    return (
      <Theme name={error ? 'red' : themeName} forceClassName>
        <Fieldset>
          {!!label && (
            <Label theme="alt1" size={field.size || '$3'} htmlFor={id}>
              {label}
            </Label>
          )}
          <Input
            ref={ref}
            disabled={isSubmitting}
            onChangeText={(text) => {
              if (onChange) {
                // biome-ignore lint/suspicious/noExplicitAny: <explanation>
                onChange(text as any) // TO SOLVE
              }
            }}
            placeholder={placeholder}
            id={id}
            value={value}
            onBlur={onBlur}
            maxLength={maxLength}
            {...rest}
          />
          <FieldError message={error?.message} />
        </Fieldset>
      </Theme>
    )
  },
)
