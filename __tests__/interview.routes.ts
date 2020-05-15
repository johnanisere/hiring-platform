import request from 'supertest';
import app from '../src/app';

import seed from '../testSetup/seed/interviews';

const { connectMongoDB, disconnectMongoDB } = require('../testSetup/mongodb');

const credentials = {
  email: 'dola@example.com',
  password: 'mysecret',
};
const adminCredentials = {
  email: 'doe@example.com',
  password: 'mysecret2',
};

let interviewId: string;
let hirer;
let token: string;
let admin: any;

beforeAll(async () => {
  await connectMongoDB('interview-tests');

  await seed();

  hirer = await request(app)
    .post('/api/v1/hirer/login')
    .send(credentials);
  token = hirer.body.token;

  admin = await request(app)
    .post('/api/v1/users/login')
    .send(adminCredentials);
});

afterAll(() => disconnectMongoDB());

describe('interview route', () => {
  test('schedule interview', async () => {
    expect.assertions(3);

    const interview = await request(app)
      .post('/api/v1/interview/invite')
      .set('Authorization', `Bearer ${token}`)
      .send({
        hiringPartner: 'dola@example.com',
        decaDev: 'interviewed@example.com',
        location: 'Victoria Island',
        startTime: '10am',
        endTime: '11am',
        startDate: 'wed, 1st oct 2020',
        endDate: 'wed, 1st oct 2020',
        description:
          'This is to inform you that you have been shortlisted for an interview',
        nameOfOrg: 'Paystack',
      })
      .expect(res => {
        const { id, ...rest } = res.body.interviewData;

        expect(res.status).toBe(200);
        expect(res.body).toEqual(
          expect.objectContaining({
            interviewData: expect.objectContaining({
              hiringPartner: expect.any(String),
              decaDev: expect.any(String),
              location: expect.any(String),
              startTime: expect.any(String),
              endTime: expect.any(String),
              description: expect.any(String),
              id: expect.any(String),
              startDate: expect.any(String),
              endDate: expect.any(String),
              scheduled: expect.any(String),
            }),
            message: "Interview has been sent to Decadev's email",
          }),
        );

        expect(rest).toMatchSnapshot();
      });
    interviewId = interview.body.interviewData.id;
  });
  test('Gets all Interviews', async () => {
    expect.assertions(2);
    return request(app)
      .get('/api/v1/interview/get-interviews')
      .set('Authorization', `Bearer ${admin.body.token}`)
      .expect(res => {
        expect(res.status).toBe(200);
        expect(Object.keys(res.body)).toContain('allInterviews');
      });
  });
  test('Adds Reason for interview decline', async () => {
    expect.assertions(2);
    return await request(app)
      .put('/api/v1/interview/why-decline/')
      .send({
        interviewId: interviewId,
        declineReason: 'Time Conflict',
      })
      .expect(res => {
        expect(res.status).toBe(200);
        expect(res.body).toEqual(
          expect.objectContaining({
            message: 'Interview Invitation has been declined',
          }),
        );
      });
  });
});
