import { createTheme } from '@mui/material'

export const theme = createTheme({
  typography: {
    fontFamily: 'Inter, Avenir, Helvetica, Arial, sans-serif',
    h1: {
      fontSize: '3rem',
      fontWeight: 400
    },
    h2: {
      fontSize: '2rem',
      fontWeight: 400
    },
    h3: {
      fontSize: '1.5rem',
      fontWeight: 400
    },
    h4: {
      fontSize: '1.2rem',
      fontWeight: 400
    }
  },
  components: {
    MuiButton: {
      defaultProps: {
        variant: 'contained'
      }
    }
  }
})
