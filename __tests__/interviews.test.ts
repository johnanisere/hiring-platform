import request from 'supertest';
import Interviews from '../src/models/Interviews';
import app from '../src/app';

const { connectMongoDB, disconnectMongoDB } = require('../testSetup/mongodb');

beforeAll(async () => await connectMongoDB());

afterAll(() => disconnectMongoDB());

describe('interview route', () => {
  test('schedule interview', () => {
    return request(app)
      .post('/api/v1/interview/invite/')
      .send({
        hiringPartner: 'terragon@gmail.com',
        decaDev: 'esther@gmail.com',
        location: 'Victoria Island',
        time: '10am',
        description:
          'This is to inform you that you have been shortlisted for an interview',
        profilePhoto:
          'https://res.cloudinary.com/demo/image/upload/w_150,h_150,c_thumb,g_fac...',
      })
      .expect(res => {
        expect(Object.keys(res.body)).toContain('hiringPartner');
        expect(Object.keys(res.body)).toContain('decaDev');
        expect(Object.keys(res.body)).toContain('location');
        expect(Object.keys(res.body)).toContain('time');
        expect(Object.keys(res.body)).toContain('description');
      });
  });

  test('accept interview', async () => {
    let id;
    const interview = new Interviews({
      hiringPartner: 'google@gmail.com',
      decaDev: 'chukky@gmail.com',
      location: 'Ikeja',
      time: '9am',
      description:
        'This is to inform you that you have been shortlisted for an interview',
      profilePhoto:
        'https://res.cloudinary.com/demo/image/upload/w_150,h_150,c_thumb,g_fac...',
    });

    const savedInterview = await interview.save();

    id = savedInterview._id;

    return request(app)
      .put(`/api/v1/interview/invite/${id}`)
      .send({ accepted: true })
      .expect(res => {
        expect(Object.keys(res.body.interview)).toContain('accepted');
        expect(Object.keys(res.body.interview)).toContain('hiringPartner');
      });
  });
});
