import { Typography } from '@mui/material'
import { Stack } from '@mui/system'
import { useState } from 'react'
import { useNavigate } from 'react-router'

import { AppShell, Authorized, LoginForm, ResendEmailButton } from '~/components'
import { APIError } from '~/utils'

export const login = {
  path: '/login',
  element: <Login />
}

function Login(): JSX.Element {
  const navigate = useNavigate()
  const [unactivatedEmail, setUnactivatedEmail] = useState('')

  return (
    <Authorized
      loggedIn="/dashboard"
    >
      <AppShell>
        <Stack
          spacing={2}
          alignItems="flex-start"
        >
          <Typography variant="h1">Login</Typography>
          {!unactivatedEmail ? (
            <LoginForm
              onSuccess={() => {
                navigate('/dashboard')
              }}
              onError={(err, email) => {
                if (err instanceof APIError) {
                  const code = err.getCode()
                  if (code === 'INACTIVE_USER') {
                    setUnactivatedEmail(email)
                  }
                }
              }}
            />
          ) : (
            <>
              <Typography>You need to activate your account.</Typography>
              <ResendEmailButton
                type="activate"
                email={unactivatedEmail}
              />
            </>
          )}
        </Stack>
      </AppShell>
    </Authorized>
  )
}
