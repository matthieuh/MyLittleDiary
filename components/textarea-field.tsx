import { useId } from "react";
import {
  Fieldset,
  Label,
  TextArea,
  TextAreaProps,
  Theme,
  useThemeName,
} from "tamagui";

import { FieldError } from "@/components/field-error";
import { FieldError as FieldErrorType } from "react-hook-form";

type TextAreaFieldProps = {
  label?: string;
  placeholder?: string;
  isSubmitting?: boolean;
  field: TextAreaProps;
  error?: FieldErrorType;
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

  const themeName = useThemeName();
  const id = useId();

  return (
    <Theme name={error ? "red" : themeName} forceClassName>
      <Fieldset>
        {!!label && (
          <Label theme="alt1" size={size || "$3"} htmlFor={id}>
            {label}
          </Label>
        )}
        <TextArea
          disabled={isSubmitting}
          value={value}
          onChangeText={(text) => {
            if (onChange) {
              onChange(text as any); // TO SOLVE
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
  );
};
