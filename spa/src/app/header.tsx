'use client'

import { useEffect, useState } from 'react'
import Link from 'next/link'
// import { IconFeather } from '@tabler/icons-react'
import { useQuery } from '@tanstack/react-query'

import { getMe } from '@/src/queries'
import { Fade, Menu } from '@/src/components'

export default function Header() {
  const me = useQuery({
    queryKey: ['me'],
    queryFn: getMe
  })
  const [open, setOpen] = useState(false)

  return (
    <header className="col-span-2 shadow-sm flex items-center justify-between px-layout">
      <Link
        className="text-2xl flex items-center"
        href="/"
      >
        <span>Feather</span>
        {/* <IconFeather /> */}
      </Link>
      <div className="flex gap-3">
        {me.data ? (
          <div className="block relative">
            <button
              className="w-10 h-10 rounded-full bg-slate-100"
              onClick={(e) => {
                setOpen((a) => !a)
              }}
            ></button>
            <Fade show={open} className="origin-top-right">
              <ul id="dropdown" className="absolute bg-white right-0 shadow-md rounded-md flex flex-col items-stretch py-2 z-0">
                <li>
                  <Link
                    className="block px-5 py-1 hover:bg-blue-100 transition-all"
                    href="/account"
                  >
                    Account
                  </Link>
                </li>
                <li>
                  <Link
                    className="block px-5 py-1 hover:bg-blue-100 transition-all"
                    href="/logout"
                  >
                    Logout
                  </Link>
                </li>
              </ul>
            </Fade>
          </div>
        ) : (
          <>
            <Link
              className="btn-fill"
              href="/signup"
            >
              Sign Up
            </Link>
            <Link
              className="btn-outline"
              href="/login"
            >
              Log In
            </Link>
          </>
        )}
      </div>
    </header>
  )
}
