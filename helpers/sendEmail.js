import nodemailer from "nodemailer"; // Підключення за допомогою поштового сервера замовника

const { META_PASSWORD } = process.env;

const nodemailerConfig = {
  host: "smtp.meta.ua",
  port: 465, //25, 465, 2525
  secure: true,
  auth: {
    user: "serhii.repinskyi@meta.ua",
    pass: META_PASSWORD,
  },
};

const transporter = nodemailer.createTransport(nodemailerConfig);

const sendEmail = async (data) => {
  const emailOptions = { ...data, from: "serhii.repinskyi@meta.ua" };
  await transporter.sendMail(emailOptions); // відправлення листа
  return true;
};

// const emailOptions = {
//   to: "test@example.com",
//   from: "serhii.repinskyi@meta.ua",
//   subject: "Test email",
//   html: "<p><strong>Test email</strong> from localhost:3000</p>",
// };

// transporter
//   .sendMail(emailOptions)
//   .then(() => console.log("Email send success"))
//   .catch((error) => console.log(error.message));

export default sendEmail;
