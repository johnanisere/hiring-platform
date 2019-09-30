import { Request } from 'express';
import sendMail from './sendMail';

const msg = (to: string, link: string, name: string) => {
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
          name,
          link,
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
    name = req.body.name,
    link = `http://localhost:3000/verify-hirer/${token}/${req.body.email}`;
  sendMail(msg(to, link, name));
}

export default sendSignUpMail;
