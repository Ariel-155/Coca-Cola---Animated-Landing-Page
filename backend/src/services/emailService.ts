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
    <body style="margin:0;padding:0;background-color:#ffffff;font-family:Arial,Helvetica,sans-serif;">
      <table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="background-color:#ffffff;padding:40px 20px;">
        <tr>
          <td align="center">
            <table role="presentation" width="560" cellpadding="0" cellspacing="0" style="max-width:560px;width:100%;">
              <!-- Header -->
              <tr>
                <td align="center" style="padding-bottom:24px;border-bottom:2px solid #d52b1e;">
                  <h1 style="font-size:28px;font-weight:bold;color:#d52b1e;margin:0;">Coca-Cola</h1>
                </td>
              </tr>
              <!-- Body -->
              <tr>
                <td style="padding:32px 0;">
                  <p style="color:#333333;font-size:16px;margin:0 0 8px;">Hola <strong>${username}</strong>,</p>
                  <p style="color:#555555;font-size:15px;line-height:1.6;margin:0 0 24px;">
                    Hemos recibido una solicitud para verificar tu cuenta. Usa el siguiente codigo de 6 digitos para completar tu registro:
                  </p>
                  <!-- OTP Code -->
                  <table role="presentation" width="100%" cellpadding="0" cellspacing="0">
                    <tr>
                      <td align="center" style="padding:20px 0;">
                        <div style="display:inline-block;background-color:#f5f5f5;border:1px solid #dddddd;border-radius:8px;padding:16px 32px;">
                          <span style="font-size:36px;font-weight:bold;letter-spacing:8px;color:#333333;font-family:monospace;">${otp}</span>
                        </div>
                      </td>
                    </tr>
                  </table>
                  <p style="color:#888888;font-size:13px;line-height:1.5;margin:24px 0 0;text-align:center;">
                    Este codigo es valido por 3 minutos. Si no solicitaste este codigo, puedes ignorar este mensaje de forma segura.
                  </p>
                </td>
              </tr>
              <!-- Footer -->
              <tr>
                <td style="border-top:1px solid #eeeeee;padding-top:20px;">
                  <p style="color:#aaaaaa;font-size:12px;margin:0;text-align:center;">
                    Coca-Cola Landing Page - Proyecto academico Cibertec 2026
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
