import nodemailer from 'nodemailer';

const transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS,
  },
});

function generateOtp(): string {
  return Math.floor(100000 + Math.random() * 900000).toString();
}

export async function sendOtpEmail(email: string, otp: string, username: string): Promise<void> {
  const html = `
    <!DOCTYPE html>
    <html>
    <head>
      <meta charset="UTF-8">
      <meta name="viewport" content="width=device-width, initial-scale=1.0">
    </head>
    <body style="margin:0;padding:0;background:#0a0a0a;font-family:'Helvetica Neue',Helvetica,Arial,sans-serif;">
      <table width="100%" cellpadding="0" cellspacing="0" style="background:#0a0a0a;padding:40px 20px;">
        <tr>
          <td align="center">
            <table width="560" cellpadding="0" cellspacing="0" style="max-width:560px;width:100%;">
              <!-- Logo Header -->
              <tr>
                <td align="center" style="padding-bottom:32px;">
                  <div style="font-size:36px;font-weight:900;color:#F40009;letter-spacing:-1px;">Coca-Cola</div>
                  <div style="width:60px;height:3px;background:#F40009;margin:8px auto 0;border-radius:2px;"></div>
                </td>
              </tr>
              <!-- Card -->
              <tr>
                <td style="background:#1a1a1a;border-radius:20px;padding:40px;border:1px solid #2a2a2a;">
                  <p style="color:#999;font-size:14px;margin:0 0 8px;text-transform:uppercase;letter-spacing:2px;">Verificación de cuenta</p>
                  <h1 style="color:#fff;font-size:28px;font-weight:900;margin:0 0 24px;line-height:1.2;">
                    Hola, <span style="color:#F40009;">${username}</span>
                  </h1>
                  <p style="color:#aaa;font-size:16px;margin:0 0 32px;line-height:1.6;">
                    Tu código de verificación de <strong style="color:#fff;">6 dígitos</strong> para completar tu registro es:
                  </p>
                  <!-- OTP Code -->
                  <div style="background:#111;border:2px solid #F40009;border-radius:12px;padding:24px;text-align:center;margin-bottom:32px;box-shadow:0 0 30px rgba(244,0,9,0.2);">
                    <span style="font-size:48px;font-weight:900;letter-spacing:12px;color:#F40009;font-family:monospace;">${otp}</span>
                  </div>
                  <!-- Warning -->
                  <div style="background:#1f0000;border:1px solid #F40009;border-radius:8px;padding:16px;margin-bottom:24px;">
                    <p style="color:#ff6b6b;font-size:13px;margin:0;text-align:center;">
                      ⏱️ Este código expira en <strong>3 minutos</strong>. No lo compartas con nadie.
                    </p>
                  </div>
                  <p style="color:#555;font-size:13px;margin:0;text-align:center;">
                    Si no solicitaste este código, ignora este mensaje.
                  </p>
                </td>
              </tr>
              <!-- Footer -->
              <tr>
                <td align="center" style="padding-top:24px;">
                  <p style="color:#333;font-size:12px;margin:0;">© 2026 Coca-Cola Landing Page. Proyecto académico Cibertec.</p>
                </td>
              </tr>
            </table>
          </td>
        </tr>
      </table>
    </body>
    </html>
  `;

  await transporter.sendMail({
    from: `"Coca-Cola Accounts" <${process.env.EMAIL_USER}>`,
    to: email,
    subject: `${otp} — Tu código de verificación Coca-Cola`,
    html,
  });
}

export { generateOtp };
