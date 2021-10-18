import User from '../models/user';
import { hashPassword, comparePassword } from '../helpers/auth';
import jwt from 'jsonwebtoken';

export const register = async (req, res) => {
  //   console.log('REGISTER ENDPPOINT => ', req.body);
  const { email, name, password, secret } = req.body;
  //validation
  if (!name) return res.status(400).send('Name is required!!!');
  if (!password || password.length < 6)
    return res.status(400).send('Password is required and should be at least 6 characters long!!!');
  if (!secret) return res.status(400).send('Answer is required!!!');

  const exist = await User.findOne({ email });
  if (exist) return res.status(400).send('Email is taken !!!');

  //hashpassword
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
    return res.status(400).send('Error. Try again.');
  }
};

export const login = async (req, res) => {
  try {
    //check if our db has use with that email
    const { email, password } = req.body;

    const user = await User.findOne({ email });

    if (!user) return res.status(400).send('User not found!');

    //check password
    const match = await comparePassword(password, user.password);

    if (!match) return res.status(400).send('Wrong password !');
    //create signed token
    const token = jwt.sign({ _id: user._id }, process.env.JWT_SECRET, { expiresIn: '7d' });

    user.password = undefined;
    user.secret = undefined;
    return res.status(200).json({ token, user });
  } catch (err) {
    console.log(err);
    return res.status(404).send('Error. Try Again.');
  }
};
