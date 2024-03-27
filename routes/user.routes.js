import express from 'express';
import {
  deleteUser,
  signout,
  test,
  updateUser,
} from '../controllers/user.controller.js';
import { verifyUser } from '../utils/verifyUser.js';

const router = express.Router();

router.get('/test', test);
router.delete('/delete/:userId', verifyUser, deleteUser);
router.post('/signout', signout);
router.put('/update/:userId', verifyUser, updateUser);

export default router;
