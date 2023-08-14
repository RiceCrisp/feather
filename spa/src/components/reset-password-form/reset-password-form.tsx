import type { ReactEventHandler } from 'react'
import { useState } from 'react'
import { Alert, Button, TextField } from '@mui/material'
import { z } from 'zod'
import { Link as RouterLink } from 'react-router-dom'
import { Stack } from '@mui/system'
import { useMutation } from '@tanstack/react-query'

import type { TZodError } from '@/src/types'
import { ErrorList } from '@/src/components'
import { APIError } from '@/src/utils'
import { resetPassword, sendEmail, updatePassword } from '@/src/mutations'

type TResetPasswordFormProps = {
  email: string
  token: string
  onSuccess?: () => void
  onError?: () => void
}

export function ResetPasswordForm({
  email,
  token,
  onSuccess,
  onError
}: TResetPasswordFormProps): JSX.Element {
  const [password, setPassword] = useState('')
  const [errors, setErrors] = useState<TZodError>()
  const [success, setSuccess] = useState(false)

  const { formErrors, fieldErrors = {} } = errors ?? {}

  const resetPasswordMutation = useMutation({
    mutationFn: updatePassword,
    onSuccess: () => {
      setSuccess(true)
    },
    onError: (err) => {
      if (err instanceof APIError) {
        setErrors(err.getFormErrors())
      }
    }
  })

  const handleSubmit: ReactEventHandler = (e) => {
    e.preventDefault()
    setErrors(undefined)
    resetPasswordMutation.mutate({
      email,
      token,
      password
    })
  }

  return (
    <Stack
      spacing={2}
      alignItems="flex-start"
      component="form"
      maxWidth={300}
      onSubmit={handleSubmit}
    >
      {!success ? (
        <>
          <TextField
            label="New Password"
            type="password"
            fullWidth
            onChange={(e) => setPassword(e.target.value)}
            value={password}
            error={!!fieldErrors.password}
            helperText={fieldErrors.password ? fieldErrors.password[0] : ''}
          />
          <ErrorList errors={formErrors} />
          <Button type="submit" disabled={resetPasswordMutation.isLoading}>
            {resetPasswordMutation.isLoading ? 'Loading...' : 'Update Password'}
          </Button>
        </>  
      ) : (
        <Alert severity="success">
          Your password has been updated. Please{' '}
          <RouterLink to="/login">login</RouterLink> with your new credentials.
        </Alert>
      )}
    </Stack>
  )
}
