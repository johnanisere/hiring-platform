import { Request } from 'express';
require('dotenv').config();

const sgMail = require('@sendgrid/mail');

sgMail.setApiKey(process.env.SENDGRID_API_KEY);

const msg = (to: string, token: string, link: string) => {
  return {
    from: {
      email: 'johnanisere@gmail.com',
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
          token: token,
          link: link,
          Sender_Name: 'Decagon Institute',
          Sender_Address:
            '2nd Floor Traditions Building Familoni Street, off Lekki - Epe Express',
          Sender_City: 'Lagos, Nigeria',
          Sender_Zip: '101233',
        },
      },
    ],
    template_id: 'd-cb7aa83d3f304115a1ae683442d6e1b9',
  };
};

async function sendSignUpMail(req: Request) {
  let to = req.body.email,
    token = req.body.token,
    link = 'https://hiringplatform/';
  sgMail.send(msg(to, token, link)).catch((err: any) => {
    console.log({ err: err.message });
  });
}

export default sendSignUpMail;
