import type { RouteObject } from 'react-router'
import { account } from './account'
import { activation } from './activation'
import { createPost } from './create-post'
import { dashboard } from './dashboard'
import { editPost } from './edit-post'
import { forgotPassword } from './forgot-password'
import { home } from './home'
import { login } from './login'
import { logout } from './logout'
import { resetPassword } from './reset-password'
import { signup } from './signup'

const routes: RouteObject[] = [
  account,
  activation,
  createPost,
  dashboard,
  editPost,
  forgotPassword,
  home,
  login,
  logout,
  resetPassword,
  signup
]

export default routes
