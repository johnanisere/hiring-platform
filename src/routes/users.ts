import { Router } from 'express';
import inviteHiringPartner from '../controllers/inviteHiringPartner';
import updatePassword from '../controllers/passwordUpdate';
import getAllDecadevs from '../controllers/decadevs';
import userLogin from '../controllers/login';
import signUp from '../controllers/signUp';
import changePassword from '../controllers/changePassword';
import authMiddleware from '../middleware/auth';
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

const router = Router();

router
  .post('/signup', signUp)
  .post('/login', userLogin)
  .get('/decadevs', getAllDecadevs)
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
  .put('/update/delete-project/:email', authMiddleware, deletePortfolio);

export default router;
