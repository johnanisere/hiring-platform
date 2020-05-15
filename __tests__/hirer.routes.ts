import request from 'supertest';

import app from '../src/app';
import seed from '../testSetup/seed/hirer';

const { connectMongoDB, disconnectMongoDB } = require('../testSetup/mongodb');

const newHirer = {
  name: 'Hirer3 Test',
  email: 'hire3@example.com',
  nameOfOrg: 'Sample Ltd',
  designation: 'SPO',
  industry: 'Technology',
  phone: '+23450987897',
  numberOfTalentsRequired: '1-5',
  deadline: "Let's Talk First",
  verified: 'false',
  active: 'false',
  password: 'mysecret',
  interestLanguage: [],
};

const adminCredentials = {
  email: 'doe@example.com',
  password: 'mysecret2',
};
const credentials = {
  email: 'dola@example.com',
  password: 'mysecret',
};

let admin;
let token: string;

beforeAll(async () => {
  await connectMongoDB('hirer-tests');
  await seed();

  admin = await request(app)
    .post('/api/v1/users/login')
    .send(adminCredentials);

  token = admin.body.token;
});

afterAll(async () => await disconnectMongoDB());

describe('Hirer Routes ==> api/v1/hirer/', () => {
  test('/hirer/signup', async () => {
    expect.assertions(3);
    return request(app)
      .post('/api/v1/hirer/signup')
      .send(newHirer)
      .expect(res => {
        expect(res.status).toBe(200);
        expect(Object.keys(res.body)).toContain('message');
        expect(Object.keys(res.body)).toContain('token');
      });
  });
  test('/hirer/login', async () => {
    expect.assertions(4);
    return request(app)
      .post('/api/v1/hirer/login')
      .send(credentials)
      .expect(res => {
        expect(res.status).toBe(200);
        expect(Object.keys(res.body)).toContain('token');
        expect(Object.keys(res.body)).toContain('email');
        expect(Object.keys(res.body)).toContain('name');
      });
  });
  test('/hirer/unactivated', async () => {
    expect.assertions(2);
    return request(app)
      .get('/api/v1/hirer/unactivated')
      .set('Authorization', `Bearer ${token}`)
      .expect(res => {
        expect(res.status).toBe(200);
        expect(res.body).toEqual(expect.arrayContaining([expect.any(Object)]));
      });
  });
  test('/hirer/activated', async () => {
    expect.assertions(2);
    return request(app)
      .get('/api/v1/hirer/activated')
      .set('Authorization', `Bearer ${token}`)
      .expect(res => {
        expect(res.status).toBe(200);
        expect(res.body).toEqual(expect.arrayContaining([expect.any(Object)]));
      });
  });

  test('/hirer/activatehirer', () => {
    expect.assertions(1);
    return request(app)
      .put('/api/v1/hirer/activatehirer')
      .set('Authorization', `Bearer ${token}`)
      .send({
        email: 'hirer2@example.com',
        name: 'Paystack',
        active: false,
      })
      .expect(res => {
        expect(res.body).toEqual({
          message: 'Paystack has been activated!',
        });
      });
  });
  test('/hirer/verifyhirer', () => {
    expect.assertions(1);
    return request(app)
      .put('/api/v1/hirer/verifyhirer')
      .send({
        email: 'hirer2@example.com',
        name: 'Paystack',
      })
      .expect(res => {
        expect(res.body).toEqual({
          message:
            "hirer2@example.com, your account has been verified! You'll only be able to log into your account after it has been activated, please wait until you hear from us soon.",
        });
      });
  });
});
