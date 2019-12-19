import { Request } from 'express';
import sendMail from './sendMail';
import { IUser } from '../models/User';

const msg = (
  to: String,
  name: String,
  duration: String,
  location: String,
  description: String,
  hiringPartner: String,
  nameOfOrg: String,
  testUrl: String,
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
          name: name,
          duration: duration,
          location: location,
          description: description,
          hiringPartner: hiringPartner,
          nameOfOrg: nameOfOrg,
          testUrl: testUrl,
          Sender_Name: 'Decagon Institute',
          Sender_Address:
            '2nd Floor Traditions Building Familoni Street, off Lekki - Epe Express',
          Sender_City: 'Lagos, Nigeria',
          Sender_Zip: '101233',
          id: id,
        },
      },
    ],
    template_id: 'd-0c455d65d56d4c0ca4c2c9b47f29f007',
  };
};

async function scheduleTestMail(
  req: Request,
  decaDev: IUser,
  testDuration: String,
  id: String,
) {
  let to = req.body.decaDev,
    name = decaDev.name,
    duration = testDuration,
    location = req.body.location,
    description = req.body.description,
    hiringPartner = req.body.hiringPartner,
    nameOfOrg = req.body.nameOfOrg,
    testUrl = req.body.testUrl,
    devID = id;

  await sendMail(
    msg(
      to,
      name,
      duration,
      location,
      description,
      hiringPartner,
      nameOfOrg,
      testUrl,
      devID,
    ),
  );
}

export default scheduleTestMail;
