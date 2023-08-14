import { useLoaderData } from 'react-router'
import type { LoaderFunction } from 'react-router'

import { AppShell, ResendEmailButton, ResetPasswordForm } from '~/components'
import { apiRequest } from '~/utils'
import { Button, Stack, Typography } from '@mui/material'
import { verifyToken } from '~/mutations'

type TResetPasswordParams = {
  email?: string
  token?: string
  success: boolean
}

export const resetPassword = {
  path: '/reset-password/',
  loader: (async ({ request }) => {
    const url = new URL(request.url)
    const email = url.searchParams.get('e')
    const token = url.searchParams.get('t')

    try {
      await verifyToken({
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
  element: <ResetPassword />
}

export function ResetPassword(): JSX.Element {
  const { email, token, success } = useLoaderData() as TResetPasswordParams

  return (
    <AppShell>
      <Stack
        spacing={2}
        alignItems="flex-start"
      >
        <Typography variant="h1">Reset Password</Typography>
        {success && email !== undefined && token !== undefined ? (
          <ResetPasswordForm
            email={email}
            token={token}
          />
        ) : (
          <>
            <Typography>This link is expired or incorrect. Please request a new link.</Typography>
            {email !== undefined && (
              <ResendEmailButton
                type="reset-password"
                email={email}
              />
            )}
          </>
        )}
      </Stack>
    </AppShell>
  )
}
