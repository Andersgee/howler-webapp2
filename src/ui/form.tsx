import * as React from "react";
import { type ComponentPropsWithRef } from "react";
import type * as LabelPrimitive from "@radix-ui/react-label";
import { Slot } from "@radix-ui/react-slot";
import {
  Controller,
  type ControllerProps,
  type FieldPath,
  type FieldValues,
  FormProvider,
  useFormContext,
} from "react-hook-form";

import { cn } from "#src/utils/cn";
import { Label } from "#src/ui/label";

const Form = FormProvider;

type FormFieldContextValue<
  TFieldValues extends FieldValues = FieldValues,
  TName extends FieldPath<TFieldValues> = FieldPath<TFieldValues>,
> = {
  name: TName;
};

const FormFieldContext = React.createContext<FormFieldContextValue>({} as FormFieldContextValue);

const FormField = <
  TFieldValues extends FieldValues = FieldValues,
  TName extends FieldPath<TFieldValues> = FieldPath<TFieldValues>,
>({
  ...props
}: ControllerProps<TFieldValues, TName>) => {
  return (
    <FormFieldContext.Provider value={{ name: props.name }}>
      <Controller {...props} />
    </FormFieldContext.Provider>
  );
};

const useFormField = () => {
  const fieldContext = React.useContext(FormFieldContext);
  const itemContext = React.useContext(FormItemContext);
  const { getFieldState, formState } = useFormContext();

  const fieldState = getFieldState(fieldContext.name, formState);

  if (!fieldContext) {
    throw new Error("useFormField should be used within <FormField>");
  }

  const { id } = itemContext;

  return {
    id,
    name: fieldContext.name,
    formItemId: `${id}-form-item`,
    formDescriptionId: `${id}-form-item-description`,
    formMessageId: `${id}-form-item-message`,
    ...fieldState,
  };
};

type FormItemContextValue = {
  id: string;
};

const FormItemContext = React.createContext<FormItemContextValue>({} as FormItemContextValue);

function FormItem({ className, ref, ...props }: ComponentPropsWithRef<"div">) {
  const id = React.useId();

  return (
    <FormItemContext.Provider value={{ id }}>
      <div
        ref={ref}
        className={cn(
          //"space-y-2",
          className
        )}
        {...props}
      />
    </FormItemContext.Provider>
  );
}

function FormLabel({ className, ref, ...props }: ComponentPropsWithRef<typeof LabelPrimitive.Root>) {
  const { error: _err, formItemId } = useFormField();

  return (
    <Label
      ref={ref}
      className={className}
      //className={cn(error && "animate-pulse-tmp text-color-accent-danger-500", className)}
      htmlFor={formItemId}
      {...props}
    />
  );
}

function FormControl({ ref, ...props }: ComponentPropsWithRef<typeof Slot>) {
  const { error, formItemId, formDescriptionId, formMessageId } = useFormField();
  return (
    <Slot
      ref={ref}
      id={formItemId}
      aria-describedby={!error ? `${formDescriptionId}` : `${formDescriptionId} ${formMessageId}`}
      aria-invalid={!!error}
      {...props}
    />
  );
}

function FormDescription({ className, ref, ...props }: ComponentPropsWithRef<"p">) {
  const { formDescriptionId } = useFormField();
  return <p ref={ref} id={formDescriptionId} className={cn("text-sm text-color-neutral-700", className)} {...props} />;
}

function FormMessage({ className, children, ref, ...props }: ComponentPropsWithRef<"p">) {
  const { error, formMessageId } = useFormField();
  const body = error ? String(error?.message) : children;

  if (!body) {
    return null;
  }

  return (
    <p
      ref={ref}
      id={formMessageId}
      className={cn("animate-pulse-tmp text-sm font-medium text-color-accent-danger-500", className)}
      {...props}
    >
      {body}
    </p>
  );
}

export { useFormField, Form, FormItem, FormLabel, FormControl, FormDescription, FormMessage, FormField };
