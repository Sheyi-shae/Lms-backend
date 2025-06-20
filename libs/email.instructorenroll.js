import nodemailer from "nodemailer";

// Create a transporter object
const transporter = nodemailer.createTransport({
  service: "Gmail", // Gmail service provider
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS,
  },
});

const notifyInstructorOfEnrollment = async (email, courseTitle, studentName) => {
  const mailOptions = {
    from: `"Lucis Team" <${process.env.EMAIL_USER}>`,
    to: email,
    subject: "New Enrollment in Your Course - Lucis",
    html: `
      <div style="font-family: Arial, sans-serif; background-color: #f9f9f9; padding: 40px;">
        <div style="max-width: 600px; margin: auto; background: white; border-radius: 8px; overflow: hidden; box-shadow: 0 4px 12px rgba(0,0,0,0.05);">
          <div style="background-color: #10B981; padding: 20px; text-align: center; color: white;">
            <h2>Lucis - New Enrollment</h2>
          </div>
          <div style="padding: 30px; color: #333;">
            <p style="font-size: 16px;">Hello,</p>
            <p style="font-size: 16px;">
              Great news! <strong style="color: #10B981;">${studentName}</strong> has just enrolled in your course titled 
              <strong style="color: #10B981;">${courseTitle}</strong>.
            </p>
            <p style="font-size: 14px; color: #555;">
              Keep engaging your students and helping them succeed. You can view the new enrollment in your dashboard and interact with your students as they progress.
            </p>
            <p style="font-size: 16px; margin-top: 30px;">Thank you for being part of Lucis,<br/>The Lucis Team</p>
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

export default notifyInstructorOfEnrollment;
