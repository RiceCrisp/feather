import React from 'react'
import ReactDOM from 'react-dom/client'
import { createBrowserRouter, RouterProvider } from 'react-router-dom'
import { ThemeProvider } from '@mui/material'
import { QueryClient, QueryClientProvider, useQuery } from 'react-query'

import { Error } from '~/routes/error'
import routes from '~/routes'
import { theme } from '~/theme'
import '~/index.css'
import { getMe } from '~/queries'

const router = createBrowserRouter([
  ...routes.map((r) => {
    r.errorElement = <Error />
    return r
  })
])

type TReadyProps = Required<React.PropsWithChildren>

const queryClient = new QueryClient({
  defaultOptions: { queries: { staleTime: 10000 }}
})

function Ready({ children }: TReadyProps): JSX.Element {
  const me = useQuery(['me'], getMe)

  return (
    <>
      {me.isSuccess ? children : null}
    </>
  )
}

const root = document.getElementById('root')
if (root !== null) {
  ReactDOM.createRoot(root).render(
    <React.StrictMode>
      <QueryClientProvider client={queryClient}>
        <ThemeProvider theme={theme}>
          <Ready>
            <RouterProvider router={router} />
          </Ready>
        </ThemeProvider>
      </QueryClientProvider>
    </React.StrictMode>
  )
}
