import { useStringFieldInfo, useTsController } from '@ts-react/form'
import { useId } from 'react'
import { Fieldset, Input, InputProps, Label, Theme, useThemeName } from 'tamagui'
import { FieldError } from './field-error'
import { FieldError as FieldErrorType } from "react-hook-form";

type TextFieldProps = {
  label?: string;
  placeholder?: string;
  isSubmitting?: boolean;
  field: InputProps
  error?: FieldErrorType;
}

export const TextField = ({
  label,
  placeholder,
  isSubmitting,
  field,
  error
}: TextFieldProps) => {
  const { maxLength, value, onBlur, onChange, ...rest } = field

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
          disabled={isSubmitting}
          onChangeText={(text) => {
            if (onChange) {
              onChange(text as any); // TO SOLVE
            }
          }}
          placeholder={placeholder}
          id={id}
          {...rest}
        />
        <FieldError message={error?.errorMessage} />
      </Fieldset>
    </Theme>
  )
}
