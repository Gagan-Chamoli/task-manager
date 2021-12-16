const sgMail = require('@sendgrid/mail');
const sendGrid = process.env.SG_API_KEY ;

sgMail.setApiKey(sendGrid);

const sendWelcomeEmail = (email, name)=>{
    sgMail.send({
        to: email,
        from: 'gagan@rapidinnovation.dev',
        subject: 'Thanks for joining the app!',
        text: `Welcome to the app, ${name}. Let me know how you get along with the app.`
    });
};

const sendCancellationEmail = (email, name)=>{
    sgMail.send({
        to: email,
        from: 'gagan@rapidinnovation.dev',
        subject: 'Sorry to see you go!',
        text: `Goodbye, ${name}. I hope to see you sometime soon.`
    });
};

module.exports = {
    sendWelcomeEmail,
    sendCancellationEmail
}
