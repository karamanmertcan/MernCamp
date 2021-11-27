import User from '../models/user';
import { hashPassword, comparePassword } from '../helpers/auth';
import jwt from 'jsonwebtoken';
import { nanoid } from 'nanoid';

export const register = async (req, res) => {
  //   console.log('REGISTER ENDPPOINT => ', req.body);
  const { email, name, password, secret } = req.body;
  //validation
  if (!name) return res.json({ error: 'Name is required' });
  if (!password || password.length < 6)
    return res
      .status(400)
      .json({ error: 'Password is required and should be at least 6 characters long!!!' });
  if (!secret) return res.json({ error: 'Answer is required!!!' });

  const exist = await User.findOne({ email });
  if (exist) return res.json({ error: 'Email is taken !!!' });

  //hash password
  const hashedPassword = await hashPassword(password);

  const user = new User({
    email,
    name,
    password: hashedPassword,
    secret,
    username: nanoid(6)
  });

  try {
    await user.save();
    // console.log('REGISTER USER =>', user);
    return res.status(200).json({
      ok: true
    });
  } catch (error) {
    console.log('REGISTER FAILED => ', err);
    return res.send('Error. Try again.');
  }
};

export const login = async (req, res) => {
  try {
    //check if our db has use with that email
    const { email, password } = req.body;

    const user = await User.findOne({ email });

    if (!user) {
      return res.json({ error: 'User not found!' });
    }

    //check password
    const match = await comparePassword(password, user.password);

    if (!match) {
      return res.json({ error: 'Wrong password !' });
    }
    //create signed token
    const token = jwt.sign({ _id: user._id }, process.env.JWT_SECRET, { expiresIn: '7d' });

    user.password = undefined;
    user.secret = undefined;
    return res.status(200).json({ token, user });
  } catch (err) {
    console.log(err);
    return res.status(404).json({ error: 'Error. Try Again.' });
  }
};

export const currentUser = async (req, res) => {
  try {
    const user = await User.findById(req.user._id);
    if (user) return res.status(200).json({ ok: true });
  } catch (error) {
    console.log(error);
    res.sendStatus(400);
  }
};

export const forgotPassword = async (req, res) => {
  // console.log(req.body);
  const { email, newPassword, secret } = req.body;
  console.log(newPassword.length);

  if (!email) return res.json({ error: 'Email is required !' });
  if (!newPassword || newPassword.length < 6)
    return res
      .status(400)
      .json({ error: 'New Password is required and it should be at least 6 characters!' });
  if (!secret) return res.json({ error: 'Secret is required !' });

  const user = await User.findOne({ email, secret });
  if (!user) {
    return res.json({ error: 'We cant verify you with those details' });
  }

  console.log(user);

  try {
    const hashed = await hashPassword(newPassword);
    await User.findByIdAndUpdate(user._id, { password: hashed });
    return res.json({ success: 'Congrats , Now you can login with your new password!' });
  } catch (error) {
    console.log(error);
    return res.json({ error: 'Something went wrong. Try again !' });
  }
};

export const profileUpdate = async (req, res) => {
  try {
    // console.log('profile update', req.body);
    const data = {};

    if (req.body.username) data.username = req.body.username;
    if (req.body.about) data.about = req.body.about;
    if (req.body.name) data.name = req.body.name;
    if (req.body.password) {
      if (req.body.password.length < 6) {
        return res.json({ error: 'Password is required and it should be at least 6 characters!' });
      } else {
        data.password = await hashPassword(req.body.password);
      }
    }
    if (req.body.secret) data.secret = req.body.secret;
    if (req.body.image) data.image = req.body.image;

    const user = await User.findByIdAndUpdate(req.user._id, data, { new: true });
    console.log('profile updated user =>', user);
    user.password = undefined;
    user.secret = undefined;
    res.json(user);
  } catch (error) {
    if (error.code === 11000) return res.json({ error: 'Duplicate username !' });
    console.log(error);
  }
};

export const findPeople = async (req, res) => {
  try {
    const user = await User.findById(req.user._id);
    //user.following
    let following = user.following;
    following.push(req.user._id);
    const people = await User.find({ _id: { $nin: following } })
      .select('-password -secret')
      .limit(10);
    res.json(people);
  } catch (error) {
    console.log(error);
  }
};

export const addFollower = async (req, res, next) => {
  try {
    const user = await User.findByIdAndUpdate(req.body._id, {
      $addToSet: {
        followers: req.user._id
      }
    });
    next();
  } catch (error) {
    console.log(error);
  }
};

export const userFollow = async (req, res) => {
  try {
    const user = await User.findByIdAndUpdate(
      req.user._id,
      {
        $addToSet: {
          following: req.body._id
        }
      },
      { new: true }
    ).select('-password -secret');

    res.json(user);
  } catch (error) {
    console.log(error);
  }
};

export const userFollowing = async (req, res) => {
  try {
    const user = await User.findById(req.user._id).select('-password -secret');
    const following = await User.find({ _id: user.following }).limit(100);
    res.json(following);
  } catch (error) {
    console.log(error);
  }
};

export const removeFollower = async (req, res, next) => {
  try {
    const user = await User.findByIdAndUpdate(req.body._id, {
      $pull: {
        followers: req.user._id
      }
    });
    next();
  } catch (error) {
    console.log(error);
  }
};

export const userUnfollow = async (req, res) => {
  try {
    const user = await User.findByIdAndUpdate(
      req.user._id,
      {
        $pull: {
          following: req.body._id
        }
      },
      { new: true }
    );
    res.json(user);
  } catch (error) {
    console.log(error);
  }
};
