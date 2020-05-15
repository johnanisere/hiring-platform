import request from 'supertest';

import app from '../src/app';
import seed from '../testSetup/seed/decadev';

const {
  connectMongoDB,
  disconnectDecadevMongoDB,
} = require('../testSetup/mongodb');

const credentials = {
  email: 'doe@example.com',
  password: 'mysecret2',
};
const decadevCredentials = {
  email: 'decadev@example.com',
  password: 'mysecret2',
};

let admin: any;
let token: string;
let decadev: any;
let decadevToken: string;

beforeAll(async () => {
  await connectMongoDB('dev-test');
  await seed();

  admin = await request(app)
    .post('/api/v1/users/login')
    .send(credentials);

  token = admin.body.token;

  decadev = await request(app)
    .post('/api/v1/users/login')
    .send(decadevCredentials);

  decadevToken = decadev.body.token;
});

afterAll(async () => await disconnectDecadevMongoDB());

describe('/users/hire-dev', () => {
  test('Responsds with status code 200 and Object containing message', async () => {
    expect.assertions(3);

    return request(app)
      .put('/api/v1/users/hire-dev')
      .set('Authorization', `Bearer ${token}`)
      .send({
        email: 'decadev@example.com',
        hired: true,
      })
      .then(res => {
        expect(res.status).toBe(200);
        expect(res.body).toEqual(
          expect.objectContaining({ message: expect.any(String) }),
        );
        expect(res.body).toMatchSnapshot();
      });
  });
  test('Responsds with status code 404 and Object containing message "decadev not found!"', async () => {
    expect.assertions(3);

    return request(app)
      .put('/api/v1/users/hire-dev')
      .set('Authorization', `Bearer ${token}`)
      .send({
        email: 'wrongdecadev@example.com',
        hired: true,
      })
      .then(res => {
        expect(res.status).toBe(404);
        expect(res.body).toEqual(
          expect.objectContaining({ message: 'decadev not found!' }),
        );
        expect(res.body).toMatchSnapshot();
      });
  });
  test('Responds with status code 200 and Object containing message "Jane Mary has been added back to the platform" where "hired" is false', async () => {
    expect.assertions(3);

    return request(app)
      .put('/api/v1/users/hire-dev')
      .set('Authorization', `Bearer ${token}`)
      .send({
        email: 'decadev@example.com',
        hired: false,
      })
      .then(res => {
        expect(res.status).toBe(200);
        expect(res.body).toEqual(
          expect.objectContaining({
            message: 'Jane Mary has been added back to the platform',
          }),
        );
        expect(res.body).toMatchSnapshot();
      });
  });
});
describe('/users/update-password/', () => {
  test('Responds with status 200 and message', async () => {
    expect.assertions(3);
    return request(app)
      .put('/api/v1/users/update-password')
      .set('Authorization', `Bearer ${decadevToken}`)
      .send({
        password: 'logmein',
        confirmPassword: 'logmein',
        email: decadevCredentials.email,
      })
      .then(res => {
        expect(res.status).toBe(200);
        expect(res.body).toEqual(
          expect.objectContaining({
            message: 'Password updated',
          }),
        );
        expect(res.body).toMatchSnapshot();
      });
  });
  test('Responds with status 200 and message "User not found!!!" if password is wrong', async () => {
    expect.assertions(3);
    return request(app)
      .put('/api/v1/users/update-password')
      .set('Authorization', `Bearer ${decadevToken}`)
      .send({
        password: 'logmein',
        confirmPassword: 'logmein',
        email: 'dayus@example.com',
      })
      .then(res => {
        expect(res.status).toBe(200);
        expect(res.body).toEqual(
          expect.objectContaining({
            message: 'User not found!!!',
          }),
        );
        expect(res.body).toMatchSnapshot();
      });
  });
});
