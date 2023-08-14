import { Typography } from '@mui/material'

import { AppShell, Authorized, EditPostForm } from '~/components'

export const createPost = {
  path: '/create-post',
  element: <CreatePost />
}

function CreatePost(): JSX.Element {
  return (
    <Authorized
      loggedOut="/"
    >
      <AppShell>
        <Typography variant="h1" mb={2}>Create Post</Typography>
        <EditPostForm
          onSuccess={() => {
            console.log('success')
          }}
        />
      </AppShell>
    </Authorized>
  )
}
