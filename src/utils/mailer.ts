
import nodemailer from 'nodemailer';
import { ConnectedToDatabase } from '@/DB/databaseConnection';
import { MailerProps } from '@/types/type';


export async function sendMail({ email, emailType, forgotPasswordToken, verificationToken }: MailerProps) {
  try {

    ConnectedToDatabase();

    const transporter = nodemailer.createTransport({
      service: 'gmail',
      auth: {
        user: process.env.MAILER_EMAIL,
        pass: process.env.MAILER_PASSWORD,
      }
    });

    const mailtrapOptions = {
      from: process.env.MAILER_EMAIL,
      to: email,
      subject: `${emailType === 'verify' ? 'Verify your email' : 'Reset your password'}`,
      html: `
            <html>

<head>
  <title></title>
  <meta http-equiv="Content-Type" content="text/html; charset=utf-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1">
  <meta http-equiv="X-UA-Compatible" content="IE=edge" />
  <style type="text/css">
    /* CLIENT-SPECIFIC STYLES */
    body,
    table,
    td,
    a {
      -webkit-text-size-adjust: 100%;
      -ms-text-size-adjust: 100%;
    }

    table,
    td {
      mso-table-lspace: 0pt;
      mso-table-rspace: 0pt;
    }

    img {
      -ms-interpolation-mode: bicubic;
    }

    /* RESET STYLES */
    img {
      border: 0;
      height: auto;
      line-height: 100%;
      outline: none;
      text-decoration: none;
    }

    table {
      border-collapse: collapse !important;
    }

    body {
      height: 100% !important;
      margin: 0 !important;
      padding: 0 !important;
      width: 100% !important;
    }

    /* iOS BLUE LINKS */
    a[x-apple-data-detectors] {
      color: inherit !important;
      text-decoration: none !important;
      font-size: inherit !important;
      font-family: inherit !important;
      font-weight: inherit !important;
      line-height: inherit !important;
    }

    /* MOBILE STYLES */
    @media screen and (max-width:600px) {
      h1 {
        font-size: 32px !important;
        line-height: 32px !important;
      }
    }

    /* ANDROID CENTER FIX */
    div[style*="margin: 16px 0;"] {
      margin: 0 !important;
    }
  </style>

  <style type="text/css">

  </style>
</head>

            <body style="background-color: #f4f4f4; margin: 0 !important; padding: 0 !important;">
                <div style="display: none; font-size: 1px; color: #fefefe; line-height: 1px; font-family: Helvetica, Arial, sans-serif; max-height: 0px; max-width: 0px; opacity: 0; overflow: hidden;">  
                 Reset your password
                </div>

                <tr>
                 <td bgcolor="#f4f4f4" align="center" style="padding: 0px 10px 0px 10px;">
                  <table border="0" cellpadding="0" cellspacing="0" width="100%" style="max-width: 600px;">
                   <tr>
                    <td bgcolor="#ffffff" align="center" valign="top" style="padding: 40px 20px 20px 20px; border-radius: 4px 4px 0px 0px; color: #111111; font-family: Helvetica, Arial, sans-serif; font-size: 48px; font-weight: 400; letter-spacing: 4px; line-height: 48px;">
                       <h1 style="font-size: 28px; font-weight: 400; margin: 0; letter-spacing: 0px;">
                       ${emailType === 'verify' ? 'Verify Your Email' : 'Reset your password'}
                       </h1>
                    </td>
                   </tr>
                  </table>
                 </td>
                </tr>

                <tr>
      <td bgcolor="#f4f4f4" align="center" style="padding: 0px 10px 0px 10px;">
        <table border="0" cellpadding="0" cellspacing="0" width="100%" style="max-width: 600px;">
     
          <tr>
            <td bgcolor="#ffffff" align="left" style="padding: 20px 30px 40px 30px; color: #666666; font-family: Helvetica, Arial, sans-serif; font-size: 18px; font-weight: 400; line-height: 25px;">
              <p style="margin: 0;">We're excited to have you get started. First, you need to confirm your account. Just press the button below.</p>
            </td>
          </tr>
          
          <tr>
            <td bgcolor="#ffffff" align="left">
              <table width="100%" border="0" cellspacing="0" cellpadding="0">
                <tr>
                  <td bgcolor="#ffffff" align="center" style="padding: 20px 30px 60px 30px;">
                    <table border="0" cellspacing="0" cellpadding="0">
                     <tr>
                       <td align="center" style="border-radius: 3px;" bgcolor="#4A35EA">
                       ${emailType === 'verify'
          ? `<a href="${process.env.DOMAIN}/verify-account?token=${verificationToken}" target="_blank" style="font-size: 20px; font-family: Helvetica, Arial, sans-serif; color: #ffffff; text-decoration: none; color: #ffffff; text-decoration: none; padding: 15px 25px; border-radius: 2px; border: 1px solid #4A35EA; display: inline-block;">Verify Your Email</a></td>`
          : `<a href="${process.env.DOMAIN}/update-password?token=${forgotPasswordToken}" target="_blank" style="font-size: 20px; font-family: Helvetica, Arial, sans-serif; color: #ffffff; text-decoration: none; color: #ffffff; text-decoration: none; padding: 15px 25px; border-radius: 2px; border: 1px solid #4A35EA; display: inline-block;">Reset Password</a></td>`
        }
                     </tr>
                   </table>
                 </td>
               </tr>
             </table>
            </td>
          </tr>


        <tr>
          <td bgcolor="#ffffff" align="left" style="padding: 0px 30px 0px 30px; color: #666666; font-family: Helvetica, Arial, sans-serif; font-size: 18px; font-weight: 400; line-height: 25px;">
             <p style="margin: 0;">If that doesn't work, copy and paste the following link in your browser:</p>
           </td>
        </tr>


        <tr>
        <td bgcolor="#ffffff" align="left" style="padding: 20px 30px 20px 30px; color: #666666; font-family: Helvetica, Arial, sans-serif; font-size: 18px; font-weight: 400; line-height: 25px;">
          <p style="margin: 0;">
          ${emailType === 'verify'
          ? `<a href="${process.env.DOMAIN}/verify-account?token=${verificationToken}" target="_blank" style="color: #4A35EA;">${process.env.DOMAIN}/verify-account?token=${verificationToken}</a>`
          : `<a href="${process.env.DOMAIN}/update-password?token=${forgotPasswordToken}" target="_blank" style="color: #4A35EA;">${process.env.DOMAIN}/update-password?token=${forgotPasswordToken}</a>`
        }
          </p>
        </td>
      </tr>
   
      <tr>
      <td bgcolor="#ffffff" align="left" style="padding: 0px 30px 20px 30px; color: #666666; font-family: Helvetica, Arial, sans-serif; font-size: 18px; font-weight: 400; line-height: 25px;">
        <p style="margin: 0;">If you have any questions, just reply to this email—we're always happy to help out.</p>
      </td>
    </tr>

    </td>
    </tr>

    <tr>
    <td bgcolor="#f4f4f4" align="center" style="padding: 0px 10px 0px 10px;">

    <tr>
    <td bgcolor="#f4f4f4" align="left" style="padding: 0px 30px 30px 30px; color: #666666; font-family: Helvetica, Arial, sans-serif; font-size: 14px; font-weight: 400; line-height: 18px;">
      <p style="margin: 0;">You received this email because you just signed up for a new account. If it looks weird, <a href="http://litmus.com" target="_blank" style="color: #111111; font-weight: 700;">view it in your browser</a>.</p>
    </td>
  </tr>


            </body>
            </html>
                    `
    };
    await transporter.sendMail(mailtrapOptions);

    // Return the response
    return sendMail;

  } catch (error) {
    console.log("Error in sending Mail ", error)
  }
}