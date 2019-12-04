import users from './data/users';
import User from '../../models/User';
import Cycle from '../../models/Cycle';
import Employment from '../../models/Employment';
import employments from './data/employments';
import Skill from '../../models/Skills';
import skills from './data/skills';
import Portfolio from '../../models/Portfolio';
import portfolios from './data/portfolio';
import Publications from '../../models/Publications';
import publications from './data/publications';
import Education from '../../models/Education';
import education from './data/education';

const cleanDb = async () => {
  try {
    await Cycle.deleteMany({});
    await User.deleteMany({});
    return console.log('succesfully cleared db');
  } catch (err) {
    console.log('Error: occured', err);
    return err;
  }
};

export const seedUsers = async () => {
  try {
    const allUsers = users.map(async user => {
      const newUser = await new User(user);
      return newUser.save();
    });
    const cycle = await new Cycle();
    await cycle.save();
    const res = await Promise.all(allUsers);
    return res;
  } catch (err) {
    return err;
  }
};

export const seedEmployments = async () => {
  try {
    const allEmployments = employments.map(async employment => {
      const newEmployment = await new Employment(employment);
      return newEmployment.save();
    });
    const res: any = await Promise.all(allEmployments);
    const dev: any = await User.findOne({ email: 'sheyiogundijo@gmail.com' });
    res.forEach((employment: any) => dev.employments.push(employment._id));
    await dev.save();
    return res;
  } catch (err) {
    return err;
  }
};
export const seedSkills = async () => {
  try {
    const allSkills = skills.map(async skill => {
      const newSkill = await new Skill(skill);
      return newSkill.save();
    });
    const res: any = await Promise.all(allSkills);
    const dev: any = await User.findOne({ email: 'sheyiogundijo@gmail.com' });
    res.forEach((skill: any) => dev.skills.push(skill._id));
    await dev.save();
    return res;
  } catch (err) {
    return err;
  }
};
export const seedPortfolios = async () => {
  try {
    const allPortfolios = portfolios.map(async portfolio => {
      const newPortfolio = await new Portfolio(portfolio);
      return newPortfolio.save();
    });
    const res: any = await Promise.all(allPortfolios);
    const dev: any = await User.findOne({ email: 'sheyiogundijo@gmail.com' });
    res.forEach((portfolio: any) => dev.portfolio.push(portfolio._id));
    await dev.save();
    return res;
  } catch (err) {
    return err;
  }
};

export const seedPublications = async () => {
  try {
    const allPublications = publications.map(async publication => {
      const newPublication = await new Publications(publication);
      return newPublication.save();
    });
    const res: any = await Promise.all(allPublications);
    const dev: any = await User.findOne({ email: 'sheyiogundijo@gmail.com' });
    res.forEach((publication: any) => dev.publication.push(publication._id));
    await dev.save();
    return res;
  } catch (err) {
    return err;
  }
};

export const seedEducation = async () => {
  try {
    const allEducation = education.map(async currentEducation => {
      const newEducation = await new Education(currentEducation);
      return newEducation.save();
    });
    const res: any = await Promise.all(allEducation);
    const dev: any = await User.findOne({ email: 'sheyiogundijo@gmail.com' });
    res.forEach((education: any) => dev.education.push(education._id));
    await dev.save();
    return res;
  } catch (err) {
    return err;
  }
};

const seed = () => {
  cleanDb()
    .then(() => {
      return seedUsers();
    })
    .then(res => {
      console.log(`Database has been seeded with ${res.length} users`);
    })
    .then(() => {
      return seedEmployments();
    })
    .then(() => {
      return seedSkills();
    })
    .then(() => {
      return seedPortfolios();
    })
    .then(() => {
      return seedPublications();
    })
    .then(() => {
      return seedEducation();
    })
    .catch(err => {
      console.log({ err });
    });
};

export default seed;
