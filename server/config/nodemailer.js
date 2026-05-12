// import nodemailer from "nodemailer"

// const transporter = nodemailer.createTransport({
//     host: 'smtp-relay.brevo.com',
//     port: 587,
//     auth: {
//         user: process.env.SMTP_USER,
//         pass: process.env.SMTP_PASS
//     }
// })









import nodemailer from "nodemailer";

const transporter = nodemailer.createTransport({
  host: "smtp-relay.brevo.com",
  port: 587,
  secure: false,
  auth: {
    user: process.env.SMTP_USER,
    pass: process.env.SMTP_PASS,
  },
});

async function sendMail() {
  try {
    const info = await transporter.sendMail({
      from: '"My App" <soumikghosh2001.babai017@gmail.com>',
      to: "test@example.com",
      subject: "Test Email",
      text: "Hello from Brevo SMTP",
    });

    console.log("Mail sent:", info.messageId);
  } catch (err) {
    console.error("MAIL ERROR:", err);
  }
}

sendMail();

export default transporter;




















// SMTP configuration test
// transporter.verify((error, success) => {
//     if (error) {
//         console.log("SMTP ERROR:", error);
//     } else {
//         console.log("SMTP READY");
//     }
// });

// xsmtpsib-33971179cc503c01201cbd08ab74a6d5a55f4ba1149ed2b1484b010844e2f369-4zOY8hphCY4t26wm