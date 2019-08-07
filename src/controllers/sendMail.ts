import { Request } from 'express';
require('dotenv').config();

const sgMail = require('@sendgrid/mail');

sgMail.setApiKey(process.env.SENDGRID_API_KEY);

const msg = (to: String, password: String, link: String) => {
  return {
    from: {
      email: 'seyiogundijo32@gmail.com',
    },
    personalizations: [
      {
        to: [
          {
            email: to,
          },
        ],
        dynamic_template_data: {
          email: to,
          password: password,
          link: link,
          Sender_Name: 'Decagon Institute',
          Sender_Address:
            '2nd Floor Traditions Building Familoni Street, off Lekki - Epe Express',
          Sender_City: 'Lagos, Nigeria',
          Sender_Zip: '101233',
        },
      },
    ],
    template_id: 'd-41ea1953a3dc4cfabd666b5b92073602',
  };
};

async function sendInviteMail(req: Request) {
  let to = req.body.email,
    password = req.body.password,
    link = 'https://google.com';
  sgMail.send(msg(to, password, link)).catch((err: any) => {
    console.log({ err: err.response.body.errors });
  });
}

export default sendInviteMail;
