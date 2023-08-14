import { useState } from 'react'
import type { ReactEventHandler } from 'react'
import { Button, TextField, Typography } from '@mui/material'
import { Stack } from '@mui/system'
import { useMutation, useQuery, useQueryClient } from 'react-query'

import { AppShell, Authorized, ErrorList } from '~/components'
import { getMe } from '~/queries'
import type { TUser, TZodError } from '~/types'
import { updateUser } from '~/mutations'
import { APIError } from '~/utils'

export const account = {
  path: '/account',
  element: <Account />
}

function Account(): JSX.Element {
  const me = useQuery(['me'], getMe)

  const [firstName, setFirstName] = useState(me.data?.first_name ?? '')
  const [lastName, setLastName] = useState(me.data?.last_name ?? '')
  const [errors, setErrors] = useState<TZodError>()

  const { formErrors, fieldErrors = {} } = errors ?? {}

  const queryClient = useQueryClient()

  const updateUserMutation = useMutation(updateUser, {
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
      <AppShell>
        <Typography variant="h1" mb={2}>Account</Typography>
        <Stack
          spacing={2}
          alignItems="flex-start"
          component="form"
          maxWidth={300}
          onSubmit={handleSubmit}
        >
          <TextField
            label="First Name"
            type="text"
            fullWidth
            size="small"
            onChange={(e) => setFirstName(e.target.value)}
            value={firstName}
            error={!!fieldErrors.firstName}
            helperText={fieldErrors.firstName ? fieldErrors.firstName[0] : ''}
          />
          <TextField
            label="Last Name"
            type="text"
            fullWidth
            size="small"
            onChange={(e) => setLastName(e.target.value)}
            value={lastName}
            error={!!fieldErrors.lastName}
            helperText={fieldErrors.lastName ? fieldErrors.lastName[0] : ''}
          />
          <ErrorList errors={formErrors} />
          <Button
            type="submit"
            disabled={updateUserMutation.isLoading}
          >
            {updateUserMutation.isLoading ? 'Loading...' : 'Save'}
          </Button>
        </Stack>
      </AppShell>
    </Authorized>
  )
}
