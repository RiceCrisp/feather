import type { ReactEventHandler } from 'react'
import { useState } from 'react'
import { Alert, Button, Stack, TextField } from '@mui/material'

import type { TZodError } from '~/types'
import { ErrorList } from '~/components'
import { APIError } from '~/utils'
import { sendEmail } from '~/mutations'
import { useMutation } from 'react-query'

type TForgotPasswordFormProps = {
  onSuccess?: () => void
  onError?: () => void
}

export function ForgotPasswordForm({
  onSuccess,
  onError
}: TForgotPasswordFormProps): JSX.Element {
  const [email, setEmail] = useState('')
  const [errors, setErrors] = useState<TZodError>()
  const [sent, setSent] = useState(false)

  const { formErrors, fieldErrors = {} } = errors ?? {}

  const sendEmailMutation = useMutation({
    mutationFn: sendEmail,
    onSuccess: () => {
      setSent(true)
      onSuccess?.()
    },
    onError: (err) => {
      if (err instanceof APIError) {
        setErrors(err.getFormErrors())
      }
      onError?.()
    }
  })

  const handleSubmit: ReactEventHandler = (e) => {
    e.preventDefault()
    setErrors(undefined)
    sendEmailMutation.mutate({
      type: 'RESETPASSWORD',
      email
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
      <TextField
        label="Email"
        fullWidth
        size="small"
        onChange={(e) => setEmail(e.target.value)}
        value={email}
        error={!!fieldErrors.email}
        helperText={fieldErrors.email ? fieldErrors.email[0] : ''}
      />
      <ErrorList errors={formErrors} />
      {sent ? (
        <Alert severity="success">
          If an account exists with this email, then you should receive a reset
          password link in the next couple minutes.
        </Alert>
      ) : (
        <Button type="submit" disabled={sendEmailMutation.isLoading}>
          {sendEmailMutation.isLoading ? 'Loading...' : 'Send Password Reset Email'}
        </Button>
      )}
    </Stack>
  )
}
