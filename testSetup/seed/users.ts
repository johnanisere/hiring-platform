import User from '../../src/models/User';
import HiringPartner from '../../src/models/HiringPartner';

const users = [
  {
    email: 'doe@example.com',
    name: 'John Doe',
    phone: '08074583218',
    password: 'mysecret2',
    role: 'admin',
    profilePhoto:
      'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcSIcqjP8a8EfGrtkCX0CJXJ4HRltM5u8Jdhkz_TneWdb4rfPsMi',
  },

  {
    email: 'decadev-user@example.com',
    name: ' Test Decadev',
    phone: '08074583218',
    password: 'mysecret',
    role: 'dev',
    profilePhoto:
      'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcSIcqjP8a8EfGrtkCX0CJXJ4HRltM5u8Jdhkz_TneWdb4rfPsMi',
    pod: 'java',
  },
  {
    email: 'decadev-use2r@example.com',
    name: ' Test Decadev',
    phone: '08074583208',
    password: 'mysecret',
    role: 'dev',
    profilePhoto:
      'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcSIcqjP8a8EfGrtkCX0CJXJ4HRltM5u8Jdhkz_TneWdb4rfPsMi',
    pod: 'nodejs',
  },
];

const hirers = [
  {
    name: 'Dola Akingbola',
    email: 'dola@example.com',
    nameOfOrg: 'Twitter',
    designation: 'CTO',
    website: 'https://www.google.com',
    industry: 'Technology',
    phone: '08066589871',
    numberOfTalentsRequired: '6-10',
    deadline: 'Within 1 Month',
    verified: true,
    active: true,
    password: 'mysecret',
    interestLanguage: [],
    interviews: [],
  },
  {
    name: 'Test Hirer',
    email: 'hirer2@example.com',
    nameOfOrg: 'Paystack',
    designation: 'CTO',
    website: 'https://www.google.com',
    industry: 'Technology',
    phone: '08066559871',
    numberOfTalentsRequired: '6-10',
    deadline: 'Within 1 Month',
    verified: false,
    active: false,
    password: 'mysecret',
    interestLanguage: [],
    interviews: [],
  },
];

export const seedUsers = async () => {
  try {
    const allUsers = users.map(async user => {
      const newUser = new User(user);
      return newUser.save();
    });

    const res = await Promise.all(allUsers);
    return res;
  } catch (err) {
    return err;
  }
};

export const seedPartners = async () => {
  try {
    const allPartners = hirers.map(async partner => {
      const newPartner = new HiringPartner(partner);
      return await newPartner.save();
    });
    const res = await Promise.all(allPartners);
    return res;
  } catch (err) {
    return err;
  }
};

const seed = async () => {
  try {
    const res = await seedUsers();
    console.log(`Database has been seeded with ${res.length} users`);
    const partners = await seedPartners();
    console.log(`Database has been seeded with ${partners.length} partner(s)`);
  } catch (err) {
    console.log({ err });
  }
};

export default seed;
