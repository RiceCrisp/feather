import { useState } from 'react'
import type { ReactEventHandler } from 'react'
import { Link as RouterLink } from 'react-router-dom'
import { Button, Stack, TextField } from '@mui/material'
import { useMutation, useQueryClient } from 'react-query'

import type { TPost, TUser, TZodError } from '~/types'
import { ErrorList } from '~/components'
import { createPost } from '~/mutations'
import { APIError } from '~/utils'

type TEditPostFormProps = {
  post?: TPost
  onSuccess?: (user: TUser) => void
  onError?: (err: any, email: string) => void
}

export function EditPostForm({
  post,
  onSuccess,
  onError
}: TEditPostFormProps): JSX.Element {
  const [title, setTitle] = useState(post?.title ?? '')
  const [content, setContent] = useState(post?.content ?? '')
  const [errors, setErrors] = useState<TZodError>()

  const { formErrors, fieldErrors = {} } = errors ?? {}

  const createPostMutation = useMutation(createPost, {
    onSuccess: (user) => {
      // queryClient.setQueryData(['me'], (oldUser: TUser | undefined) => ({ ...oldUser, ...user }))
    },
    onError: (err) => {
      if (err instanceof APIError) {
        setErrors(err.getFormErrors())
      }
    }
  })

  const handleSubmit: ReactEventHandler = (e) => {
    e.preventDefault()
    setErrors(undefined)
    createPostMutation.mutate({
      title,
      content
    })
  }

  return(
    <Stack
      spacing={2}
      alignItems="flex-start"
      component="form"
      maxWidth={600}
      onSubmit={handleSubmit}
    >
      <TextField
        label="Title"
        type="text"
        fullWidth
        size="small"
        onChange={(e) => setTitle(e.target.value)}
        value={title}
        error={!!fieldErrors.title}
        helperText={fieldErrors.title ? fieldErrors.title[0] : ''}
      />
      <TextField
        label="Content"
        type="text"
        multiline
        rows={4}
        fullWidth
        size="small"
        onChange={(e) => setContent(e.target.value)}
        value={content}
        error={!!fieldErrors.content}
        helperText={fieldErrors.content ? fieldErrors.content[0] : ''}
      />
      <ErrorList errors={formErrors} />
      <Button
        type="submit"
        disabled={createPostMutation.isLoading}
      >
        {createPostMutation.isLoading ? 'Loading...' : 'Create Post'}
      </Button>
    </Stack>
  )
}
