import dotenv from 'dotenv';
dotenv.config();


import sendEmail from './email.service.js';
console.log(process.env.SENDGRID_API_KEY);
(async () => {
  try {
    await sendEmail(
      'simpaninid@gmail.com',
      'TEST SENDGRID',
      '<h1>Berhasil 🚀</h1>'
    );

    console.log('Email berhasil dikirim!');
  } catch (error) {
    console.error(error);
  }
})();