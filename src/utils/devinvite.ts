import sendMail from './sendMail';

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
          name,
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
  sendMail(msg(to, link, name))
    .then(() => console.log(`email successfully sent to ${to}`))
    .catch(err => console.log({ err }));
}

export default devsMailInvite;
