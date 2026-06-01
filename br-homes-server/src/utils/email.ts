import { Resend } from 'resend'
import { env } from '../config/env'

const resend = new Resend(env.RESEND_API_KEY)

export const sendVerificationEmail = async (
  to: string,
  name: string,
  token: string
): Promise<void> => {
  const verifyUrl = `${env.CLIENT_URL}/verify-email?token=${token}`

  await resend.emails.send({
    from: env.RESEND_FROM_EMAIL,
    to,
    subject: 'Verify your BR-Homes account',
    html: `
      <!DOCTYPE html>
      <html>
        <head>
          <meta charset="utf-8">
          <meta name="viewport" content="width=device-width, initial-scale=1.0">
        </head>
        <body style="margin:0;padding:0;background-color:#f8fafc;font-family:'Segoe UI',Roboto,sans-serif;">
          <div style="max-width:560px;margin:40px auto;background:#ffffff;border-radius:12px;overflow:hidden;box-shadow:0 1px 3px rgba(0,0,0,0.1);">
            <div style="background:linear-gradient(135deg,#0f172a,#1e293b);padding:32px;text-align:center;">
              <h1 style="color:#ffffff;margin:0;font-size:24px;font-weight:700;">BR-Homes</h1>
              <p style="color:#94a3b8;margin:8px 0 0;font-size:14px;">No-Broker Real Estate Marketplace</p>
            </div>
            <div style="padding:32px;">
              <h2 style="color:#0f172a;font-size:20px;margin:0 0 12px;">Welcome, ${name}!</h2>
              <p style="color:#475569;font-size:15px;line-height:1.6;margin:0 0 24px;">
                Thank you for registering with BR-Homes. Please verify your email address to activate your account.
              </p>
              <div style="text-align:center;margin:32px 0;">
                <a href="${verifyUrl}" 
                   style="display:inline-block;padding:14px 32px;background:linear-gradient(135deg,#0f172a,#334155);color:#ffffff;text-decoration:none;border-radius:8px;font-size:15px;font-weight:600;letter-spacing:0.3px;">
                  Verify Email Address
                </a>
              </div>
              <p style="color:#64748b;font-size:13px;line-height:1.5;margin:24px 0 0;">
                If the button doesn't work, copy and paste this link into your browser:<br>
                <a href="${verifyUrl}" style="color:#2563eb;word-break:break-all;">${verifyUrl}</a>
              </p>
              <p style="color:#94a3b8;font-size:12px;margin:24px 0 0;">
                This link expires in 24 hours. If you didn't create an account, please ignore this email.
              </p>
            </div>
          </div>
        </body>
      </html>
    `,
  })
}
