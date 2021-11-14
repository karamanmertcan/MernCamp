import Post from '../models/post';
import expressJwt from 'express-jwt';

export const requireSignin = expressJwt({
  secret: process.env.JWT_SECRET,
  algorithms: ['HS256']
});

export const canEditDeletePost = async (req, res, next) => {
  console.log(req.params.id);

  try {
    const post = await Post.findById(req.params.id);

    if (req.user._id != post.postedBy) {
      return res.status(400).json({
        error: 'Access Denied'
      });
    } else {
      next();
    }
  } catch (error) {
    console.log(error);
  }
};
