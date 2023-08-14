import { Typography } from '@mui/material'
import { useEffect, useState } from 'react'
import { useMutation, useQueryClient } from 'react-query'
import { useNavigate } from 'react-router'

import { logout as logoutM } from '~/mutations'

export const logout = {
  path: '/logout',
  element: <Logout />
}

function Logout(): JSX.Element {
  const [error, setError] = useState(false)
  
  const navigate = useNavigate()

  const queryClient = useQueryClient()

  const logoutMutation = useMutation(logoutM, {
    onSuccess: (user) => {
      queryClient.setQueryData(['me'], undefined)
      navigate('/')
    },
    onError: () => {
      setError(true)
    }
  })

  useEffect(() => {
    logoutMutation.mutate()
  }, [])

  return (
    <Typography component="div" align="center">
      {error ? (
        <h1>Sorry something went wrong.</h1>
      ) : (
        <h1>Logging out...</h1>
      )}
    </Typography>
  )
}
