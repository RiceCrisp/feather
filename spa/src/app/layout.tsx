import './globals.css'
import type { Metadata } from 'next'
import Link from 'next/link'
import { Hydrate, dehydrate } from '@tanstack/react-query'
// import Providers from './providers'

import Header from './header'
import getQueryClient from './getQueryClient'
import { getMe } from '@/src/queries'
import Providers from './providers'

export const metadata: Metadata = {
  title: 'Feather',
  description: 'My stupid little app',
}

type TRootLayoutProps = {
  children: React.ReactNode
}

export default async function RootLayout({
  children
}: TRootLayoutProps) {
  const queryClient = getQueryClient()
  await queryClient.prefetchQuery({
    queryKey: ['me'],
    queryFn: getMe
  })
  const dehydratedState = dehydrate(queryClient)

  return (
    <html lang="en">
      <head>
        <link
          rel="icon"
          href="/icon?<generated>"
          type="image/<generated>"
          sizes="<generated>"
        />
      </head>
      <body className="text-slate-900">
        <Providers>
          <Hydrate state={dehydratedState}>
            <div className="h-screen grid grid-cols-layout grid-rows-layout">
              <Header />
              <aside className="p-layout bg-slate-100">
                <div>
                  <Link href="/dashboard">
                    Dashboard
                  </Link>
                </div>
              </aside>
              <main className="p-layout">
                {children}
              </main>
            </div>
          </Hydrate>
        </Providers>
      </body>
    </html>
  )
}
