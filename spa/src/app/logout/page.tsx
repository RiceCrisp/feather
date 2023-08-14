'use client'

import { Typography } from '@mui/material'
import { useEffect, useState } from 'react'
import { useMutation, useQueryClient } from '@tanstack/react-query'
import { useRouter } from 'next/navigation'

import { logout as logoutM } from '@/src/mutations'

export default function Logout(): JSX.Element {
  const [error, setError] = useState(false)
  
  const router = useRouter()

  const queryClient = useQueryClient()

  const logoutMutation = useMutation({
    mutationFn: logoutM,
    onSuccess: (user) => {
      queryClient.setQueryData(['me'], undefined)
      router.push('/')
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
