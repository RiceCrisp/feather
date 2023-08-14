'use client'

import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import { useState, type ReactEventHandler } from 'react'

import { getMe } from '@/src/queries'
import { Authorized, ErrorList, TextField } from '@/src/components'
import { TUser, TZodError } from '@/src/types'
import { updateUser } from '@/src/mutations'
import { APIError } from '@/src/utils'

export default function Dashboard(): JSX.Element {
  const me = useQuery({
    queryKey: ['me'],
    queryFn: getMe
  })

  const [firstName, setFirstName] = useState(me.data?.first_name ?? '')
  const [lastName, setLastName] = useState(me.data?.last_name ?? '')
  const [errors, setErrors] = useState<TZodError>()

  const { formErrors, fieldErrors = {} } = errors ?? {}

  const queryClient = useQueryClient()

  const updateUserMutation = useMutation({
    mutationFn: updateUser,
    onSuccess: (user) => {
      queryClient.setQueryData(['me'], (oldUser: TUser | undefined) => ({ ...oldUser, ...user }))
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
    updateUserMutation.mutate({
      id: String(me.data?.id),
      input: {
        first_name: firstName,
        last_name: lastName
      }
    })
  }

  return (
    <Authorized
      loggedOut="/login"
    >
      <>
        <h1>Account</h1>
        <form
          className="flex flex-col gap-3 max-w-md"
          onSubmit={handleSubmit}
        >
          <TextField
            label="First Name"
            type="text"
            onChange={(e) => setFirstName(e.target.value)}
            value={firstName}
            error={!!fieldErrors.firstName}
            helperText={fieldErrors.firstName ? fieldErrors.firstName[0] : ''}
          />
          <TextField
            label="Last Name"
            type="text"
            onChange={(e) => setLastName(e.target.value)}
            value={lastName}
            error={!!fieldErrors.lastName}
            helperText={fieldErrors.lastName ? fieldErrors.lastName[0] : ''}
          />
          <ErrorList errors={formErrors} />
          <div>
            <button
              className="btn-fill"
              type="submit"
              disabled={updateUserMutation.isLoading}
            >
              {updateUserMutation.isLoading ? 'Loading...' : 'Save'}
            </button>
          </div>
        </form>
      </>
    </Authorized>
  )
}
