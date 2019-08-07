import { Request } from 'express';

// const sgMail = require('../send-grid/send-mail');
const sgMail = require('@sendgrid/mail');

sgMail.setApiKey(
  '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',
);

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
  sgMail
    .send(msg(to, password, link))
    .then((res: any) => {
      console.log({ res: res[0].IncomingMessage });
    })
    .catch((err: any) => {
      console.log({ err: err.response.body.errors });
    });
  try {
    // sgMail.send(msg(to, password, link));
  } catch (err) {
    console.log(msg(to, password, link));
    // console.log({ err });
  }
}

export default sendInviteMail;
