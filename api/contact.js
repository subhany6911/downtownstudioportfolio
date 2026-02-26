const nodemailer = require('nodemailer');

export default async function handler(req, res) {
    if (req.method !== 'POST') {
        return res.status(405).json({ message: 'Method Not Allowed' });
    }

    const { name, email, plan, notes } = req.body;

    if (!name || !email) {
        return res.status(400).json({ message: 'Name and Email are required' });
    }

    // Transporter configuration using environment variables
    const transporter = nodemailer.createTransport({
        service: 'gmail',
        auth: {
            user: process.env.EMAIL_USER,
            pass: process.env.EMAIL_PASS, // Use a Gmail App Password
        },
    });

    try {
        await transporter.sendMail({
            from: `"Artvilla Productions" <${process.env.EMAIL_USER}>`,
            to: process.env.EMAIL_USER, // Sending to the owner
            replyTo: email,
            subject: `New Booking Inquiry from ${name}`,
            text: `
                Name: ${name}
                Email: ${email}
                Plan: ${plan || 'Not specified'}
                Notes: ${notes || 'No notes provided'}
            `,
            html: `
                <h3>New Booking Inquiry</h3>
                <p><strong>Name:</strong> ${name}</p>
                <p><strong>Email:</strong> ${email}</p>
                <p><strong>Plan:</strong> ${plan || 'Not specified'}</p>
                <p><strong>Notes:</strong> ${notes || 'No notes provided'}</p>
            `,
        });

        return res.status(200).json({ success: true, message: 'Message sent successfully' });
    } catch (error) {
        console.error('Email error:', error);
        return res.status(500).json({ success: false, message: 'Internal Server Error', error: error.message });
    }
}
