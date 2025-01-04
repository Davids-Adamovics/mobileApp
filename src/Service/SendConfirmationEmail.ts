import nodemailer from "nodemailer";

async function sendConfirmationEmail(email: string, confirmationToken: string): Promise<void> {
    // Create a transporter using your email service (for example, Gmail)
    let transporter = nodemailer.createTransport({
        service: "gmail", // or another email service
        auth: {
            user: "your-email@gmail.com", // Your email address
            pass: "your-email-password",   // Your email password
        },
    });

    // Send the email
    await transporter.sendMail({
        from: "your-email@gmail.com", // Sender address
        to: email,                    // Receiver's email address
        subject: "Email Confirmation", // Email subject
        text: `Please confirm your registration by visiting the following link: 
        http://localhost:3000/users/confirmation/${confirmationToken}`, // Email body
    });
}
