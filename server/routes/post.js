import express from 'express';

const router = express.Router();

//controllers
import { requireSignin } from '../middlewares/auth.js';
import { createPost } from '../controllers/post';

router.post('/create-post', requireSignin, createPost);

module.exports = router;
