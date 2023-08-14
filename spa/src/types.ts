import type { ZodIssue } from 'zod'

export type TUser = {
  id: number
  first_name?: string
  last_name?: string
  email: string
  phone?: string
}

export type TPost = {
  id: number
  title: string
  content: string
  owner: number
  created_at: Date
}

export type TAPIResponse<T> = Promise<{
  statusCode: number
  body: T
  ok: true
} | {
  statusCode: number
  body: ZodIssue[]
  ok: false
}>

export type TAction = {
  type: string
  payload: Record<string, any>
}

export type TUserState = {
  loggedIn: boolean
} & TUser

export type TZodError = {
  formErrors: string[]
  fieldErrors: Record<string, string[] | undefined>
}

export type TGraphQlError = {
  error: {
    code: string
    message: string
    formErrors?: string[]
    fieldErrors?: Record<string, string[]>
  }
}

export type TAPIError = {
  code: string
  message: string
  formErrors: string[]
  fieldErrors: Record<string, string[]>
}

export type TPageProps = {
  params: { slug: string }
  searchParams: { [key: string]: string | string[] | undefined }
}
