'use client'

import type { ReactEventHandler } from 'react'
import { useState } from 'react'
import { useMutation } from '@tanstack/react-query'

import type { TUser, TZodError } from '@/src/types'
import { ErrorList, TextField } from '@/src/components'
import { signup } from '@/src/mutations'
import { APIError } from '@/src/utils'

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

  const signupMutation = useMutation({
    mutationFn: signup,
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
    <form
      className="flex flex-col gap-3 max-w-md"
      onSubmit={handleSubmit}
    >
      <TextField
        label="Email"
        type="email"
        onChange={(e) => setEmail(e.target.value)}
        value={email}
        error={!!fieldErrors.email}
        helperText={fieldErrors.email ? fieldErrors.email[0] : ''}
      />
      <TextField
        label="Password"
        type="password"
        onChange={(e) => setPassword(e.target.value)}
        value={password}
        error={!!fieldErrors.password}
        helperText={fieldErrors.password ? fieldErrors.password[0] : ''}
      />
      <ErrorList errors={formErrors} />
      <div>
        <button
          className="btn-fill"
          type="submit"
          disabled={signupMutation.isLoading}
        >
          {signupMutation.isLoading ? 'Loading...' : 'Create Account'}
        </button>
      </div>
    </form>
  )
}
