import { Request } from 'express';
import sendMail from './sendMail';
import { IUser } from '../models/User';

const msg = (
  to: String,
  accept: String,
  decline: String,
  name: String,
  location: String,
  startTime: String,
  endTime: String,
  description: String,
  hiringPartner: String,
  nameOfOrg: String,
) => {
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
          accept: accept,
          decline: decline,
          name: name,
          location: location,
          startTime: startTime,
          endTime: endTime,
          description: description,
          hiringPartner: hiringPartner,
          nameOfOrg: nameOfOrg,
          Sender_Name: 'Decagon Institute',
          Sender_Address:
            '2nd Floor Traditions Building Familoni Street, off Lekki - Epe Express',
          Sender_City: 'Lagos, Nigeria',
          Sender_Zip: '101233',
        },
      },
    ],
    template_id: 'd-28d59e0765744f83a9c7d7469e035372',
  };
};

async function interviewInvitationMail(req: Request, decaDev: IUser) {
  let to = req.body.decaDev,
    accept = 'google.com',
    decline = 'google.com',
    name = decaDev.name,
    location = req.body.location,
    startTime = req.body.startTime,
    endTime = req.body.endTime,
    description = req.body.description,
    hiringPartner = req.body.hiringPartner,
    nameOfOrg = req.body.nameOfOrg;

  await sendMail(
    msg(
      to,
      accept,
      decline,
      name,
      location,
      startTime,
      endTime,
      description,
      hiringPartner,
      nameOfOrg,
    ),
  );
}

export default interviewInvitationMail;
