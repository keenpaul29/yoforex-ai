import { useState, useCallback, useMemo } from 'react'
import { z } from 'zod'

interface FormField<T = any> {
  value: T
  error: string | null
  touched: boolean
  dirty: boolean
}

interface FormState<T extends Record<string, any>> {
  fields: { [K in keyof T]: FormField<T[K]> }
  isValid: boolean
  isSubmitting: boolean
  submitCount: number
  errors: Partial<Record<keyof T, string>>
}

interface UseFormOptions<T extends Record<string, any>> {
  initialValues: T
  validationSchema?: z.ZodSchema<T>
  validateOnChange?: boolean
  validateOnBlur?: boolean
  onSubmit?: (values: T) => Promise<void> | void
}

export function useForm<T extends Record<string, any>>({
  initialValues,
  validationSchema,
  validateOnChange = true,
  validateOnBlur = true,
  onSubmit,
}: UseFormOptions<T>) {
  const [state, setState] = useState<FormState<T>>(() => {
    const fields = {} as { [K in keyof T]: FormField<T[K]> }
    
    for (const key in initialValues) {
      fields[key] = {
        value: initialValues[key],
        error: null,
        touched: false,
        dirty: false,
      }
    }

    return {
      fields,
      isValid: true,
      isSubmitting: false,
      submitCount: 0,
      errors: {},
    }
  })

  const validateField = useCallback(
    (name: keyof T, value: T[keyof T]): string | null => {
      if (!validationSchema) return null

      try {
        const fieldSchema = validationSchema.shape[name as string]
        if (fieldSchema) {
          fieldSchema.parse(value)
        }
        return null
      } catch (error) {
        if (error instanceof z.ZodError) {
          return error.errors[0]?.message || 'Invalid value'
        }
        return 'Validation error'
      }
    },
    [validationSchema]
  )

  const validateForm = useCallback(
    (values: T): Partial<Record<keyof T, string>> => {
      if (!validationSchema) return {}

      try {
        validationSchema.parse(values)
        return {}
      } catch (error) {
        if (error instanceof z.ZodError) {
          const errors: Partial<Record<keyof T, string>> = {}
          error.errors.forEach((err) => {
            if (err.path.length > 0) {
              const field = err.path[0] as keyof T
              errors[field] = err.message
            }
          })
          return errors
        }
        return {}
      }
    },
    [validationSchema]
  )

  const values = useMemo(() => {
    const result = {} as T
    for (const key in state.fields) {
      result[key] = state.fields[key].value
    }
    return result
  }, [state.fields])

  const errors = useMemo(() => {
    const result: Partial<Record<keyof T, string>> = {}
    for (const key in state.fields) {
      if (state.fields[key].error) {
        result[key] = state.fields[key].error
      }
    }
    return result
  }, [state.fields])

  const isValid = useMemo(() => {
    return Object.values(state.fields).every(field => !field.error)
  }, [state.fields])

  const isDirty = useMemo(() => {
    return Object.values(state.fields).some(field => field.dirty)
  }, [state.fields])

  const setValue = useCallback(
    (name: keyof T, value: T[keyof T], shouldValidate = validateOnChange) => {
      setState(prev => {
        const field = prev.fields[name]
        const error = shouldValidate ? validateField(name, value) : field.error

        return {
          ...prev,
          fields: {
            ...prev.fields,
            [name]: {
              ...field,
              value,
              error,
              dirty: value !== initialValues[name],
            },
          },
        }
      })
    },
    [validateField, validateOnChange, initialValues]
  )

  const setError = useCallback((name: keyof T, error: string | null) => {
    setState(prev => ({
      ...prev,
      fields: {
        ...prev.fields,
        [name]: {
          ...prev.fields[name],
          error,
        },
      },
    }))
  }, [])

  const setTouched = useCallback((name: keyof T, touched = true) => {
    setState(prev => ({
      ...prev,
      fields: {
        ...prev.fields,
        [name]: {
          ...prev.fields[name],
          touched,
        },
      },
    }))
  }, [])

  const handleBlur = useCallback(
    (name: keyof T) => {
      setTouched(name, true)
      
      if (validateOnBlur) {
        const field = state.fields[name]
        const error = validateField(name, field.value)
        setError(name, error)
      }
    },
    [state.fields, validateField, validateOnBlur, setTouched, setError]
  )

  const reset = useCallback((newValues?: Partial<T>) => {
    const resetValues = { ...initialValues, ...newValues }
    const fields = {} as { [K in keyof T]: FormField<T[K]> }
    
    for (const key in resetValues) {
      fields[key] = {
        value: resetValues[key],
        error: null,
        touched: false,
        dirty: false,
      }
    }

    setState({
      fields,
      isValid: true,
      isSubmitting: false,
      submitCount: 0,
      errors: {},
    })
  }, [initialValues])

  const handleSubmit = useCallback(
    async (e?: React.FormEvent) => {
      if (e) {
        e.preventDefault()
      }

      setState(prev => ({ ...prev, isSubmitting: true, submitCount: prev.submitCount + 1 }))

      // Mark all fields as touched
      setState(prev => {
        const fields = { ...prev.fields }
        for (const key in fields) {
          fields[key] = { ...fields[key], touched: true }
        }
        return { ...prev, fields }
      })

      // Validate entire form
      const formErrors = validateForm(values)
      
      if (Object.keys(formErrors).length > 0) {
        setState(prev => {
          const fields = { ...prev.fields }
          for (const key in formErrors) {
            if (fields[key]) {
              fields[key] = { ...fields[key], error: formErrors[key] || null }
            }
          }
          return { ...prev, fields, isSubmitting: false }
        })
        return
      }

      try {
        if (onSubmit) {
          await onSubmit(values)
        }
      } catch (error) {
        console.error('Form submission error:', error)
      } finally {
        setState(prev => ({ ...prev, isSubmitting: false }))
      }
    },
    [values, validateForm, onSubmit]
  )

  const getFieldProps = useCallback(
    (name: keyof T) => ({
      value: state.fields[name]?.value ?? '',
      onChange: (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) =>
        setValue(name, e.target.value as T[keyof T]),
      onBlur: () => handleBlur(name),
      error: state.fields[name]?.touched ? state.fields[name]?.error : null,
    }),
    [state.fields, setValue, handleBlur]
  )

  return {
    values,
    errors,
    isValid,
    isDirty,
    isSubmitting: state.isSubmitting,
    submitCount: state.submitCount,
    setValue,
    setError,
    setTouched,
    reset,
    handleSubmit,
    getFieldProps,
  }
}
