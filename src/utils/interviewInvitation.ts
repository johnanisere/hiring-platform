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
  startDate: String,
  endDate: String,
  description: String,
  hiringPartner: String,
  nameOfOrg: String,
  id: String,
) => {
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
          accept: accept,
          decline: decline,
          name: name,
          location: location,
          startTime: startTime,
          endTime: endTime,
          startDate: startDate,
          endDate: endDate,
          description: description,
          hiringPartner: hiringPartner,
          nameOfOrg: nameOfOrg,
          Sender_Name: 'Decagon Institute',
          Sender_Address:
            '2nd Floor Traditions Building Familoni Street, off Lekki - Epe Express',
          Sender_City: 'Lagos, Nigeria',
          Sender_Zip: '101233',
          id: id,
        },
      },
    ],
    template_id: 'd-28d59e0765744f83a9c7d7469e035372',
  };
};

async function interviewInvitationMail(
  req: Request,
  decaDev: IUser,
  id: String,
) {
  let to = req.body.decaDev,
    accept = `${process.env.CLIENT_URL}/interview-response/${true}/${
      req.body.decaDev
    }/${id}`,
    decline = `${process.env.CLIENT_URL}/interview-response/${false}/${
      req.body.decaDev
    }/${id}`,
    name = decaDev.name,
    location = req.body.location,
    startTime = req.body.startTime,
    endTime = req.body.endTime,
    startDate = req.body.startDate,
    endDate = req.body.endDate,
    description = req.body.description,
    hiringPartner = req.body.hiringPartner,
    nameOfOrg = req.body.nameOfOrg,
    devID = id;

  await sendMail(
    msg(
      to,
      accept,
      decline,
      name,
      location,
      startTime,
      endTime,
      startDate,
      endDate,
      description,
      hiringPartner,
      nameOfOrg,
      devID,
    ),
  );
}

export default interviewInvitationMail;
