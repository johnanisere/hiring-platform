import sendMail from './sendMail';

const msg = (to: String, link: String, name: String, id: String) => {
  return {
    from: {
      email: 'help@decagon.institute',
    },
    personalizations: [
      {
        to: [
          {
            email: to,
          },
        ],
        dynamic_template_data: {
          link: link,
          name: name,
          Sender_Name: 'Decagon Institute',
          Sender_Address:
            '2nd Floor Traditions Building Familoni Street, off Lekki - Epe Express',
          Sender_City: 'Lagos, Nigeria',
          Sender_Zip: '101233',
          id: id,
        },
      },
    ],
    template_id: 'd-23acd9e1f7284e6090f1ad4cbb04d473',
  };
};

async function feedbackMail(email: String, decadev: String, id: String) {
  let to = email,
    link = 'https://www.google.com',
    name = decadev;
  id = id;

  await sendMail(msg(to, link, name, id));
}

export default feedbackMail;
