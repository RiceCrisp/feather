'use client'

import { useState } from 'react'

import { SignupForm } from '@/src/components'

export default function Login() {
  const [success, setSuccess] = useState(false)

  return (
    <>
      <div className="flex flex-col gap-3">
        <h1>Sign Up</h1>
        {!success ? (
          <SignupForm
            onSuccess={() => {
              setSuccess(true)
            }}
          />
        ) : (
          <p>
            Your account has been created! Check your email for an activation
            link, and then you&apos;re ready to go.
          </p>
        )}
      </div>
    </>
  )
}
