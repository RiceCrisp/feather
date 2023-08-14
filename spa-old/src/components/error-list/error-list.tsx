import { Alert, List, ListItem } from '@mui/material'
import type { AlertProps } from '@mui/material'

type TErrorListProps = AlertProps & {
  errors?: string[]
}

export function ErrorList({
  errors,
  ...rest
}: TErrorListProps): JSX.Element {
  if (errors && errors.length > 0) {
    return (
      <Alert severity="error" {...rest}>
        <List disablePadding>
          {errors.map((err) => {
            return (
              <ListItem disablePadding key={err}>
                {err}
              </ListItem>
            )
          })}
        </List>
      </Alert>
    )
  }
  return <></>
}
