import { useState } from 'react'
import type { ReactEventHandler } from 'react'
import { Link as RouterLink } from 'react-router-dom'
import { Button, Stack, TextField } from '@mui/material'
import { useMutation, useQueryClient } from 'react-query'

import type { TUser, TZodError } from '~/types'
import { ErrorList } from '~/components'
import { login } from '~/mutations'
import { APIError } from '~/utils'

type TLoginFormProps = {
  onSuccess?: (user: TUser) => void
  onError?: (err: any, email: string) => void
}

export function LoginForm({
  onSuccess,
  onError
}: TLoginFormProps): JSX.Element {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [errors, setErrors] = useState<TZodError>()

  const { formErrors, fieldErrors = {} } = errors ?? {}

  const queryClient = useQueryClient()

  const loginMutation = useMutation(login, {
    onSuccess: (user) => {
      queryClient.setQueryData(['me'], user)
      onSuccess?.(user)
    },
    onError: (err) => {
      if (err instanceof APIError) {
        setErrors(err.getFormErrors())
      }
      onError?.(err, email)
    }
  })

  const handleSubmit: ReactEventHandler = (e) => {
    e.preventDefault()
    setErrors(undefined)
    loginMutation.mutate({
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
      <Stack direction="row">
        <Button
          type="submit"
          disabled={loginMutation.isLoading}
        >
          {loginMutation.isLoading ? 'Loading...' : 'Login'}
        </Button>
        <Button
          variant="text"
          sx={{
            ml: 2
          }}
          component={RouterLink}
          to="/forgot-password"
        >
          Forgot password?
        </Button>
      </Stack>
    </Stack>
  )
}
