require('dotenv').config();

const sgMail = require('@sendgrid/mail');

sgMail.setApiKey(process.env.SENDGRID_API_KEY);

const msg = (to: string, link: string, name: string) => {
  return {
    from: {
      email: 'johndoe@example.com',
    },
    personalizations: [
      {
        to: [
          {
            email: to,
          },
        ],
        dynamic_template_data: {
          Sender_Name: 'Decagon Institute',
          Sender_Address:
            '2nd Floor Traditions Building Familoni Street, off Lekki - Epe Express',
          Sender_City: 'Lagos, Nigeria',
          Sender_Zip: '101233',
          link,
          name: name,
          Sender_State: 'Lagos',
        },
      },
    ],
    template_id: 'd-9e036570cbe24c15a8ca34bba221927a',
  };
};

async function devsMailInvite(token: string, name: string, email: string) {
  let to = email,
    link = `https://google.com/${token}`;

  sgMail.send(msg(to, link, name), (error: any) => {
    if (error) {
      console.log({ err: error });
    } else {
      console.log(`email successfully sent to ${to}`);
    }
  });
}

export default devsMailInvite;
