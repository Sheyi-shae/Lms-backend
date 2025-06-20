import nodemailer from "nodemailer";

// Create a transporter object
const transporter = nodemailer.createTransport({
  service: "Gmail", // Gmail service provider
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS,
  },
});

const studentEnrollment = async (email, title) => {
  const mailOptions = {
    from: `"Lucis Team" <${process.env.EMAIL_USER}>`,
    to: email,
    subject: "Enrollment Confirmed - Welcome to Your Course!",
    html: `
      <div style="font-family: Arial, sans-serif; background-color: #f9f9f9; padding: 40px;">
        <div style="max-width: 600px; margin: auto; background: white; border-radius: 8px; overflow: hidden; box-shadow: 0 4px 12px rgba(0,0,0,0.05);">
          <div style="background-color: #10B981; padding: 20px; text-align: center; color: white;">
            <h2>Lucis - Course Enrollment</h2>
          </div>
          <div style="padding: 30px; color: #333;">
            <p style="font-size: 16px;">Hello,</p>
            <p style="font-size: 16px;">
              Congratulations! You've successfully enrolled in <strong style="color: #10B981;">${title}</strong>.
            </p>
            <p style="font-size: 14px; color: #555;">
              You now have access to all the lessons and resources included in this course. We encourage you to stay consistent, take notes, and reach out if you need support during your learning journey.
            </p>
            <p style="font-size: 16px; margin-top: 30px;">Happy learning!<br/>The Lucis Team</p>
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

export default studentEnrollment;
