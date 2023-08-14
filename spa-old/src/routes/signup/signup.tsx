import { Stack, Typography } from '@mui/material'
import { useState } from 'react'
import { AppShell, SignupForm } from '~/components'

export const signup = {
  path: '/signup',
  element: <Signup />
}

function Signup(): JSX.Element {
  const [success, setSuccess] = useState(false)

  return (
    <AppShell>
      <Stack
        spacing={2}
        alignItems="flex-start"
      >
        <Typography variant="h1">Sign Up</Typography>
        {!success ? (
          <SignupForm
            onSuccess={() => {
              setSuccess(true)
            }}
          />
        ) : (
          <Typography>
            Your account has been created! Check your email for an activation
            link, and then you&apos;re ready to go.
          </Typography>
        )}
      </Stack>
    </AppShell>
  )
}
