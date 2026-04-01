import sgMail from '@sendgrid/mail'

const sendEmail = async (to, subject, html) => {
  sgMail.setApiKey(process.env.SENDGRID_API_KEY)

  await sgMail.send({
    to,
    from: process.env.SENDER_EMAIL,
    subject,
    html,
  })
}

export default sendEmail