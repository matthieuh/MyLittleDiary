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
  error
}: TextAreaFieldProps) => {
  const themeName = useThemeName();
  const id = useId();
  const disabled = isSubmitting;

  return (
    <Theme name={error ? "red" : themeName} forceClassName>
      <Fieldset>
        {!!label && (
          <Label theme="alt1" size={field.size || "$3"} htmlFor={id}>
            {label}
          </Label>
        )}
        <TextArea
          disabled={disabled}
          placeholderTextColor="$color10"
          value={field.value}
          onChangeText={(text) => {
            console.log("onChangeText", text);
            if (field.onChange) {
              field.onChange(text as any); // TO SOLVE
            }
          }}
          onBlur={field.onBlur}
          placeholder={placeholder}
          id={id}
          rows={5}
          autoFocus
          h={150}
          {...field}
        />
        <FieldError message={error?.message} />
      </Fieldset>
    </Theme>
  );
};
