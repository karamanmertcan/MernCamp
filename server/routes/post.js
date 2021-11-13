import express from 'express';
import formidable from 'express-formidable';

const router = express.Router();

//controllers
import { requireSignin } from '../middlewares/auth.js';
import { createPost, uploadImage, postsByUser } from '../controllers/post';

router.post('/create-post', requireSignin, createPost);
router.post(
  '/upload-image',
  requireSignin,
  formidable({ maxFileSize: 5 * 1024 * 1024 }),
  uploadImage
);
//posts
router.get('/user-posts', requireSignin, postsByUser);

module.exports = router;
