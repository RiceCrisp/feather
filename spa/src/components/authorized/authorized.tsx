'use client'

import { useRouter } from 'next/navigation'
import { useEffect, useState } from 'react'
import { useQuery } from '@tanstack/react-query'

import { getMe } from '@/src/queries'

type TAuthorizedProps = {
  loggedIn?: string | (() => void)
  loggedOut?: string | (() => void)
  children: JSX.Element
}

export function Authorized({
  loggedIn,
  loggedOut,
  children
}: TAuthorizedProps): JSX.Element {
  const [show, setShow] = useState(false)
  const router = useRouter()

  const { data } = useQuery({
    queryKey: ['me'],
    queryFn: getMe
  })

  useEffect(() => {
    if (data) {
      if (typeof loggedIn === 'string') {
        router.push(loggedIn)
      }
      else if (typeof loggedIn === 'function') {
        loggedIn()
      }
      else {
        setShow(true)
      }
    }
    else if (data === null) {
      if (typeof loggedOut === 'string') {
        router.push(loggedOut)
      }
      else if (typeof loggedOut === 'function') {
        loggedOut()
      }
      else {
        setShow(true)
      }
    }
  }, [data])

  return show ? children : <></>
}
