import User from '../models/user';
import { hashPassword, comparePassword } from '../helpers/auth';
import jwt from 'jsonwebtoken';

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
    secret
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
