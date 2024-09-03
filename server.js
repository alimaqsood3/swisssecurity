// server.js
const express = require('express');
const nodemailer = require('nodemailer');
const bodyParser = require('body-parser');
const dotenv = require('dotenv');

dotenv.config();

const app = express();
const port = 3000;

// Middleware to parse form data
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

// Setup Nodemailer
const transporter = nodemailer.createTransport({
    service: 'gmail', // Use your email provider's service
    auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS
    }
});
// const transporter = nodemailer.createTransport({
//     host: '127.0.0.1',
//     port: 1025,
//     // No need for auth here, as MailDev doesn't require it
// });
// POST route to handle form submission
app.get('/', (req, res) => {
    res.send('Hello, I\'m working!');
});

app.post('/contact', (req, res) => {
    const { name, phone, email, subject, message } = req.body;

    // Validate email
    if (!email || !email.includes('@')) {
        return res.status(400).send('Invalid email address');
    }

   // Email options
    const mailOptions = {
        from: email,
        to: process.env.EMAIL_USER, // Replace with your email address
        subject: `Contact Form Submission: ${subject}`,
        text: `Name: ${name}\nPhone: ${phone}\nEmail: ${email}\nSubject: ${subject}\n\nMessage:\n${message}`
    };
    // const mailOptions = {
    //     from: 'test@example.com',
    //     to: 'test@example.com',
    //     subject: 'Test Email',
    //     text: 'This is a test email sent from Nodemailer',
    // };
    // Send email
    transporter.sendMail(mailOptions, (error, info) => {
        if (error) {
            console.error('Error sending email:', error);
            return res.status(500).send('There was an error sending your message. Please try again.');
        }
        res.send('Thank you for contacting us!');
    });
});

// Start the server
app.listen(port, () => {
    console.log(`Server is running on http://localhost:${port}`);
});
