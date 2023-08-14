import { Typography } from '@mui/material'
import { useQuery } from 'react-query'
import { useParams } from 'react-router'

import { AppShell, Authorized, EditPostForm, Loader } from '~/components'
import { getPost } from '~/queries'

export const editPost = {
  path: '/edit-post/:id',
  element: <EditPost />
}

function EditPost(): JSX.Element {
  const { id } = useParams()

  const post = useQuery(['post', id], async () => {
    return await getPost(Number(id))
  })

  console.log('post: ', post)
  if (post.isSuccess && post.data === null) {
    throw new Error('bad')
  }

  return (
    <Authorized
      loggedOut="/"
    >
      <AppShell>
        {post.isLoading && (
          <Loader />
        )}
        {post.isSuccess && post.data !== null && (
          <>
            <Typography variant="h1" mb={2}>Edit Post</Typography>
            <EditPostForm
              post={post.data}
              onSuccess={() => {
                console.log('success')
              }}
            />
          </>
        )}
      </AppShell>
    </Authorized>
  )
}
