import request from 'supertest';
import app from '../src/app';
import seedUsers from '../src/db/seed/index';
import { seedPartners } from '../src/db/seed/index';

const { connectMongoDB, disconnectMongoDB } = require('../testSetup/mongodb');

let interviewId = '';

beforeAll(async () => {
  await connectMongoDB();
  seedUsers();
  await seedPartners();
});

afterAll(() => disconnectMongoDB());

describe('interview route', () => {
  test('schedule interview', async () => {
    let interview = await request(app)
      .post('/api/v1/interview/invite')
      .send({
        hiringPartner: 'dola@example.com',
        decaDev: 'anewuser03@example.com',
        location: 'Victoria Island',
        startTime: '10am',
        endTime: '11am',
        startDate: 'wed, 1st oct 2019',
        endDate: 'wed, 1st oct 2019',
        description:
          'This is to inform you that you have been shortlisted for an interview',
        nameOfOrg: 'Paystack',
      })
      .expect(res => {
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
      });

    interviewId = interview.body.interviewData.id;
  }, 30000);
  test('Gets all Interviews', async () => {
    return request(app)
      .get('/api/v1/interview/get-interviews')
      .expect(res => {
        expect(res.status).toBe(200);
        expect(Object.keys(res.body)).toContain('allInterviews');
      });
  });

  test('Adds Reason for interview decline', async () => {
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

describe('User Route', () => {
  test('Has a /api endpoint', async () => {
    return await request(app)
      .get('/api')
      .expect('Content-Type', /json/)
      .expect(200, { message: { hello: 'Hello World' } });
  });

  test('Invite hiring partner', async () => {
    return await request(app)
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

  test('logs in users', async () => {
    return await request(app)
      .post('/api/v1/users/login')
      .send({
        email: 'careers@flutterwave.com',
        password: 'newsecret2',
      })
      .expect(res => {
        expect(res.body.error).toBe('wrong password');
      });
  });

  test('Render four Decadevs', async () => {
    return await request(app)
      .get('/api/v1/users/decadevs')
      .expect(res => {
        expect(res.body.allDecadevs.length).toBe(4);

        expect(res.status).toBe(200);
        expect(Object.keys(res.body)).toContain('allDecadevs');
        expect(res.body.allDecadevs).toHaveLength(4);
      });
  });

  // test('Render All Decadev', async () => {
  //   const hirer = await request(app)
  //     .post('/api/v1/hirer/login')
  //     .send({
  //       email: "dola@example.com",
  //       password: "mysecret",
  //     });

  //   return await request(app).get('/api/v1/users/all')
  //   .set('Authorization', `Bearer ${hirer.body.token}`)
  //   .expect(res => {
  //     console.log(res.body)
  //     expect(res.body.allDevs.length).toBe(28);
  //     expect(res.status).toBe(200);
  //   })
  // });

  test('lists java decadevs', async () => {
    const pod = 'java';
    const decadevs = await request(app).get(
      `/api/v1/users/decadevs?pod=${pod}`,
    );

    for (let i = 0; i < JSON.parse(decadevs.text).allDecadevs.length; i++) {
      expect(JSON.parse(decadevs.text).allDecadevs[i]).toHaveProperty(
        'pod',
        'java',
      );
    }
  });

  test('lists nodejs decadevs', async () => {
    const pod = 'nodejs';
    const decadevs = await request(app).get(
      `/api/v1/users/decadevs?pod=${pod}`,
    );

    for (let i = 0; i < JSON.parse(decadevs.text).allDecadevs.length; i++) {
      expect(JSON.parse(decadevs.text).allDecadevs[i]).toHaveProperty(
        'pod',
        'nodejs',
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
        industry: 'Technology',
        interestLanguage: [],
      })
      .expect(res => {
        expect(Object.keys(res.body)).toContain('message');
        expect(Object.keys(res.body)).toContain('token');
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
        expect(Object.keys(res.body)).toContain('verified');
        expect(Object.keys(res.body)).toContain('active');
        expect(Object.keys(res.body)).toContain('email');
        expect(Object.keys(res.body)).toContain('name');
        expect(Object.keys(res.body)).toContain('token');
        expect(Object.keys(res.body)).toContain('phone');
      });
  });
});

describe('Updates Decadev Profile', () => {
  test('Updates profile/contact details of Decadevs', async () => {
    const email = 'sheyiogundijo@gmail.com';
    const user = await request(app)
      .post('/api/v1/users/login')
      .send({
        email,
        password: 'mysecret',
      });
    return request(app)
      .put(`/api/v1/users/update/userInfo/${email}`)
      .set('Authorization', `Bearer ${user.body.token}`)
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
        expect(res.body).toEqual(
          expect.objectContaining({
            message: 'Details have been successfully updated',
            user: {
              bio: expect.any(String),
              count: expect.any(Number),
              currentRole: expect.any(String),
              cv: expect.any(String),
              description: expect.any(String),
              email: expect.any(String),
              employments: expect.any(Array),
              experience: expect.any(Array),
              gender: expect.any(String),
              github: expect.any(String),
              interviews: [],
              tests: expect.any(Array),
              joined: expect.any(String),
              linkedIn: expect.any(String),
              education: expect.any(Array),
              publications: expect.any(Array),
              location: expect.any(String),
              name: expect.any(String),
              phone: expect.any(String),
              portfolio: expect.any(Array),
              profilePhoto: expect.any(String),
              role: expect.any(String),
              skills: expect.any(Array),
              stack: expect.any(Array),
              stackOverflow: expect.any(String),
              website: expect.any(String),
              pod: expect.any(String),
              hired: expect.any(Boolean),
            },
          }),
        );
      });
  });

  test('Adds new employment details of Decadevs', async () => {
    const email = 'sheyiogundijo@gmail.com';
    const user = await request(app)
      .post('/api/v1/users/login')
      .send({
        email,
        password: 'mysecret',
      });
    return request(app)
      .put(`/api/v1/users/update/new-employment/${email}`)
      .set('Authorization', `Bearer ${user.body.token}`)
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
        expect(res.body).toEqual(
          expect.objectContaining({
            message: 'New Employment Details have been successfully added',
            user: {
              bio: expect.any(String),
              count: expect.any(Number),
              currentRole: expect.any(String),
              cv: expect.any(String),
              description: expect.any(String),
              email: expect.any(String),
              employments: expect.any(Array),
              experience: expect.any(Array),
              gender: expect.any(String),
              github: expect.any(String),
              education: expect.any(Array),
              publications: expect.any(Array),
              interviews: [],
              tests: expect.any(Array),
              joined: expect.any(String),
              linkedIn: expect.any(String),
              location: expect.any(String),
              name: expect.any(String),
              phone: expect.any(String),
              portfolio: expect.any(Array),
              profilePhoto: expect.any(String),
              role: expect.any(String),
              skills: expect.any(Array),
              stack: expect.any(Array),
              stackOverflow: expect.any(String),
              website: expect.any(String),
              pod: expect.any(String),
              hired: expect.any(Boolean),
            },
          }),
        );
      });
  });

  test('Adds new skill details of Decadevs', async () => {
    const email = 'sheyiogundijo@gmail.com';
    const user = await request(app)
      .post('/api/v1/users/login')
      .send({
        email,
        password: 'mysecret',
      });
    return request(app)
      .put(`/api/v1/users/update/new-skill/${email}`)
      .set('Authorization', `Bearer ${user.body.token}`)
      .send({
        type: 'Food',
        description: 'Cakes, Chocolate, Desert',
      })
      .expect(res => {
        expect(res.body).toEqual(
          expect.objectContaining({
            message: 'New Skill Details have been successfully added',
            user: {
              bio: expect.any(String),
              count: expect.any(Number),
              currentRole: expect.any(String),
              cv: expect.any(String),
              description: expect.any(String),
              email: expect.any(String),
              employments: expect.any(Array),
              experience: expect.any(Array),
              gender: expect.any(String),
              github: expect.any(String),
              education: expect.any(Array),
              publications: expect.any(Array),
              interviews: [],
              tests: expect.any(Array),
              joined: expect.any(String),
              linkedIn: expect.any(String),
              location: expect.any(String),
              name: expect.any(String),
              phone: expect.any(String),
              portfolio: expect.any(Array),
              profilePhoto: expect.any(String),
              role: expect.any(String),
              skills: expect.any(Array),
              stack: expect.any(Array),
              stackOverflow: expect.any(String),
              website: expect.any(String),
              pod: expect.any(String),
              hired: expect.any(Boolean),
            },
          }),
        );
      });
  });

  test('Adds new product details of Decadevs', async () => {
    const email = 'sheyiogundijo@gmail.com';
    const user = await request(app)
      .post('/api/v1/users/login')
      .send({
        email,
        password: 'mysecret',
      });
    return request(app)
      .put(`/api/v1/users/update/new-project/${email}`)
      .set('Authorization', `Bearer ${user.body.token}`)
      .send({
        title: 'Twitter',
        languages: 'Visual Studio, HTML, Sitecore',
      })
      .expect(res => {
        expect(res.body).toEqual(
          expect.objectContaining({
            message: 'New Portfolio Details have been successfully added',
            user: {
              bio: expect.any(String),
              count: expect.any(Number),
              currentRole: expect.any(String),
              cv: expect.any(String),
              description: expect.any(String),
              email: expect.any(String),
              employments: expect.any(Array),
              experience: expect.any(Array),
              gender: expect.any(String),
              github: expect.any(String),
              education: expect.any(Array),
              publications: expect.any(Array),
              interviews: [],
              tests: expect.any(Array),
              joined: expect.any(String),
              linkedIn: expect.any(String),
              location: expect.any(String),
              name: expect.any(String),
              phone: expect.any(String),
              portfolio: expect.any(Array),
              profilePhoto: expect.any(String),
              role: expect.any(String),
              skills: expect.any(Array),
              stack: expect.any(Array),
              stackOverflow: expect.any(String),
              website: expect.any(String),
              pod: expect.any(String),
              hired: expect.any(Boolean),
            },
          }),
        );
      });
  });

  test('Deletes Employment details', async () => {
    const email = 'sheyiogundijo@gmail.com';
    const user = await request(app)
      .post('/api/v1/users/login')
      .send({
        email,
        password: 'mysecret',
      });

    const newEmployment = await request(app)
      .put(`/api/v1/users/update/new-employment/${email}`)
      .set('Authorization', `Bearer ${user.body.token}`)
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
      });

    return request(app)
      .put(`/api/v1/users/update/delete-employment/${email}`)
      .set('Authorization', `Bearer ${user.body.token}`)
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
        id: newEmployment.body.user.employments[0]._id,
      })
      .expect(res => {
        expect(res.body).toEqual(
          expect.objectContaining({
            message: 'Experience successfully deleted',
            user: {
              bio: expect.any(String),
              count: expect.any(Number),
              currentRole: expect.any(String),
              cv: expect.any(String),
              description: expect.any(String),
              email: expect.any(String),
              employments: expect.any(Array),
              experience: expect.any(Array),
              education: expect.any(Array),
              publications: expect.any(Array),
              gender: expect.any(String),
              github: expect.any(String),
              interviews: [],
              tests: expect.any(Array),
              joined: expect.any(String),
              linkedIn: expect.any(String),
              location: expect.any(String),
              name: expect.any(String),
              phone: expect.any(String),
              portfolio: expect.any(Array),
              profilePhoto: expect.any(String),
              role: expect.any(String),
              skills: expect.any(Array),
              stack: expect.any(Array),
              stackOverflow: expect.any(String),
              website: expect.any(String),
              pod: expect.any(String),
              hired: expect.any(Boolean),
            },
          }),
        );
      });
  });

  test('Deletes Skill Details', async () => {
    const email = 'sheyiogundijo@gmail.com';
    const user = await request(app)
      .post('/api/v1/users/login')
      .send({
        email,
        password: 'mysecret',
      });

    const newSkill = await request(app)
      .put(`/api/v1/users/update/new-skill/${email}`)
      .set('Authorization', `Bearer ${user.body.token}`)
      .send({
        type: 'Food',
        description: 'Cakes, Chocolate, Desert',
      });

    return request(app)
      .put(`/api/v1/users/update/delete-skill/${email}`)
      .set('Authorization', `Bearer ${user.body.token}`)
      .send({
        type: 'Food',
        description: 'Cakes, Chocolate, IceCream',
        id: newSkill.body.user.skills[0]._id,
      })
      .expect(res => {
        expect(res.body).toEqual(
          expect.objectContaining({
            message: 'Skill successfully deleted',
            user: {
              bio: expect.any(String),
              count: expect.any(Number),
              currentRole: expect.any(String),
              cv: expect.any(String),
              description: expect.any(String),
              email: expect.any(String),
              employments: expect.any(Array),
              experience: expect.any(Array),
              gender: expect.any(String),
              education: expect.any(Array),
              publications: expect.any(Array),
              github: expect.any(String),
              interviews: [],
              tests: expect.any(Array),
              joined: expect.any(String),
              linkedIn: expect.any(String),
              location: expect.any(String),
              name: expect.any(String),
              phone: expect.any(String),
              portfolio: expect.any(Array),
              profilePhoto: expect.any(String),
              role: expect.any(String),
              skills: expect.any(Array),
              stack: expect.any(Array),
              stackOverflow: expect.any(String),
              website: expect.any(String),
              pod: expect.any(String),
              hired: expect.any(Boolean),
            },
          }),
        );
      });
  });
  test('Deletes Portfolio/Project Details', async () => {
    const email = 'sheyiogundijo@gmail.com';
    const user = await request(app)
      .post('/api/v1/users/login')
      .send({
        email,
        password: 'mysecret',
      });

    const newProject = await request(app)
      .put(`/api/v1/users/update/delete-project/${email}`)
      .set('Authorization', `Bearer ${user.body.token}`)
      .send({
        title: 'Rosetta Stone',
        languages: 'JavaScript, AngularJS, HTML, CSS, Bower, Grunt, Git',
      });

    return request(app)
      .put(`/api/v1/users/update/delete-project/${email}`)
      .set('Authorization', `Bearer ${user.body.token}`)
      .send({
        title: 'Rosetta Stone',
        languages: 'JavaScript, AngularJS, HTML, CSS, Bower, Grunt, Git',
        id: newProject.body.user.portfolio[0]._id,
      })
      .expect(res => {
        expect(res.body).toEqual(
          expect.objectContaining({
            message: 'Project successfully deleted',
            user: {
              bio: expect.any(String),
              count: expect.any(Number),
              currentRole: expect.any(String),
              cv: expect.any(String),
              description: expect.any(String),
              email: expect.any(String),
              employments: expect.any(Array),
              experience: expect.any(Array),
              gender: expect.any(String),
              github: expect.any(String),
              interviews: [],
              tests: expect.any(Array),
              education: expect.any(Array),
              publications: expect.any(Array),
              joined: expect.any(String),
              linkedIn: expect.any(String),
              location: expect.any(String),
              name: expect.any(String),
              phone: expect.any(String),
              portfolio: expect.any(Array),
              profilePhoto: expect.any(String),
              role: expect.any(String),
              skills: expect.any(Array),
              stack: expect.any(Array),
              stackOverflow: expect.any(String),
              website: expect.any(String),
              pod: expect.any(String),
              hired: expect.any(Boolean),
            },
          }),
        );
      });
  });
  test('Updates Portfolio/Project Details', async () => {
    const email = 'sheyiogundijo@gmail.com';
    const user = await request(app)
      .post('/api/v1/users/login')
      .send({
        email,
        password: 'mysecret',
      });

    const newProject = await request(app)
      .put(`/api/v1/users/update/new-project/${email}`)
      .set('Authorization', `Bearer ${user.body.token}`)
      .send({
        title: 'Rosetta Stone',
        languages: 'JavaScript, AngularJS, HTML, CSS, Bower, Grunt, Git',
      });

    return request(app)
      .put(`/api/v1/users/update/projectInfo/${email}`)
      .set('Authorization', `Bearer ${user.body.token}`)
      .send({
        title: 'Rosetta Stone',
        languages: 'JavaScript, AngularJS, HTML, CSS, Bower, Git',
        id: newProject.body.user.portfolio[0]._id,
      })
      .expect(res => {
        expect(res.body).toEqual(
          expect.objectContaining({
            message: 'Details have been successfully updated',
            user: {
              bio: expect.any(String),
              count: expect.any(Number),
              currentRole: expect.any(String),
              cv: expect.any(String),
              description: expect.any(String),
              email: expect.any(String),
              employments: expect.any(Array),
              experience: expect.any(Array),
              gender: expect.any(String),
              github: expect.any(String),
              interviews: [],
              education: expect.any(Array),
              publications: expect.any(Array),
              tests: expect.any(Array),
              joined: expect.any(String),
              linkedIn: expect.any(String),
              location: expect.any(String),
              name: expect.any(String),
              phone: expect.any(String),
              portfolio: expect.any(Array),
              profilePhoto: expect.any(String),
              role: expect.any(String),
              skills: expect.any(Array),
              stack: expect.any(Array),
              stackOverflow: expect.any(String),
              website: expect.any(String),
              pod: expect.any(String),
              hired: expect.any(Boolean),
            },
          }),
        );
      });
  });
  test('Updates Skill Details', async () => {
    const email = 'sheyiogundijo@gmail.com';
    const user = await request(app)
      .post('/api/v1/users/login')
      .send({
        email,
        password: 'mysecret',
      });

    const newSkill = await request(app)
      .put(`/api/v1/users/update/new-skill/${email}`)
      .set('Authorization', `Bearer ${user.body.token}`)
      .send({
        type: 'Stuff',
        description: 'CSS, HTML, Sass, TypeScript',
      });

    return request(app)
      .put(`/api/v1/users/update/skillInfo/${email}`)
      .set('Authorization', `Bearer ${user.body.token}`)
      .send({
        type: 'Stuff',
        description: 'CSS, HTML, Sass, TypeScript, JS',
        id: newSkill.body.user.skills[0]._id,
      })
      .expect(res => {
        expect(res.body).toEqual(
          expect.objectContaining({
            message: 'Details have been successfully updated',
            user: {
              bio: expect.any(String),
              count: expect.any(Number),
              currentRole: expect.any(String),
              cv: expect.any(String),
              description: expect.any(String),
              email: expect.any(String),
              employments: expect.any(Array),
              experience: expect.any(Array),
              gender: expect.any(String),
              github: expect.any(String),
              interviews: [],
              education: expect.any(Array),
              publications: expect.any(Array),
              tests: expect.any(Array),
              joined: expect.any(String),
              linkedIn: expect.any(String),
              location: expect.any(String),
              name: expect.any(String),
              phone: expect.any(String),
              portfolio: expect.any(Array),
              profilePhoto: expect.any(String),
              role: expect.any(String),
              skills: expect.any(Array),
              stack: expect.any(Array),
              stackOverflow: expect.any(String),
              website: expect.any(String),
              pod: expect.any(String),
              hired: expect.any(Boolean),
            },
          }),
        );
      });
  });
  test('Updates Employment Details', async () => {
    const email = 'sheyiogundijo@gmail.com';
    const user = await request(app)
      .post('/api/v1/users/login')
      .send({
        email,
        password: 'mysecret',
      });

    const newEmployment = await request(app)
      .put(`/api/v1/users/update/new-employment/${email}`)
      .set('Authorization', `Bearer ${user.body.token}`)
      .send({
        title: 'Junior Engineer',
        duration: '2013 - PRESENT',
        location: 'Rosetta Stone',
        achievements: [
          'Built a language-learning app for Arabic learners in AngularJS',
          "Constructed a reporting tool so administrators could see their students' progress in real-time.",
          'Developed custom AngularJS services and corresponding tests.',
          'Created custom exact-target email templates and data extensions, and a tool to allow administrators to email users at the click of a button.',
        ],
      });

    return request(app)
      .put(`/api/v1/users/update/employmentInfo/${email}`)
      .set('Authorization', `Bearer ${user.body.token}`)
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
        id: newEmployment.body.user.employments[0]._id,
      })
      .expect(res => {
        expect(res.body).toEqual(
          expect.objectContaining({
            message: 'Details have been successfully updated',
            user: {
              bio: expect.any(String),
              count: expect.any(Number),
              currentRole: expect.any(String),
              cv: expect.any(String),
              description: expect.any(String),
              email: expect.any(String),
              employments: expect.any(Array),
              experience: expect.any(Array),
              education: expect.any(Array),
              publications: expect.any(Array),
              gender: expect.any(String),
              github: expect.any(String),
              interviews: [],
              tests: expect.any(Array),
              joined: expect.any(String),
              linkedIn: expect.any(String),
              location: expect.any(String),
              name: expect.any(String),
              phone: expect.any(String),
              portfolio: expect.any(Array),
              profilePhoto: expect.any(String),
              role: expect.any(String),
              skills: expect.any(Array),
              stack: expect.any(Array),
              stackOverflow: expect.any(String),
              website: expect.any(String),
              pod: expect.any(String),
              hired: expect.any(Boolean),
            },
          }),
        );
      });
  });
});
