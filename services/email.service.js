import sgMail from "@sendgrid/mail"

sgMail.setApiKey(process.env.SENDGRID_API_KEY)

export const sendEmail = async (to, subject, html) => {
  try {
    const msg = {
      to,
      from: process.env.EMAIL_SENDER,
      subject,
      html
    }

    await sgMail.send(msg)
    console.log("Email sent successfully")
  } catch (error) {
    console.error("Error sending email:", error.message)
    throw error
  }
}