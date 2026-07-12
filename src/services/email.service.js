// services/email.service.js

const transporter = require("../config/mail");
const welcomeEmailTemplate = require("../templates/welcomeEmail");

// /**
//  * Send Welcome Email
//  * @param {string} email - Recipient email
//  * @param {string} name - Recipient name
//  */
const sendWelcomeEmail = async (email, name) => {
  try {
    const info = await transporter.sendMail({
      from: `"Your Website" <${process.env.EMAIL}>`,
      to: email,
      subject: "🎉 Welcome to Our Website!",
      html: welcomeEmailTemplate(name),
    });

    console.log(`✅ Welcome email sent to ${email}`);
    return info;
  } catch (error) {
    console.error("❌ Error sending welcome email:", error.message);
    throw error;
  }
};

// /**
//  * Send OTP Email
//  * @param {string} email
//  * @param {string} otp
//  */

// const sendOTPEmail = async (email, otp) => {
//     try {
//         const info = await transporter.sendMail({
//             from: `"Your Website" <${process.env.EMAIL}>`,
//             to: email,
//             subject: "Your OTP Code",
//             html: `
//                 <h2>Your OTP</h2>

//                 <p>Your OTP is:</p>

//                 <h1>${otp}</h1>

//                 <p>This OTP is valid for 5 minutes.</p>
//             `,
//         });

//         console.log(`✅ OTP email sent to ${email}`);
//         return info;

//     } catch (error) {
//         console.error("❌ Error sending OTP email:", error.message);
//         throw error;
//     }
// };

// /**
//  * Send Password Reset Email
//  * @param {string} email
//  * @param {string} resetLink
//  */

// const sendPasswordResetEmail = async (email, resetLink) => {
//     try {
//         const info = await transporter.sendMail({
//             from: `"Your Website" <${process.env.EMAIL}>`,
//             to: email,
//             subject: "Reset Your Password",
//             html: `
//                 <h2>Password Reset Request</h2>

//                 <p>Click the button below to reset your password.</p>

//                 <a href="${resetLink}">
//                     Reset Password
//                 </a>

//                 <p>If you didn't request this, ignore this email.</p>
//             `,
//         });

//         console.log(`✅ Password reset email sent to ${email}`);
//         return info;

//     } catch (error) {
//         console.error("❌ Error sending password reset email:", error.message);
//         throw error;
//     }
// };

module.exports = sendWelcomeEmail;
