import express from 'express';
import formidable from 'express-formidable';

const router = express.Router();

//controllers
import { requireSignin, canEditDeletePost } from '../middlewares/auth.js';
import {
  createPost,
  uploadImage,
  postsByUser,
  userPost,
  updatePost,
  deletePost
} from '../controllers/post';

router.post('/create-post', requireSignin, createPost);
router.post(
  '/upload-image',
  requireSignin,
  formidable({ maxFileSize: 5 * 1024 * 1024 }),
  uploadImage
);
//posts
router.get('/user-posts', requireSignin, postsByUser);
router.get('/user-post/:_id', requireSignin, userPost);
router.put('/update-post/:_id', requireSignin, canEditDeletePost, updatePost);
router.delete('/delete-post/:id', requireSignin, canEditDeletePost, deletePost);

module.exports = router;
