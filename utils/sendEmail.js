import nodemailer from 'nodemailer';
const transporter = nodemailer.createTransport({
  host: 'smtp.gmail.com',
  port: 465,
  secure: true,
  auth: {
    user: process.env.EMAIL,
    pass: process.env.EMAIL_PASSWORD,
  },
});
const sendEmail = async (to, subject, text) => {
  // const mailOptions = {
  //   from: `"Natours" ${process.env.EMAIL}`,
  //   to,
  //   subject:`${subject} - ${Date.now()}`,
  //   text,
  // };
  // await transporter.sendMail(mailOptions);
  await transporter.sendMail({
    from: `"Natours" ${process.env.EMAIL}`,
    to,
    subject: `${subject} - ${Date.now()}`,
    text,
  });
};

export default sendEmail;
