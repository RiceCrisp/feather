import type { ReactEventHandler } from 'react'
import { useState } from 'react'
import { Alert, Button } from '@mui/material'
import { useMutation } from 'react-query'

import { sendEmail } from '~/mutations'

type TResendEmailButtonProps = {
  type: 'activate' | 'reset-password'
  email: string
  onSuccess?: () => void
  onError?: () => void
}

export function ResendEmailButton({
  type,
  email,
  onSuccess,
  onError
}: TResendEmailButtonProps): JSX.Element {
  const [sent, setSent] = useState(false)
  const [error, setError] = useState(false)

  const sendEmailMutation = useMutation(sendEmail, {
    onSuccess: () => {
      setSent(true)
      onSuccess?.()
    },
    onError: (err) => {
      console.log(err)
      setError(true)
      onError?.()
    }
  })

  const handleClick: ReactEventHandler = (e) => {
    e.preventDefault()
    setError(false)
    sendEmailMutation.mutate({
      type: type.toUpperCase().replace('-', '') as ('ACTIVATE' | 'RESETPASSWORD'),
      email
    })
  }

  return (
    <>
      {!sent ? (
        <Button
          onClick={handleClick}
          disabled={sendEmailMutation.isLoading}
        >
          {sendEmailMutation.isLoading ? 'Loading...' : 'Resend Email'}
        </Button>
      ) : (
        <Alert severity="success">
          Email sent! Check your inbox.
        </Alert>
      )}
      {error && (
        <Alert severity="error" sx={{ mt: 2 }}>
          Something has gone wrong. Please try again or contact support.
        </Alert>
      )}
    </>
  )
}
