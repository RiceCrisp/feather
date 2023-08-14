import { env } from '~/env'
import type { TAPIError, TAPIResponse, TGraphQlError } from '~/types'

export async function apiRequest<T>(
  endpoint: string,
  options?: RequestInit
): TAPIResponse<T> {
  const url = new URL(endpoint, env.apiUrl)
  const res = await fetch(url, options)
  let data = null
  if (res.headers.get('content-type')?.includes('application/json') === true) {
    data = await res.json()
  }
  return {
    statusCode: res.status,
    body: data,
    ok: res.ok
  }
}

export type GraphQLError = {
  errors: {
    message: string
    extensions?: {
      code: string
      formErrors: TGraphQlError['error']['formErrors']
      fieldErrors: TGraphQlError['error']['fieldErrors']
    }
  }[]
}

export class APIError extends Error {
  constructor(public readonly errors: {
    message: string,
    code: string,
    formErrors: string[]
    fieldErrors: Record<string, string[]>
  } = {
    message: 'Unknown error',
    code: 'UNKNOWN_ERROR',
    formErrors: [],
    fieldErrors: {}
  }) {
    super(errors.message)
  }

  getCode(): string {
    return this.errors.code
  }

  getFormErrors(): {
    formErrors: string[]
    fieldErrors: Record<string, string[]>
  } {
    return {
      formErrors: this.errors.formErrors,
      fieldErrors: this.errors.fieldErrors
    }
  }
}

export async function graphqlRequest<T>(
  query: string
): Promise<T | { error: TAPIError }> {
  try {
    const url = new URL('/graphql', env.apiUrl)
    const res = await fetch(url, {
      method: 'POST',
      headers: {
        "Content-Type": "application/json"
      },
      credentials: 'include',
      body: JSON.stringify({
        query
      })
    })
    const json = await res.json() as { data: T } | GraphQLError
    if ('errors' in json) {
      const error = json.errors[0]
      return {
        error: {
          message: error.message,
          code: error.extensions?.code ?? 'UNKNOWN_ERROR',
          formErrors: error.extensions?.formErrors ?? [],
          fieldErrors: error.extensions?.fieldErrors ?? {}
        }
      }
    }
    return json.data
  }
  catch (err) {
    return {
      error: {
        message: '',
        code: 'UNKNOWN_ERROR',
        formErrors: [],
        fieldErrors: {}
      }
    }
  }
}
