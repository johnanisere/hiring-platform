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

  test('invite devs', async () => {
    return request(app)
      .post('/api/v1/invite/devs')
      .send({
        squadNo: 'Squad 1',
      })
      .expect(res => {
        expect(res.body).toEqual(
          expect.objectContaining({
            message: `Your invites have been sent to Squad 1`,
          }),
        );
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

  test('creates a user', () => {
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

  test('change password', () => {
    return request(app)
      .put('/api/v1/users/change-password/')
      .send({
        email: 'careers@flutterwave.com',
        newPassword: 'mynewpassword1',
        confirmPassword: 'mynewpassword1',
      })
      .expect(res => {
        expect(res.body).toEqual(
          expect.objectContaining({
            message: 'password updated successfully',
          }),
        );
      });
  });

  test('change password: Invalid email', () => {
    return request(app)
      .put('/api/v1/users/change-password/')
      .send({
        email: 'invalid@email.com',
        newPassword: 'mynewpassword1',
        confirmPassword: 'mynewpassword1',
      })
      .expect(res => {
        expect(res.body).toEqual(
          expect.objectContaining({
            message: 'user not found',
          }),
        );
      });
  });

  test("change password: They don't match", () => {
    return request(app)
      .put('/api/v1/users/change-password/')
      .send({
        email: 'careers@flutterwave.com',
        newPassword: 'mynewpassword1',
        confirmPassword: 'mynewpassword',
      })
      .expect(res => {
        expect(res.body).toEqual(
          expect.objectContaining({
            message: "password doesn't match",
          }),
        );
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
        expect(Object.keys(res.body)).toContain('output');
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
