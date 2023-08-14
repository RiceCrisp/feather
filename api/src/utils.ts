import { z } from 'zod'
import { GraphQLError } from 'graphql'
import type { Request } from 'express'

export function validateInput<T extends z.ZodObject<any>>(schema: T, args: Partial<T['_type']>): T['_type'] {
  const zRes = schema.safeParse(args);
  if (!zRes.success) {
    const errors = new z.ZodError(zRes.error.issues).flatten();
    throw new GraphQLError('Invalid input', {
      extensions: {
        code: 'FORM_FIELD_ERROR',
        ...errors,
      },
    });
  }
  return zRes.data;
}

export function throwAuthError(): void {
  throw new GraphQLError('Unauthorized', {
    extensions: {
      code: 'UNAUTHORIZED'
    }
  })
}

export function validateAuthentication(req: Request): asserts req is Request & { session: { userId: number } } {
  if (req.session.userId === undefined) {
    throwAuthError()
  }
}

export function validateAuthorization(req: Request, id?: number): void {
  validateAuthentication(req)
  if (req.session.userId !== id) {
    throwAuthError()
  }
}
