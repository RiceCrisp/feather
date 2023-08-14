import { useRef, useState } from 'react'
import { useQuery } from 'react-query'
import { Avatar, Box, Button, IconButton, Link, Menu, MenuItem, Stack, Tooltip } from '@mui/material'
import { Container } from '@mui/system'
import { Link as RouterLink } from 'react-router-dom'

import { getMe } from '~/queries'
import { theme } from '~/theme'

type TAppShellProps = React.PropsWithChildren

export function AppShell({ children }: TAppShellProps): JSX.Element {
  const [accountMenuOpen, setAccountMenuOpen] = useState(false)
  const accountMenuAnchor = useRef<HTMLButtonElement>(null)

  const me = useQuery(['me'], getMe)

  const handleAccountMenuClick: React.MouseEventHandler = (e) => {
    setAccountMenuOpen((prevOpen) => !prevOpen)
  }

  const handleAccountMenuClose = (): void => {
    setAccountMenuOpen(false)
  }

  return (
    <Box
      sx={{
        display: 'grid',
        height: '100vh',
        gridTemplateColumns: 'var(--sidebar-width) auto',
        gridTemplateRows: 'var(--header-height) auto',
        gridTemplateAreas: `
          'header header'
          'sidebar main'
        `
      }}
    >
      <Box
        sx={{
          gridArea: 'header',
          position: 'relative',
          zIndex: 1,
          boxShadow: '0 2px 2px 0 rgba(0,0,0,0.1)'
        }}
      >
        <Container
          maxWidth={false}
          sx={{
            height: '100%',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between'
          }}
        >
          <Link component={RouterLink} to="/" variant="h5">
            Project
          </Link>
          {me.data ? (
            <>
              <Tooltip title="Account" arrow>
                <IconButton
                  id="account-menu-button"
                  ref={accountMenuAnchor}
                  onClick={handleAccountMenuClick}
                  aria-controls={accountMenuOpen ? 'account-menu' : undefined}
                  aria-expanded={accountMenuOpen ? 'true' : undefined}
                  aria-haspopup="true"
                >
                  <Avatar
                    sx={{ width: 24, height: 24 }}
                  />
                </IconButton>
              </Tooltip>
              <Menu
                id="account-menu"
                anchorEl={accountMenuAnchor.current}
                open={accountMenuOpen}
                onClose={handleAccountMenuClose}
                disableScrollLock
                transformOrigin={{ horizontal: 'right', vertical: 'top' }}
                anchorOrigin={{ horizontal: 'right', vertical: 'bottom' }}
              >
                <MenuItem component={RouterLink} to="/account">
                  Account
                </MenuItem>
                <MenuItem component={RouterLink} to="/logout">
                  Logout
                </MenuItem>
              </Menu>
            </>
          ) : (
            <Stack direction="row" spacing={2}>
              <Button
                variant="outlined"
                component={RouterLink}
                to="/signup"
              >
                Sign Up
              </Button>
              <Button
                component={RouterLink}
                to="/login"
              >
                Log In
              </Button>
            </Stack>
          )}
        </Container>
      </Box>
      <Container
        component="aside"
        sx={{
          gridArea: 'sidebar',
          padding: 'var(--layout-padding)',
          borderRight: `1px solid ${theme.palette.divider}`,
          backgroundColor: theme.palette.grey[50]
        }}
      >
        <Stack>
          <Link component={RouterLink} to="/dashboard" variant="body1">
            Dashboard
          </Link>
        </Stack>
      </Container>
      <Container
        component="main"
        maxWidth={false}
        sx={{
          gridArea: 'main',
          padding: 'var(--layout-padding)',
        }}
      >
        {children}
      </Container>
    </Box>
  )
}
