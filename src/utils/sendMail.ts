import sgMail from '@sendgrid/mail';

sgMail.setApiKey(`${process.env.SENDGRID_API_KEY}`);

const sendMail = (msg: any) => sgMail.send(msg);

export default sendMail;
