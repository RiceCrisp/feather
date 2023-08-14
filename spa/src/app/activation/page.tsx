import Link from 'next/link'

import { ResendEmailButton } from '@/src/components'
import { activate } from '@/src/mutations'
import { TPageProps } from '@/src/types'

type TActivationProps = {
  email?: string
  token?: string
  success: boolean
}

type TActivateAccountArgs = {
  e?: string
  t?: string
}

async function activateAccount({ e: email = '', t: token = '' }: TActivateAccountArgs) {
  try {
    await activate({
      email: email,
      token: token
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
}


export default async function Activation({
  searchParams
}: TPageProps): Promise<JSX.Element> {
  const { email, success } = await activateAccount(searchParams)

  return (
    <div className="flex flex-col gap-3">
      <h1>Activation</h1>
      {success ? (
        <>
          <p>
            Your account is activated!
          </p>
          <div>
            <Link
              className="btn-fill"
              href="/login"
            >
              Login
            </Link>
          </div>
        </>
      ) : (
        <>
          <p>This link is expired or incorrect. Please request a new link.</p>
          <div>
            {email !== undefined && (
              <ResendEmailButton
                type="activate"
                email={email}
              />
            )}
          </div>
        </>
      )}
    </div>
  )
}
