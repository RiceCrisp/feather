import { Typography } from '@mui/material'
import { Stack } from '@mui/system'
import { AppShell, ForgotPasswordForm } from '~/components'

export const forgotPassword = {
  path: '/forgot-password',
  element: <ForgotPassword />
}

export function ForgotPassword(): JSX.Element {
  return (
    <AppShell>
      <Stack
        spacing={2}
        alignItems="flex-start"
      >
        <Typography variant="h1">Forgot Password</Typography>
        <ForgotPasswordForm />
      </Stack>
    </AppShell>
  )
}
