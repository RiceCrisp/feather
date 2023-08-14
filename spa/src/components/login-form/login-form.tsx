'use client'

import { useState } from 'react'
import type { ReactEventHandler } from 'react'
import { useMutation, useQueryClient } from '@tanstack/react-query'
import Link from 'next/link'

import type { TUser, TZodError } from '@/src/types'
import { TextField, ErrorList } from '@/src/components'
import { login } from '@/src/mutations'
import { APIError } from '@/src/utils'

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

  const loginMutation = useMutation({
    mutationFn: login,
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
      <div className="flex gap-3">
        <button
          className="btn-fill"
          type="submit"
          disabled={loginMutation.isLoading}
        >
          {loginMutation.isLoading ? 'Loading...' : 'Login'}
        </button>
        <Link
          className="btn-text"
          href="/forgot-password"
        >
          Forgot password?
        </Link>
      </div>
    </form>
  )
}
