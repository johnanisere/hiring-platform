import { Router } from 'express';
import inviteHiringPartner from '../controllers/inviteHiringPartner';
import updatePassword from '../controllers/passwordUpdate';
import getAllDecadevs from '../controllers/decadevs';
import userLogin from '../controllers/login';
import signUp from '../controllers/signUp';
import changePassword from '../controllers/changePassword';
import authMiddleware from '../middleware/auth';
import hiringPartnerAuthMiddleware from '../middleware/partnerAuth';
import updateUserInfo from '../controllers/updateUserInfo';
import updateEmployment, {
  newEmployment,
  deleteEmployment,
} from '../controllers/updateEmployment';
import updateSkillInfo, {
  newSkill,
  deleteSkill,
} from '../controllers/updateSkills';
import updatePortfolioInfo, {
  newPortfolio,
  deletePortfolio,
} from '../controllers/updatePortfolio';

import updatePublication, {
  newPublication,
  deletePublication,
} from '../controllers/publication';

import updateEducation, {
  newEducation,
  deleteEducation,
} from '../controllers/education';

import authCurrentUser from '../controllers/authCurrentUser';
import hireDev from '../controllers/hireDev';
import allDevs from '../controllers/allDecadevs';

import getHirer from '../controllers/getHirer';

const router = Router();

router
  .post('/signup', signUp)
  .post('/login', userLogin)
  .get('/decadevs', hiringPartnerAuthMiddleware, getAllDecadevs)
  .get('/getpartner', hiringPartnerAuthMiddleware, getHirer)
  .post('/hiring-partner/invite', inviteHiringPartner)
  .put('/change-password', authMiddleware, changePassword)
  .put('/update-password/', authMiddleware, updatePassword)
  .put('/update/userInfo/:email', authMiddleware, updateUserInfo)
  .put('/update/employmentInfo/:email', authMiddleware, updateEmployment)
  .put('/update/new-employment/:email', authMiddleware, newEmployment)
  .put('/update/delete-employment/:email', authMiddleware, deleteEmployment)
  .put('/update/skillInfo/:email', authMiddleware, updateSkillInfo)
  .put('/update/new-skill/:email', authMiddleware, newSkill)
  .put('/update/delete-skill/:email', authMiddleware, deleteSkill)
  .put('/update/projectInfo/:email', authMiddleware, updatePortfolioInfo)
  .put('/update/new-project/:email', authMiddleware, newPortfolio)
  .put('/update/delete-project/:email', authMiddleware, deletePortfolio)
  .put('/update/publicationInfo/:email', authMiddleware, updatePublication)
  .put('/update/new-publication/:email', authMiddleware, newPublication)
  .put('/update/delete-publication/:email', authMiddleware, deletePublication)
  .put('/update/educationInfo/:email', authMiddleware, updateEducation)
  .put('/update/new-education/:email', authMiddleware, newEducation)
  .put('/update/delete-education/:email', authMiddleware, deleteEducation)
  .put('/hire-dev', authMiddleware, hireDev)
  .get('/all', authMiddleware, allDevs)
  .post('/me', authCurrentUser);

export default router;
//vhj
