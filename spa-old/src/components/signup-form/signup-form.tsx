import { Button, Stack, TextField } from '@mui/material'
import type { ReactEventHandler } from 'react'
import { useState } from 'react'
import { useMutation } from 'react-query'

import type { TUser, TZodError } from '~/types'
import { ErrorList } from '~/components'
import { signup } from '~/mutations'
import { APIError } from '~/utils'

type TSignupFormProps = {
  onSuccess?: (user: TUser) => void
  onError?: (err: any) => void
}

export function SignupForm({
  onSuccess,
  onError
}: TSignupFormProps): JSX.Element {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [errors, setErrors] = useState<TZodError>()

  const { formErrors, fieldErrors = {} } = errors ?? {}

  const signupMutation = useMutation(signup, {
    onSuccess: (user) => {
      onSuccess?.(user)
    },
    onError: (err) => {
      if (err instanceof APIError) {
        setErrors(err.getFormErrors())
      }
      onError?.(err)
    }
  })

  const handleSubmit: ReactEventHandler = (e) => {
    e.preventDefault()
    setErrors(undefined)
    signupMutation.mutate({
      email,
      password
    })
  }

  return(
    <Stack
      spacing={2}
      alignItems="flex-start"
      component="form"
      maxWidth={300}
      onSubmit={handleSubmit}
    >
      <TextField
        label="Email"
        type="email"
        fullWidth
        size="small"
        onChange={(e) => setEmail(e.target.value)}
        value={email}
        error={!!fieldErrors.email}
        helperText={fieldErrors.email ? fieldErrors.email[0] : ''}
      />
      <TextField
        label="Password"
        type="password"
        fullWidth
        size="small"
        onChange={(e) => setPassword(e.target.value)}
        value={password}
        error={!!fieldErrors.password}
        helperText={fieldErrors.password ? fieldErrors.password[0] : ''}
      />
      <ErrorList errors={formErrors} />
      <Button
        type="submit"
        disabled={signupMutation.isLoading}
      >
        {signupMutation.isLoading ? 'Loading...' : 'Create Account'}
      </Button>
    </Stack>
  )
}
