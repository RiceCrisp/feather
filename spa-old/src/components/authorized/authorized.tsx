import { useEffect, useState } from 'react'
import { useQuery } from 'react-query'
import { useNavigate } from 'react-router-dom'
import { getMe } from '~/queries'

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
  const navigate = useNavigate()

  const { data } = useQuery(['me'], getMe)

  useEffect(() => {
    if (data) {
      if (typeof loggedIn === 'string') {
        navigate(loggedIn)
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
        navigate(loggedOut)
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
