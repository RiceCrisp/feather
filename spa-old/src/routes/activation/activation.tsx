import { Link as RouterLink, useLoaderData } from 'react-router-dom'
import type { LoaderFunction } from 'react-router-dom'
import { Button, Typography } from '@mui/material'
import { Stack } from '@mui/system'

import { AppShell, ResendEmailButton } from '~/components'
import { activate } from '~/mutations'

type TActivationParams = {
  email?: string
  token?: string
  success: boolean
}

export const activation = {
  path: '/activation',
  loader: (async ({ request }) => {
    const url = new URL(request.url)
    const email = url.searchParams.get('e')
    const token = url.searchParams.get('t')

    try {
      await activate({
        email: email ?? '',
        token: token ?? ''
      })
      return {
        email,
        token,
        success: true
      }
    } catch (err) {
      return {
        email,
        token,
        success: false
      }
    }
  }) as LoaderFunction,
  element: <Activation />
}

function Activation(): JSX.Element {
  const { email, success } = useLoaderData() as TActivationParams

  return (
    <AppShell>
      <Stack
        spacing={2}
        alignItems="flex-start"
      >
        <Typography variant="h1">Activation</Typography>
        {success ? (
          <>
            <Typography>
              Your account is activated!
            </Typography>
            <Button
              component={RouterLink}
              to="/login"
            >
              Login
            </Button>
          </>
        ) : (
          <>
            <Typography>This link is expired or incorrect. Please request a new link.</Typography>
            {email !== undefined && (
              <ResendEmailButton
                type="activate"
                email={email}
              />
            )}
          </>
        )}
      </Stack>
    </AppShell>
  )
}
