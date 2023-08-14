import { Container, Typography } from '@mui/material'
import { isRouteErrorResponse, useRouteError } from 'react-router-dom'

export function Error(): JSX.Element {
  const error = useRouteError()

  return (
    <Container
      sx={{
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'center',
        textAlign: 'center',
        height: '100vh'
      }}
    >
      <Typography component="div">
        <h1>Oops!</h1>
        <p>Sorry, an unexpected error has occurred.</p>
        <p>{isRouteErrorResponse(error) && <i>{error.statusText}</i>}</p>
      </Typography>
    </Container>
  )
}
