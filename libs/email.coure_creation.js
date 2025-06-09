import nodemailer from "nodemailer";

// Create a transporter object
const transporter = nodemailer.createTransport({
  service: "Gmail", // gmail service provider
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS,
  },
});

const courseCreationEmail = async (email, title) => {
  const mailOptions = {
    from: process.env.EMAIL_USER,
    to: email,
    subject: "New Course",
    html: `<p>Your course <strong>${title}</strong> has been created successfully</p>`,
  };

  try {
    await transporter.sendMail(mailOptions);
    console.log("email sent to:", email);
  } catch (error) {
    console.error("Email sending error:", error);
  }
};

export default courseCreationEmail;
