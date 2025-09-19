const nodemailer = require('nodemailer');

const transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
        user: process.env.EMAIL_USER, 
        pass: process.env.EMAIL_PASS, 
    },
});

exports.sendOpportunitiesEmail = async (recipientEmail, opportunities) => {
    let htmlBody = `<h1>Today's Top AI & Crypto Opportunities</h1><ul>`;
    opportunities.forEach(op => {
        htmlBody += `<li><strong><a href="${op.link}">${op.title}</a></strong><p>${op.summary}</p></li>`;
    });
    htmlBody += `</ul>`;

    const mailOptions = {
        from: process.env.EMAIL_USER,
        to: recipientEmail,
        subject: '🚀 Daily AI & Crypto News Digest',
        html: htmlBody,
    };

    try {
        await transporter.sendMail(mailOptions);
        console.log(`Email sent to ${recipientEmail}`);
    } catch (error) {
        console.error(`Failed to send email to ${recipientEmail}:`, error);
    }
};