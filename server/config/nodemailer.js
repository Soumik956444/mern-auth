import nodemailer from "nodemailer"

const transporter = nodemailer.createTransport({
    host: 'smtp-relay.brevo.com',
    port: 587,
    auth: {
        user: process.env.SMTP_USER,
        pass: process.env.SMTP_PASS
    }
})



























SMTP configuration test
transporter.verify((error, success) => {
    if (error) {
        console.log("SMTP ERROR:", error);
    } else {
        console.log("SMTP READY");
    }
});

// xsmtpsib-33971179cc503c01201cbd08ab74a6d5a55f4ba1149ed2b1484b010844e2f369-4zOY8hphCY4t26wm