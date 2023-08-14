import { Typography } from '@mui/material'
import { Stack } from '@mui/system'

import { AppShell } from '~/components'

export const home = {
  path: '/',
  element: <Home />
}

function Home(): JSX.Element {

  return (
    <AppShell>
      <Stack
        spacing={2}
        alignItems="flex-start"
      >
        <Typography variant="h1">Home</Typography>
        <ul>
          {/* {data?.getUsers.map((contact) => {
            return (
              <li key={String(contact.id)}>
                Name: {contact.first_name} {contact.last_name}
                <br />
                Email: {contact.email}
                <br />
                Phone: {contact.phone}
                <br />
                <button onClick={(e) => {
                  e.preventDefault()
                }}>
                  Delete
                </button>
              </li>
            )
          })} */}
        </ul>
      </Stack>
    </AppShell>
  )
}
