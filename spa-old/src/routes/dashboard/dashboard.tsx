import { Button, Card, CardContent, IconButton, Stack, Typography } from '@mui/material'
import { IconEdit } from '@tabler/icons'
import { useQuery } from 'react-query'
import { Link as RouterLink } from 'react-router-dom'

import { AppShell, Authorized } from '~/components'
import { getMe, getPosts } from '~/queries'

export const dashboard = {
  path: '/dashboard',
  element: <Dashboard />
}

function Dashboard(): JSX.Element {
  const me = useQuery(['me'], getMe)
  const myPosts = useQuery(['myPosts'], async () => {
    return await getPosts({ owner_id: me.data?.id })
  })

  return (
    <Authorized
      loggedOut="/"
    >
      <AppShell>
        <Typography variant="h1" mb={2}>Dashboard</Typography>
        <Button
          component={RouterLink}
          to="/create-post/"
        >
          Create Post
        </Button>
        <Stack
          spacing={2}
        >
          {myPosts.data?.map((post) => {
            return (
              <Card key={post.id}>
                <CardContent>
                  <Typography component="h2" variant="h3" mb={2}>
                    {post.title}
                  </Typography>
                  <Typography>
                    {post.content}
                  </Typography>
                  <IconButton
                    component={RouterLink}
                    to={`/edit-post/${post.id}`}
                  >
                    <IconEdit />
                  </IconButton>
                </CardContent>
              </Card>
            )
          })}
        </Stack>
      </AppShell>
    </Authorized>
  )
}
