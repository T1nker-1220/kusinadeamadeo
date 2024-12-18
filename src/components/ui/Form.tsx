"use client"

import * as React from "react"
import { useForm, UseFormReturn, SubmitHandler, FieldValues } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { z } from "zod"
import { cn } from "@/lib/utils/cn"

interface FormProps<T extends FieldValues> extends Omit<React.FormHTMLAttributes<HTMLFormElement>, "onSubmit"> {
  form: UseFormReturn<T>
  onSubmit: SubmitHandler<T>
}

const Form = <T extends FieldValues>({
  form,
  onSubmit,
  children,
  className,
  ...props
}: FormProps<T>) => (
  <form onSubmit={form.handleSubmit(onSubmit)} className={cn("space-y-6", className)} {...props}>
    {children}
  </form>
)

interface FormFieldProps {
  name: string
  label?: string
  error?: string
  children: React.ReactNode
}

const FormField = React.forwardRef<HTMLDivElement, FormFieldProps>(
  ({ name, label, error, children }, ref) => {
    return (
      <div ref={ref} className="space-y-2">
        {label && (
          <label htmlFor={name} className="text-sm font-medium text-text-secondary">
            {label}
          </label>
        )}
        {children}
        {error && (
          <p className="text-xs text-red-500">{error}</p>
        )}
      </div>
    )
  }
)
FormField.displayName = "FormField"

export { Form, FormField, useForm, zodResolver }
export type { FormProps, FormFieldProps } 