'use client'

// import { IconEdit } from '@tabler/icons-react'
import { useQuery } from '@tanstack/react-query'
import Link from 'next/link'

import { getMe, getPosts } from '@/src/queries'
import { Authorized } from '@/src/components'

export default function Dashboard(): JSX.Element {
  const me = useQuery({
    queryKey: ['me'],
    queryFn: getMe
  })
  const myPosts = useQuery({
    queryKey: ['myPosts'],
    queryFn: async () => {
      return await getPosts({ owner_id: me.data?.id })
    }
  })

  return (
    <Authorized
      loggedOut="/login"
    >
      <>
        <h1>Dashboard</h1>
        <Link
          className="btn-fill"
          href="/create-post/"
        >
          Create Post
        </Link>
        <div className="flex flex-col gap-3">
          {myPosts.data?.map((post) => {
            return (
              <div className="rounded-md shadow-md p-4 flex-col gap-3" key={post.id}>
                <h2 className="text-lg">{post.title}</h2>
                <div>
                  {post.content}
                </div>
                <Link
                  className="btn-fill"
                  href={`/edit-post/${post.id}`}
                >
                  Edit
                </Link>
              </div>
            )
          })}
        </div>
      </>
    </Authorized>
  )
}
