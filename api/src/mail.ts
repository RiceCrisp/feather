import nodemailer from 'nodemailer'
import type { Transporter } from 'nodemailer'

let transporter: Transporter

if (process.env.NODE_ENV === 'production') {
  transporter = nodemailer.createTransport({
    host: 'smtp.ethereal.email',
    port: 587,
    secure: false,
    auth: {
      user: "smtp-user",
      pass: "smtp-password"
    }
  })
}
else {
  nodemailer.createTestAccount((err, account) => {
    if (err) {
      console.error(err)
    }
    transporter = nodemailer.createTransport({
      host: 'smtp.ethereal.email',
      port: 587,
      secure: false, // true for 465, false for other ports
      auth: {
        user: account.user,
        pass: account.pass
      }
    })
  })
}

type TSendEmailProps = {
  email: string
  id: number
  token: string
}

export async function sendActivationEmail({
  email,
  id,
  token
}: TSendEmailProps): Promise<void> {
  const info = await transporter.sendMail({
    from: '<info@test.com>',
    to: email,
    subject: 'Activate your account',
    html: `
      <p>Thanks for signing up!</p>
      <p>Please activate your account to get started.</p>
      <a href="${String(process.env.SPA_URL)}/activation?e=${email}&t=${token}">Activate Account</a>
    `
  })

  const preview = nodemailer.getTestMessageUrl(info)
  if (preview !== false) {
    console.log(`Email Preview: ${preview}`)
  }
}

export async function sendResetPasswordEmail({
  email,
  id,
  token
}: TSendEmailProps): Promise<void> {
  const info = await transporter.sendMail({
    from: '<info@test.com>',
    to: email,
    subject: 'Reset your password',
    html: `
      <p>Someone recently requested to change your account's password.</p>
      <p>If it was you, set a new password here:</p>
      <a href="${String(process.env.SPA_URL)}/reset-password?e=${email}&t=${token}">Reset password</a>
      <p>If you don't want to change your password, just ignore this email.</p>
    `
  })

  const preview = nodemailer.getTestMessageUrl(info)
  if (preview !== false) {
    console.log(`Email Preview: ${preview}`)
  }
}

export { transporter }
