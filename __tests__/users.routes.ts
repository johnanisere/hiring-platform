import request from 'supertest';

import app from '../src/app';
import seed from '../testSetup/seed/users';

const { connectMongoDB, disconnectMongoDB } = require('../testSetup/mongodb');

const credentials = {
  email: 'doe@example.com',
  password: 'mysecret2',
};
const hirerCredentials = {
  email: 'dola@example.com',
  password: 'mysecret',
};
const credentials2 = {
  email: 'doe@example.com',
  password: 'mysecret222',
};
const decadevCredentials = {
  email: 'decadev-user@example.com',
  password: 'mysecret',
};

let hirer: any;
let hirerToken: string;
let decadev: any;
let decadevToken: string;
let employmentId: string;
let skillId: string;
let projectId: string;

beforeAll(async () => {
  await connectMongoDB('users-test');
  await seed();

  hirer = await request(app)
    .post('/api/v1/hirer/login')
    .send(hirerCredentials);

  hirerToken = hirer.body.token;

  decadev = await request(app)
    .post('/api/v1/users/login')
    .send(decadevCredentials);

  decadevToken = decadev.body.token;
});

afterAll(async () => await disconnectMongoDB());

describe('/users/', () => {
  test('/users/login', async () => {
    expect.assertions(4);
    return request(app)
      .post('/api/v1/users/login')
      .send(credentials)
      .expect(res => {
        expect(res.status).toBe(200);
        expect(Object.keys(res.body)).toContain('token');
        expect(Object.keys(res.body)).toContain('email');
        expect(Object.keys(res.body)).toContain('name');
      });
  });
  test('/users/login ==> Returns wrong password if password is wrong', async () => {
    expect.assertions(1);
    return request(app)
      .post('/api/v1/users/login')
      .send(credentials2)
      .expect(res => {
        expect(res.body.error).toBe('wrong password');
      });
  });

  test('lists java decadevs', async () => {
    expect.assertions(1);
    const pod = 'java';
    const decadevs = await request(app)
      .get(`/api/v1/users/decadevs?pod=${pod}`)
      .set('Authorization', `Bearer ${hirerToken}`);

    for (let i = 0; i < JSON.parse(decadevs.text).allDecadevs.length; i++) {
      expect(JSON.parse(decadevs.text).allDecadevs[i]).toHaveProperty(
        'pod',
        'java',
      );
    }
  });

  test('lists nodejs decadevs', async () => {
    expect.assertions(1);
    const pod = 'nodejs';
    const decadevs = await request(app)
      .get(`/api/v1/users/decadevs?pod=${pod}`)
      .set('Authorization', `Bearer ${hirerToken}`);

    for (let i = 0; i < JSON.parse(decadevs.text).allDecadevs.length; i++) {
      expect(JSON.parse(decadevs.text).allDecadevs[i]).toHaveProperty(
        'pod',
        'nodejs',
      );
    }
  });
});

describe('Updates Decadev Profile', () => {
  test('Updates profile/contact details of Decadevs', async () => {
    expect.assertions(7);
    return request(app)
      .put(`/api/v1/users/update/userInfo/${decadevCredentials.email}`)
      .set('Authorization', `Bearer ${decadevToken}`)
      .send({
        name: 'Jane Mary Lala',
        location: 'Lagos',
        profilePhoto:
          'https://encq=tbn:ANd9GcSIcqjP8a8EfGrtkCX0CJXJ4HRltM5u8Jdhkz_TneWdb4rfPsMi',
        bio: 'A very good dev',
        github: 'https://github.com',
        linkedIn: 'https://linkedin.com/in/oluwaseyi-ogundijo-a29699195',
        stackOverflow: 'https://stackoverflow.com',
        website: 'https://www.google.com/',
      })
      .expect(res => {
        expect(res.body.message).toEqual(expect.any(String));
        expect(Object.keys(res.body)).toContain('message');
        expect(Object.keys(res.body)).toContain('user');

        expect(Object.keys(res.body.user)).toContain('bio');
        expect(Object.keys(res.body.user)).toContain('github');
        expect(Object.keys(res.body.user)).toContain('email');
        expect(Object.keys(res.body.user)).toContain('phone');
      });
  });

  test('Adds new employment details of Decadevs', async () => {
    expect.assertions(7);
    return request(app)
      .put(`/api/v1/users/update/new-employment/${decadevCredentials.email}`)
      .set('Authorization', `Bearer ${decadevToken}`)
      .send({
        achievements: [
          'Built a language-learning app for Arabic learners in AngularJS',
          "Constructed a reporting tool so administrators could see their students' progress in real-time.",
          'Developed custom AngularJS services and corresponding tests.',
          'Created custom exact-target email templates and data extensions, and a tool to allow administrators to email users at the click of a button.',
        ],
        title: 'CTO',
        location: 'Googlee',
        duration: '2018 (9 months)',
      })
      .expect(res => {
        employmentId = res.body.user.employments[0]._id;
        expect(res.body.message).toEqual(expect.any(String));
        expect(Object.keys(res.body)).toContain('message');
        expect(Object.keys(res.body)).toContain('user');

        expect(Object.keys(res.body.user)).toContain('bio');
        expect(Object.keys(res.body.user)).toContain('github');
        expect(Object.keys(res.body.user)).toContain('email');
        expect(Object.keys(res.body.user)).toContain('phone');
      });
  });

  test('Adds new skill details of Decadevs', async () => {
    expect.assertions(8);
    return request(app)
      .put(`/api/v1/users/update/new-skill/${decadevCredentials.email}`)
      .set('Authorization', `Bearer ${decadevToken}`)
      .send({
        type: 'Food',
        description: 'Cakes, Chocolate, Desert',
      })
      .expect(res => {
        skillId = res.body.user.skills[0]._id;
        const { skills, employments, ...rest } = res.body.user;
        expect(res.body.message).toEqual(expect.any(String));
        expect(Object.keys(res.body)).toContain('message');
        expect(Object.keys(res.body)).toContain('user');

        expect(Object.keys(res.body.user)).toContain('bio');
        expect(Object.keys(res.body.user)).toContain('github');
        expect(Object.keys(res.body.user)).toContain('email');
        expect(Object.keys(res.body.user)).toContain('phone');
        expect(rest).toMatchSnapshot();
      });
  });

  test('Adds new project details of Decadevs', async () => {
    expect.assertions(7);
    return request(app)
      .put(`/api/v1/users/update/new-project/${decadevCredentials.email}`)
      .set('Authorization', `Bearer ${decadevToken}`)
      .send({
        title: 'Twitter',
        languages: 'Visual Studio, HTML, Sitecore',
      })
      .expect(res => {
        projectId = res.body.user.portfolio[0]._id;
        expect(res.body.message).toEqual(expect.any(String));
        expect(Object.keys(res.body)).toContain('message');
        expect(Object.keys(res.body)).toContain('user');

        expect(Object.keys(res.body.user)).toContain('bio');
        expect(Object.keys(res.body.user)).toContain('github');
        expect(Object.keys(res.body.user)).toContain('email');
        expect(Object.keys(res.body.user)).toContain('phone');
      });
  });

  test('Updates Portfolio/Project Details', async () => {
    expect.assertions(7);
    return request(app)
      .put(`/api/v1/users/update/projectInfo/${decadevCredentials.email}`)
      .set('Authorization', `Bearer ${decadevToken}`)
      .send({
        title: 'Rosetta Stone',
        languages: 'JavaScript, AngularJS, HTML, CSS, Bower, Git',
        id: projectId,
      })
      .expect(res => {
        expect(res.body.message).toEqual(expect.any(String));
        expect(Object.keys(res.body)).toContain('message');
        expect(Object.keys(res.body)).toContain('user');

        expect(Object.keys(res.body.user)).toContain('bio');
        expect(Object.keys(res.body.user)).toContain('github');
        expect(Object.keys(res.body.user)).toContain('email');
        expect(Object.keys(res.body.user)).toContain('phone');
      });
  });

  test('Updates Skill Details', async () => {
    expect.assertions(7);
    return request(app)
      .put(`/api/v1/users/update/skillInfo/${decadevCredentials.email}`)
      .set('Authorization', `Bearer ${decadevToken}`)
      .send({
        type: 'Stuff',
        description: 'CSS, HTML, Sass, TypeScript, JS',
        id: skillId,
      })
      .expect(res => {
        expect(res.body.message).toEqual(expect.any(String));
        expect(Object.keys(res.body)).toContain('message');
        expect(Object.keys(res.body)).toContain('user');

        expect(Object.keys(res.body.user)).toContain('bio');
        expect(Object.keys(res.body.user)).toContain('github');
        expect(Object.keys(res.body.user)).toContain('email');
        expect(Object.keys(res.body.user)).toContain('phone');
      });
  });

  test('Updates Employment Details', async () => {
    expect.assertions(7);
    return request(app)
      .put(`/api/v1/users/update/employmentInfo/${decadevCredentials.email}`)
      .set('Authorization', `Bearer ${decadevToken}`)
      .send({
        title: 'Back-End Engineer',
        duration: '2013 - PRESENT',
        location: 'Rosetta Stone',
        achievements: [
          'Built a language-learning app for Arabic learners in AngularJS',
          "Constructed a reporting tool so administrators could see their students' progress in real-time.",
          'Developed custom AngularJS services and corresponding tests.',
          'Created custom exact-target email templates and data extensions, and a tool to allow administrators to email users at the click of a button.',
        ],
        id: employmentId,
      })
      .expect(res => {
        expect(res.body.message).toEqual(expect.any(String));
        expect(Object.keys(res.body)).toContain('message');
        expect(Object.keys(res.body)).toContain('user');

        expect(Object.keys(res.body.user)).toContain('bio');
        expect(Object.keys(res.body.user)).toContain('github');
        expect(Object.keys(res.body.user)).toContain('email');
        expect(Object.keys(res.body.user)).toContain('phone');
      });
  });

  test('Deletes Employment details', async () => {
    expect.assertions(7);
    return request(app)
      .put(`/api/v1/users/update/delete-employment/${decadevCredentials.email}`)
      .set('Authorization', `Bearer ${decadevToken}`)
      .send({
        achievements: [
          'Built a language-learning app for Arabic learners in AngularJS',
          "Constructed a reporting tool so administrators could see their students' progress in real-time.",
          'Developed custom AngularJS services and corresponding tests.',
          'Created custom exact-target email templates and data extensions, and a tool to allow administrators to email users at the click of a button.',
        ],
        title: 'CTO',
        location: 'Google',
        duration: '2018 (9 months)',
        id: employmentId,
      })
      .expect(res => {
        expect(res.body.message).toEqual(expect.any(String));
        expect(Object.keys(res.body)).toContain('message');
        expect(Object.keys(res.body)).toContain('user');

        expect(Object.keys(res.body.user)).toContain('bio');
        expect(Object.keys(res.body.user)).toContain('github');
        expect(Object.keys(res.body.user)).toContain('email');
        expect(Object.keys(res.body.user)).toContain('phone');
      });
  });

  test('Deletes Skill Details', async () => {
    expect.assertions(7);
    return request(app)
      .put(`/api/v1/users/update/delete-skill/${decadevCredentials.email}`)
      .set('Authorization', `Bearer ${decadevToken}`)
      .send({
        type: 'Food',
        description: 'Cakes, Chocolate, IceCream',
        id: skillId,
      })
      .expect(res => {
        expect(res.body.message).toEqual(expect.any(String));
        expect(Object.keys(res.body)).toContain('message');
        expect(Object.keys(res.body)).toContain('user');

        expect(Object.keys(res.body.user)).toContain('bio');
        expect(Object.keys(res.body.user)).toContain('github');
        expect(Object.keys(res.body.user)).toContain('email');
        expect(Object.keys(res.body.user)).toContain('phone');
      });
  });

  test('Deletes Portfolio/Project Details', async () => {
    expect.assertions(7);
    return request(app)
      .put(`/api/v1/users/update/delete-project/${decadevCredentials.email}`)
      .set('Authorization', `Bearer ${decadevToken}`)
      .send({
        title: 'Rosetta Stone',
        languages: 'JavaScript, AngularJS, HTML, CSS, Bower, Grunt, Git',
        id: projectId,
      })
      .expect(res => {
        expect(res.body.message).toEqual(expect.any(String));
        expect(Object.keys(res.body)).toContain('message');
        expect(Object.keys(res.body)).toContain('user');

        expect(Object.keys(res.body.user)).toContain('bio');
        expect(Object.keys(res.body.user)).toContain('github');
        expect(Object.keys(res.body.user)).toContain('email');
        expect(Object.keys(res.body.user)).toContain('phone');
      });
  });
});
