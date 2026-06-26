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
    <html lang="es">
    <head>
      <meta charset="UTF-8">
      <meta name="viewport" content="width=device-width, initial-scale=1.0">
    </head>
    <body style="margin:0;padding:0;background-color:#0a0a0a;font-family:-apple-system,BlinkMacSystemFont,'Segoe UI',Roboto,Oxygen,Ubuntu,Cantarell,'Open Sans','Helvetica Neue',sans-serif;">
      <table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="background-color:#0a0a0a;padding:40px 20px;">
        <tr>
          <td align="center">
            <!-- Logo -->
            <div style="margin-bottom: 30px;">
              <h1 style="font-size:28px;font-weight:900;color:#f40009;margin:0;text-align:center;">Coca-Cola</h1>
              <div style="height:3px;width:40px;background-color:#f40009;margin:8px auto 0;"></div>
            </div>

            <!-- Main Card -->
            <table role="presentation" width="560" cellpadding="0" cellspacing="0" style="max-width:560px;width:100%;background-color:#18181b;border-radius:16px;border:1px solid #27272a;">
              <tr>
                <td style="padding:40px 32px;">
                  <p style="color:#a1a1aa;font-size:11px;font-weight:bold;letter-spacing:2px;text-transform:uppercase;margin:0 0 12px;">Verificación de cuenta</p>
                  <h2 style="font-size:28px;font-weight:bold;color:#ffffff;margin:0 0 24px;">Hola, <span style="color:#f40009;">${username}</span></h2>
                  
                  <p style="color:#a1a1aa;font-size:15px;line-height:1.6;margin:0 0 32px;">
                    Tu código de verificación de <strong style="color:#ffffff;">6 dígitos</strong> para completar tu registro es:
                  </p>
                  
                  <!-- OTP Box -->
                  <div style="background-color:#09090b;border:1px solid #f40009;border-radius:12px;padding:24px;text-align:center;margin-bottom:24px;">
                    <span style="font-size:36px;font-weight:bold;letter-spacing:12px;color:#f40009;font-family:monospace;">${otp}</span>
                  </div>
                  
                  <!-- Warning Box -->
                  <div style="background-color:#450a0a;border:1px solid #7f1d1d;border-radius:8px;padding:12px;text-align:center;margin-bottom:32px;">
                    <span style="color:#fca5a5;font-size:13px;">⏱ Este código expira en <strong>3 minutos</strong>. No lo compartas con nadie.</span>
                  </div>

                  <p style="color:#52525b;font-size:13px;line-height:1.5;margin:0;text-align:center;">
                    Si no solicitaste este código, ignora este mensaje.
                  </p>
                </td>
              </tr>
            </table>

            <!-- Footer -->
            <table role="presentation" width="560" cellpadding="0" cellspacing="0" style="max-width:560px;width:100%;margin-top:24px;">
              <tr>
                <td align="center">
                  <p style="color:#3f3f46;font-size:12px;margin:0;">
                    &copy; 2026 Coca-Cola Landing Page. Proyecto académico Cibertec.
                  </p>
                </td>
              </tr>
            </table>

          </td>
        </tr>
      </table>
    </body>
    </html>
  `;

  const text = `Hola ${username},\n\nTu codigo de verificacion es: ${otp}\n\nEste codigo es valido por 3 minutos.\nSi no solicitaste este codigo, puedes ignorar este mensaje.\n\nCoca-Cola Landing Page - Proyecto academico Cibertec 2026`;

  await transporter.sendMail({
    from: `"Coca-Cola" <${process.env.EMAIL_USER}>`,
    to: email,
    subject: `Codigo de verificacion: ${otp}`,
    text,
    html,
    headers: {
      'X-Priority': '3',
      'X-Mailer': 'nodemailer',
    },
  });
}

export { generateOtp };
