'use client'

import type { ReactEventHandler } from 'react'
import { useState } from 'react'
import { useMutation } from '@tanstack/react-query'

import { sendEmail } from '@/src/mutations'
import { Alert } from '@/src/components'

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

  const sendEmailMutation = useMutation({
    mutationFn: sendEmail,
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
        <button
          className="btn-fill"
          onClick={handleClick}
          disabled={sendEmailMutation.isLoading}
        >
          {sendEmailMutation.isLoading ? 'Loading...' : 'Resend Email'}
        </button>
      ) : (
        <Alert severity="success">
          Email sent! Check your inbox.
        </Alert>
      )}
      {error && (
        <Alert severity="error">
          Something has gone wrong. Please try again or contact support.
        </Alert>
      )}
    </>
  )
}
