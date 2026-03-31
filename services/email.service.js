import sgMail from '@sendgrid/mail';

const sendEmail = async (to, subject, html) => {
  sgMail.setApiKey(process.env.SENDGRID_API_KEY); // pindah ke dalam function

  await sgMail.send({
    to,
    from: process.env.EMAIL_SENDER,
    subject,
    html,
  });
};

export default sendEmail;