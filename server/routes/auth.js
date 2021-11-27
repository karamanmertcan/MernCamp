import express from 'express';

const router = express.Router();

//controllers
import { requireSignin } from '../middlewares/auth.js';
import {
  register,
  login,
  currentUser,
  forgotPassword,
  profileUpdate,
  findPeople,
  userFollow,
  addFollower,
  userFollowing,
  userUnfollow,
  removeFollower
} from '../controllers/auth.js';

router.post('/register', register);
router.post('/login', login);
router.get('/current-user', requireSignin, currentUser);
router.post('/forgot-password', forgotPassword);

router.put('/profile-update', requireSignin, profileUpdate);
router.get('/find-people', requireSignin, findPeople);
router.put('/user-follow', requireSignin, addFollower, userFollow);
router.get('/user-following', requireSignin, userFollowing);

router.put('/user-unfollow', requireSignin, removeFollower, userUnfollow);

module.exports = router;
