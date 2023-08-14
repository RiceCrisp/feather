import { Alert } from '@/src/components'

type TErrorListProps = {
  errors?: string[]
}

export function ErrorList({
  errors
}: TErrorListProps): JSX.Element {
  if (errors && errors.length > 0) {
    return (
      <Alert severity="error">
        <ul>
          {errors.map((err) => {
            return (
              <li key={err}>
                {err}
              </li>
            )
          })}
        </ul>
      </Alert>
    )
  }
  return <></>
}
