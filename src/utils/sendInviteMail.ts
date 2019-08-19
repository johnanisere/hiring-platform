import { Request } from 'express';
import sendMail from './sendMail';

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
    template_id: 'd-cea941da06044978bffc59af79d57157',
  };
};

async function sendInviteMail(req: Request) {
  let to = req.body.email,
    password = req.body.password,
    link = 'https://google.com';
  await sendMail(msg(to, password, link));
}

export default sendInviteMail;
