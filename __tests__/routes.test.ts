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
        hiringPartner: 'hiringpartner1@example.com',
        decaDev: 'anewuser03@example.com',
        location: 'Victoria Island',
        startTime: '10am',
        endTime: '11am',
        description:
          'This is to inform you that you have been shortlisted for an interview',
        nameOfOrg: 'Paystack',
      })
      .expect(res => {
        expect(res.body).toEqual(
          expect.objectContaining({
            hiringPartner: expect.any(String),
            decaDev: expect.any(String),
            location: expect.any(String),
            startTime: expect.any(String),
            endTime: expect.any(String),
            description: expect.any(String),
            id: expect.any(String),
          }),
        );
      });
  }, 30000);
});

describe('User Route', () => {
  test('Has a /api endpoint', () => {
    return request(app)
      .get('/api')
      .expect('Content-Type', /json/)
      .expect(200, { message: { hello: 'Hello World' } });
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
        expect(res.body.allDecadevs.length).toBe(4);

        expect(res.status).toBe(200);
        expect(Object.keys(res.body)).toContain('allDecadevs');
        expect(res.body.allDecadevs).toHaveLength(4);
      });
  });

  test('lists female decadevs', async () => {
    const gender = 'female';
    const decadevs = await request(app).get(
      `/api/v1/users/decadevs?gender=${gender}`,
    );

    for (let i = 0; i < JSON.parse(decadevs.text).allDecadevs.length; i++) {
      expect(JSON.parse(decadevs.text).allDecadevs[i]).toHaveProperty(
        'gender',
        'female',
      );
    }
  });

  test('lists male decadevs', async () => {
    const gender = 'male';
    const decadevs = await request(app).get(
      `/api/v1/users/decadevs?gender=${gender}`,
    );

    for (let i = 0; i < JSON.parse(decadevs.text).allDecadevs.length; i++) {
      expect(JSON.parse(decadevs.text).allDecadevs[i]).toHaveProperty(
        'gender',
        'male',
      );
    }
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

describe('Hiring Partners Verification', () => {
  test('SignUp an hiring Partner', () => {
    return request(app)
      .post('/api/v1/hirer/signup')
      .send({
        name: 'Shola',
        email: 'sheyiogundijo@gmail.com',
        nameOfOrg: 'GTB',
        designation: 'CTO',
        Website: 'www.GTB.com',
        phone: '08066589871',
        numberOfTalentsRequired: '1-5',
        deadline: "Let's Talk First",
        password: 'mysecret2',
      })
      .expect(res => {
        expect(res.body).toEqual(
          expect.objectContaining({
            message:
              'Success!. An email has been sent to you. Please click link to verify your account.',
            token: expect.any(String),
            data: {
              __v: expect.any(Number),
              _id: expect.any(String),
              name: 'Shola',
              email: 'sheyiogundijo@gmail.com',
              nameOfOrg: 'GTB',
              designation: 'CTO',
              phone: '08066589871',
              numberOfTalentsRequired: '1-5',
              deadline: "Let's Talk First",

              createdAt: expect.any(String),
              active: false,
              verified: expect.any(Boolean),
              updatedAt: expect.any(String),
              password: expect.any(String),
            },
          }),
        );
      });
  });
  test('get all unactivated hirers', () => {
    return request(app)
      .get('/api/v1/hirer/unactivated')
      .expect(res => {
        expect(res.status).toBe(200);
        expect(res.body).toEqual(
          expect.arrayContaining([
            expect.objectContaining({
              __v: 0,
              _id: expect.any(String),
              name: 'Shola',
              createdAt: expect.any(String),
              deadline: "Let's Talk First",
              designation: 'CTO',
              email: 'sheyiogundijo@gmail.com',
              active: false,
              verified: expect.any(Boolean),
              nameOfOrg: 'GTB',
              numberOfTalentsRequired: '1-5',
              phone: '08066589871',
              updatedAt: expect.any(String),
            }),
          ]),
        );
      });
  });

  test('Admin can activate an hiringPartner', () => {
    return request(app)
      .put('/api/v1/hirer/activatehirer')
      .send({
        email: 'sheyiogundijo@gmail.com',
        name: 'GTB',
        active: false,
      })
      .expect(res => {
        expect(res.body).toEqual({
          message: 'GTB has been activated!',
        });
      });
  });
  test('Hiring Partner can login', () => {
    return request(app)
      .post('/api/v1/hirer/login')
      .send({
        email: 'sheyiogundijo@gmail.com',
        password: 'mysecret2',
      })
      .expect(res => {
        expect(res.body).toEqual({
          verified: expect.any(Boolean),
          active: expect.any(Boolean),
          email: 'sheyiogundijo@gmail.com',
          name: expect.any(String),
          phone: expect.any(String),
          nameOfOrg: expect.any(String),
          designation: expect.any(String),
          numberOfTalentsRequired: expect.any(String),
          deadline: expect.any(String),
          token: expect.any(String),
        });
      });
  });
});
