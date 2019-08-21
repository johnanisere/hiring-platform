import sgMail from '@sendgrid/mail';

sgMail.setApiKey(`${process.env.SENDGRID_API_KEY}`);

const sendMail = async (msg: any) => {
  try {
    await sgMail.send(msg);
  } catch (err) {
    console.error({ err });
  }
};

export default sendMail;
