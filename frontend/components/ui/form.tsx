import * as React from 'react';
import { useForm as useHookForm, type UseFormProps, type UseFormReturn } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import type { z } from 'zod';
import { cn } from '@/lib/utils';

// Types
type UseFormParams<T extends z.ZodType> = {
  schema: T;
  defaultValues?: UseFormProps<z.infer<T>>['defaultValues'];
  options?: Omit<UseFormProps<z.infer<T>>, 'resolver' | 'defaultValues'>;
};

// Hook
export function useForm<T extends z.ZodType>({
  schema,
  defaultValues,
  options,
}: UseFormParams<T>): UseFormReturn<z.infer<T>> {
  return useHookForm<z.infer<T>>({
    resolver: zodResolver(schema),
    defaultValues,
    mode: 'onChange',
    reValidateMode: 'onChange',
    shouldFocusError: true,
    ...options,
  });
}

// Form Component
interface FormProps extends React.FormHTMLAttributes<HTMLFormElement> {
  onSubmit: (e: React.FormEvent<HTMLFormElement>) => void | Promise<void>;
  preventDefault?: boolean;
}

export const Form = React.forwardRef<HTMLFormElement, FormProps>(
  ({ onSubmit, preventDefault = true, className, children, ...props }, ref) => {
    const [isSubmitting, setIsSubmitting] = React.useState(false);

    const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
      if (preventDefault) e.preventDefault();
      try {
        setIsSubmitting(true);
        await onSubmit(e);
      } finally {
        setIsSubmitting(false);
      }
    };

    return (
      <form
        ref={ref}
        onSubmit={handleSubmit}
        className={cn('space-y-6', className)}
        noValidate
        {...props}
      >
        {children}
      </form>
    );
  }
);

Form.displayName = 'Form';

// Form Field Component
interface FormFieldProps extends React.HTMLAttributes<HTMLDivElement> {
  label?: string;
  description?: string;
  error?: string;
  htmlFor?: string;
  required?: boolean;
}

export const FormField = React.forwardRef<HTMLDivElement, FormFieldProps>(
  ({ label, description, error, htmlFor, required, className, children, ...props }, ref) => {
    const id = React.useId();
    const fieldId = htmlFor || `field-${id}`;
    
    return (
      <div ref={ref} className={cn('space-y-2', className)} {...props}>
        {label && (
          <label
            htmlFor={fieldId}
            className="block text-sm font-medium text-foreground/80"
          >
            {label}
            {required && <span className="text-destructive ml-1">*</span>}
          </label>
        )}
        
        {description && (
          <p className="text-xs text-muted-foreground">{description}</p>
        )}
        
        <div className="relative">
          {React.Children.map(children, (child) => {
            if (React.isValidElement(child)) {
              const childProps: Record<string, unknown> = {};
              if (fieldId && !child.props.id) {
                childProps.id = fieldId;
              }
              if (error) {
                childProps['aria-invalid'] = true;
              }
              return React.cloneElement(child, childProps);
            }
            return child;
          })}
        </div>
        
        {error && (
          <p className="text-xs text-destructive mt-1" role="alert">
            {error}
          </p>
        )}
      </div>
    );
  }
);

FormField.displayName = 'FormField';

// Form Actions Component
interface FormActionsProps extends React.HTMLAttributes<HTMLDivElement> {
  align?: 'start' | 'center' | 'end' | 'between' | 'around' | 'evenly';
}

export const FormActions = React.forwardRef<HTMLDivElement, FormActionsProps>(
  ({ className, align = 'end', ...props }, ref) => {
    const alignment = {
      start: 'justify-start',
      center: 'justify-center',
      end: 'justify-end',
      between: 'justify-between',
      around: 'justify-around',
      evenly: 'justify-evenly',
    }[align] || 'justify-end';

    return (
      <div
        ref={ref}
        className={cn('flex items-center gap-4 pt-4', alignment, className)}
        {...props}
      />
    );
  }
);

FormActions.displayName = 'FormActions';

// Form Status Component
interface FormStatusProps extends React.HTMLAttributes<HTMLDivElement> {
  message?: React.ReactNode;
  icon?: React.ReactNode;
}

const FormStatus = React.forwardRef<HTMLDivElement, FormStatusProps>(
  ({ message, icon, className, ...props }, ref) => {
    if (!message) return null;
    
    return (
      <div
        ref={ref}
        className={cn('p-4 rounded-md text-sm flex items-start gap-3', className)}
        role="alert"
        {...props}
      >
        {icon && <div className="flex-shrink-0">{icon}</div>}
        <div>{message}</div>
      </div>
    );
  }
);

FormStatus.displayName = 'FormStatus';

// Form Error Component
export const FormError = React.forwardRef<HTMLDivElement, FormStatusProps>(
  ({ message, className, ...props }, ref) => {
    if (!message) return null;
    
    return (
      <FormStatus
        ref={ref}
        message={message}
        className={cn('bg-destructive/10 text-destructive', className)}
        {...props}
      />
    );
  }
);

FormError.displayName = 'FormError';

// Form Success Component
export const FormSuccess = React.forwardRef<HTMLDivElement, FormStatusProps>(
  ({ message, className, ...props }, ref) => {
    if (!message) return null;
    
    return (
      <FormStatus
        ref={ref}
        message={message}
        className={cn('bg-success/10 text-success', className)}
        {...props}
      />
    );
  }
);

FormSuccess.displayName = 'FormSuccess';
