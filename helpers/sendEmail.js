import nodemailer from "nodemailer"; // Підключення за допомогою поштового сервера замовника

const { UKR_NET_EMAIL, UKR_NET_PASSWORD } = process.env;

const nodemailerConfig = {
  host: "smtp.ukr.net", // адреса поштового сервісу
  port: 465, //25, 465, 2525
  secure: true,
  auth: {
    user: UKR_NET_EMAIL,
    pass: UKR_NET_PASSWORD,
  },
};

const transporter = nodemailer.createTransport(nodemailerConfig);

// const emailOptions = {
//   to: "test@example.com",
//   from: "serhii.repinskyi@meta.ua",
//   subject: "Test email",
//   html: "<p><strong>Test email</strong> from localhost:3000</p>",
// };

const sendEmail = async (data) => {
  const emailOptions = { ...data, from: UKR_NET_EMAIL };
  await transporter.sendMail(emailOptions); // відправлення листа
  return true;
};

// transporter
//   .sendMail(emailOptions)
//   .then(() => console.log("Email send success"))
//   .catch((error) => console.log(error.message));

export default sendEmail;
