const nodemailer = require('nodemailer');

const transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: "altonya50050@gmail.com",
    pass: "dejk wagb okfo zbwa",
  },
  tls: {
    rejectUnauthorized: false,
  },
});

exports.sendResetCode = async (to, code) => {
  const mailOptions = {
    from: "altonya50050@gmail.com",
    to,
    subject: 'رمز التحقق',
    html: `<h3>كود استعادة  التحقق:</h3><p style="font-size:18px;"><b>${code}</b></p><p>الكود صالح لمدة 5 دقائق فقط.</p>`,
  };

  await transporter.sendMail(mailOptions);
};
