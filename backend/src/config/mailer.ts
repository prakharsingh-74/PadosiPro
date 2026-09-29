import nodemailer from 'nodemailer';


let transporter: nodemailer.Transporter | null = null;

const getTransporter = async (): Promise<nodemailer.Transporter> => {
  if (transporter) return transporter;

  if (process.env.SMTP_USER && process.env.SMTP_PASS) {
    transporter = nodemailer.createTransport({
      host: process.env.SMTP_HOST,
      port: Number(process.env.SMTP_PORT) || 465,
      secure: process.env.SMTP_SECURE === 'true',
      auth: {
        user: process.env.SMTP_USER,
        pass: process.env.SMTP_PASS
      }
    });
    return transporter;
  }

  try {
    transporter = nodemailer.createTransport({
      host: process.env.SMTP_HOST || 'localhost',
      port: Number(process.env.SMTP_PORT) || 1025,
      secure: false
    });
    return transporter;
  } catch (error) {
    
    const testAccount = await nodemailer.createTestAccount();
    transporter = nodemailer.createTransport({
      host: 'smtp.ethereal.email',
      port: 587,
      secure: false,
      auth: {
        user: testAccount.user,
        pass: testAccount.pass
      }
    });
    return transporter;
  }
};

export const sendOtpEmail = async (to: string, otp: string) => {
  const mailOptions = {
    from: `"PadosiPro" <${process.env.FROM_EMAIL || 'noreply@padosipro.com'}>`,
    to,
    subject: 'Verification Code for PadosiPro',
    html: `
      <div style="font-family: Arial, sans-serif; max-width: 500px; margin: 0 auto; padding: 24px; border: 1px solid #E2E8F0; border-radius: 12px; background-color: #FAF9F6;">
        <div style="text-align: center; margin-bottom: 20px;">
          <div style="width: 48px; height: 48px; background-color: #133330; border-radius: 12px; display: inline-flex; align-items: center; justify-content: center; color: #87A99C; font-size: 24px; font-weight: bold;">
            P
          </div>
          <h2 style="color: #0E2925; margin-top: 12px; margin-bottom: 4px;">PadosiPro</h2>
          <p style="color: #5C736C; font-size: 14px; margin: 0;">Lifestyle Management Service</p>
        </div>

        <p style="color: #0E2925; font-size: 15px;">Hello,</p>
        <p style="color: #5C736C; font-size: 14px; line-height: 1.5;">
          Thank you for signing up with PadosiPro. Please use the 6-digit OTP code below to verify your email address:
        </p>

        <div style="background-color: #FFFFFF; border: 1px solid #87A99C; padding: 18px; text-align: center; font-size: 32px; font-weight: bold; letter-spacing: 8px; color: #133330; border-radius: 10px; margin: 24px 0;">
          ${otp}
        </div>

        <p style="color: #5C736C; font-size: 13px; margin-bottom: 8px;">
          ⏱️ This code is valid for <strong>10 minutes</strong> and can only be used once.
        </p>
        <p style="color: #94A3B8; font-size: 12px; margin-top: 24px; text-align: center; border-top: 1px solid #E2E8F0; padding-top: 16px;">
          If you did not request this verification code, please ignore this email.
        </p>
      </div>
    `
  };

  try {
    const activeTransporter = await getTransporter();
    const info = await activeTransporter.sendMail(mailOptions);
    console.log(`✉️ OTP Email sent to ${to} (MessageID: ${info.messageId})`);

    // If sent via Ethereal, log preview URL
    const previewUrl = nodemailer.getTestMessageUrl(info);
    if (previewUrl) {
      console.log(`🔗 Ethereal Real Email Preview URL: ${previewUrl}`);
    }
  } catch (error) {
    console.error(`❌ Failed to send OTP email via SMTP to ${to}:`, error);
  } finally {
    // ALWAYS log OTP clearly in console for easy development & testing
    console.log(`\n========================================`);
    console.log(`🔐 [OTP CODE FOR ${to}]: ${otp}`);
    console.log(`========================================\n`);
  }
};
