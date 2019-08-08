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
        role: 'Hiring Partner',
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
            role: expect.any(String),
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

  test('lists all decadevs', () => {
    return request(app)
      .get('/api/v1/users/decadevs')
      .expect(res => {
        expect(res).toEqual(
          expect.objectContaining({
            email: 'janedoe@example.com',
            name: 'Jane Mary',
            phone: '08067890545',
            password: 'mysecret',
            role: 'dev',
            profilePhoto: 'http://gravatar.com/profile_photo-1',
            cv: 'resume-1',
            bio: 'A very good dev',
          }),
        );
      });
  });

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
