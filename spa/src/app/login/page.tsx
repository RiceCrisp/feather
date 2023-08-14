'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'

import { Authorized, LoginForm, ResendEmailButton } from '@/src/components'
import { APIError } from '@/src/utils'

export default function Login() {
  const [unactivatedEmail, setUnactivatedEmail] = useState('')
  const router = useRouter()

  return (
    <>
      {/* <Authorized
        loggedIn="/dashboard"
      > */}
        <div className="flex flex-col gap-3">
          <h1>Login</h1>
          {!unactivatedEmail ? (
            <LoginForm
              onSuccess={() => {
                router.push('/dashboard')
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
              <p>You need to activate your account.</p>
              <div>
                <ResendEmailButton
                  type="activate"
                  email={unactivatedEmail}
                />
              </div>
            </>
          )}
        </div>
      {/* </Authorized> */}
    </>
  )
}
