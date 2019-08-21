import request from 'supertest';
import app from '../src/app';
import seedUsers from '../src/db/seed/index';

const { connectMongoDB, disconnectMongoDB } = require('../testSetup/mongodb');

beforeAll(async () => {
  await connectMongoDB();
  await seedUsers();
});

afterAll(() => disconnectMongoDB());

describe('interview route', () => {
  test('schedule interview', () => {
    return request(app)
      .post('/api/v1/interview/invite/')
      .send({
        hiringPartner: 'terragon@gmail.com',
        decaDev: 'esther@gmail.com',
        location: 'Victoria Island',
        startTime: '10am',
        endTime: '11am',
        description:
          'This is to inform you that you have been shortlisted for an interview',
        eventId: 'EI234',
      })
      .expect(res => {
        expect(Object.keys(res.body)).toContain('hiringPartner');
        expect(Object.keys(res.body)).toContain('decaDev');
        expect(Object.keys(res.body)).toContain('location');
        expect(Object.keys(res.body)).toContain('startTime');
        expect(Object.keys(res.body)).toContain('endTime');
        expect(Object.keys(res.body)).toContain('description');
        expect(Object.keys(res.body)).toContain('eventId');
      });
  });
});

describe('User Route', () => {
  test('Has a /api endpoint', () => {
    return request(app)
      .get('/api')
      .expect('Content-Type', /json/)
      .expect(200, { message: { hello: 'Hello World' } });
  });

  test('updates password', async () => {
    const user = await request(app)
      .post('/api/v1/users/login')
      .send({
        email: 'johndoe@example.com',
        password: 'mysecret2',
      });
    return request(app)
      .put('/api/v1/users/update-password/')
      .set('Authorization', `Bearer ${user.body.token}`)
      .send({
        newPassword: 'newsecret',
      })
      .expect(res => {
        expect(res.body).toEqual(
          expect.objectContaining({
            message: 'Password updated',
            updated: expect.objectContaining({
              email: 'johndoe@example.com',
              name: 'John Doe',
              phone: '08074583218',
            }),
          }),
        );
      });
  });

  test('Invite hiring partner', () => {
    return request(app)
      .post('/api/v1/users/hiring-partner/invite')
      .send({
        name: 'Flutterwave',
        email: 'careers@flutterwave.com',
        phone: '08074382109',
        password: 'password',
        profilePhoto:
          'https://res.cloudinary.com/demo/image/upload/w_150,h_150,c_thumb,g_fac...',
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
            profilePhoto: expect.any(String),
            token: expect.any(String),
            createdAt: expect.any(String),
            updatedAt: expect.any(String),
            id: expect.any(String),
            role: expect.any(String),
          }),
        );
      });
  });

  test('logs in users', () => {
    return request(app)
      .post('/api/v1/users/login')
      .send({
        email: 'careers@flutterwave.com',
        password: 'newsecret2',
      })
      .expect(res => {
        expect(res.body.error).toBe('wrong password');
      });
  });

  test('lists all decadevs', () => {
    return request(app)
      .get('/api/v1/users/decadevs')
      .expect(res => {
        expect(res.body.allDecadevs.length).toBe(7);

        expect(res.status).toBe(200);
        expect(Object.keys(res.body)).toContain('allDecadevs');
        expect(res.body.allDecadevs).toHaveLength(7);
      });
  });

  test('user can sign up', () => {
    return request(app)
      .post('/api/v1/users/signup')
      .send({
        name: 'Egbo Uchenna',
        email: 'egbouchennag@gmail.in',
        role: 'dev',
        phone: '08085743182',
        password: 'newPassword',
        profilePhoto: 'my profile_pic.',
      })
      .expect(res => {
        expect(res.status).toBe(200);
        expect(Object.keys(res.body)).toContain('message');
        expect(Object.keys(res.body)).toContain('newUser');
      });
  });

  test('logs in users', () => {
    return request(app)
      .post('/api/v1/users/login')
      .send({
        email: 'careers@flutterwave.com',
        password: 'newsecret2',
      })
      .expect(res => {
        expect(res.body.error).toBe('wrong password');
      });
  });
});
