import request from 'supertest';

import app from '../src/app';

const {
  connectMongoDB,
  disconnectMongoDB,
} = require('../testSetup/mongodb.js');

beforeAll(async () => await connectMongoDB());

afterAll(() => disconnectMongoDB());

describe('User Route', () => {
  test('Has a /api endpoint', () => {
    return request(app)
      .get('/api')
      .expect('Content-Type', /json/)
      .expect(200, { message: { hello: 'Hello World' } });
  });

  test('creates a user', () => {
    return request(app)
      .post('/api/v1/users/hiring-partner/invite')
      .send({
        name: 'Flutterwave',
        email: 'careers@flutterwave.com',
        phone: '08074382109',
        password: 'password',
      })
      .expect(res => {
        expect(res.body).toEqual(
          expect.objectContaining({
            _id: expect.any(String),
            name: 'Flutterwave',
            email: 'careers@flutterwave.com',
            password: expect.any(String),
            phone: expect.any(String),
            token: expect.any(String),
            createdAt: expect.any(String),
            updatedAt: expect.any(String),
            id: expect.any(String),
          }),
        );
      });
  });

  test('updates password', () => {
    return request(app)
      .put('/api/v1/users/update-password/')
      .send({
        email: 'careers@flutterwave.com',
        newPassword: 'newsecret',
      })
      .expect(res => {
        expect(res.body).toEqual(
          expect.objectContaining({
            message: 'Password updated',
            updated: expect.objectContaining({
              email: 'careers@flutterwave.com',
              name: 'Flutterwave',
              phone: '08074382109',
            }),
          }),
        );
      });
  });
  test('schedule interview', () => {
    return request(app)
      .post('/api/v1/interview/invite/:userId')
      .send({
        hiringPartner: 'terragon@gmail.com',
        decaDev: 'esther@gmail.com',
        location: 'Victoria Island',
        time: '10am',
        description:
          'This is to inform you that you have been shortlisted for an interview',
      })
      .expect(res => {
        expect(Object.keys(res.body)).toContain('hiringPartner');
        expect(Object.keys(res.body)).toContain('decaDev');
        expect(Object.keys(res.body)).toContain('location');
        expect(Object.keys(res.body)).toContain('time');
        expect(Object.keys(res.body)).toContain('description');
      });
  });
});
