import { Request } from 'express';
import sendMail from './sendMail';

const msg = (to: String, name: String, link: String) => {
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
          name: name,
          link: link,
          Sender_Name: 'Decagon Institute',
          Sender_Address:
            '2nd Floor Traditions Building Familoni Street, off Lekki - Epe Express',
          Sender_City: 'Lagos, Nigeria',
          Sender_Zip: '101233',
        },
      },
    ],
    template_id: 'd-738d7d0623174e42874ad0ad442bc867',
  };
};

async function accountActivateMail(req: Request) {
  let to = req.body.email,
    name = req.body.name,
    link = `${process.env.CLIENT_URL}/login/partner`;
  await sendMail(msg(to, name, link));
}

export default accountActivateMail;
