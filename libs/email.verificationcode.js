import nodemailer from "nodemailer";

// Create a transporter object
const transporter = nodemailer.createTransport({
  service: "Gmail",
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS,
  },
});

const sendVerificationEmail = async (email, code) => {
  const mailOptions = {
    from: `"Lucis Support" <${process.env.EMAIL_USER}>`,
    to: email,
    subject: "Verify Your Email - Lucis",
    html: `
      <div style="font-family: Arial, sans-serif; background-color: #f9f9f9; padding: 40px;">
        <div style="max-width: 600px; margin: auto; background: white; border-radius: 8px; overflow: hidden; box-shadow: 0 4px 12px rgba(0,0,0,0.05);">
          <div style="background-color: #10B981; padding: 20px; text-align: center; color: white;">
            <h2>Lucis - Email Verification</h2>
          </div>
          <div style="padding: 30px; color: #333;">
            <p style="font-size: 16px;">Hello,</p>
            <p style="font-size: 16px;">
              Thank you for signing up! Please use the verification code below to complete your registration:
            </p>
            <div style="margin: 20px 0; text-align: center;">
              <span style="display: inline-block; background-color: #10B981; color: white; font-size: 24px; font-weight: bold; padding: 10px 20px; border-radius: 6px;">
                ${code}
              </span>
            </div>
            <p style="font-size: 14px; color: #555;">
              This code is valid for a limited time. If you didn't request this, you can ignore this email.
            </p>
            <p style="font-size: 16px; margin-top: 30px;">Best regards,<br/>The Lucis Team</p>
          </div>
          <div style="background-color: #f0f0f0; text-align: center; padding: 15px; font-size: 12px; color: #888;">
            © ${new Date().getFullYear()} Lucis. All rights reserved.
          </div>
        </div>
      </div>
    `,
  };

  try {
    await transporter.sendMail(mailOptions);
   
  } catch (error) {
  
  }
};

export default sendVerificationEmail;
