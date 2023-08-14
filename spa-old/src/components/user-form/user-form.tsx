import type { ReactEventHandler } from 'react'
import { useState } from 'react'

import { apiRequest } from '~/utils'

type TUserFormProps = {
  onSubmit: any
}

export function UserForm({
  onSubmit
}: TUserFormProps): JSX.Element {
  const [firstName, setFirstName] = useState('')
  const [lastName, setLastName] = useState('')
  const [email, setEmail] = useState('')
  const [phone, setPhone] = useState('')

  const handleSubmit: ReactEventHandler = (e) => {
    e.preventDefault()
    ;void (async () => {
      const res = await apiRequest('/contacts', {
        method: 'POST',
        headers: {
          "Content-Type": 'application/json'
        },
        body: JSON.stringify({
          firstName,
          lastName,
          email,
          phone
        })
      })
      if (res.statusCode === 201) {
        onSubmit(res.body)
      }
    })()
  }

  return(
    <form onSubmit={handleSubmit}>
      <label>First Name</label>
      <input
        type="text"
        onChange={(e) => setFirstName(e.target.value)}
        value={firstName}
      />
      <label>Last Name</label>
      <input
        type="text"
        onChange={(e) => setLastName(e.target.value)}
        value={lastName}
      />
      <label>Email</label>
      <input
        type="text"
        onChange={(e) => setEmail(e.target.value)}
        value={email}
      />
      <label>Phone</label>
      <input
        type="text"
        onChange={(e) => setPhone(e.target.value)}
        value={phone}
      />
      <button type="submit">
        Submit
      </button>
    </form>
  )
}
