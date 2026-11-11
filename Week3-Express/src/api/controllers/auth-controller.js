import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import 'dotenv/config';
import {findUserByUsername} from '../models/user-model.js';

const createError = (message, status) => {
  const error = new Error(message);
  error.status = status;
  return error;
};

const postLogin = async (req, res, next) => {
  try {
    const user = await findUserByUsername(req.body.username);

    if (!user) {
      next(createError('Invalid username or password', 401));
      return;
    }

    const passwordMatch = await bcrypt.compare(
      req.body.password,
      user.password
    );

    if (!passwordMatch) {
      next(createError('Invalid username or password', 401));
      return;
    }

    const userWithNoPassword = {
      user_id: user.user_id,
      name: user.name,
      username: user.username,
      email: user.email,
      role: user.role,
    };

    const token = jwt.sign(userWithNoPassword, process.env.JWT_SECRET, {
      expiresIn: '24h',
    });

    res.json({user: userWithNoPassword, token});
  } catch (error) {
    next(error);
  }
};

const getMe = async (req, res, next) => {
  if (!res.locals.user) {
    next(createError('Unauthorized', 401));
    return;
  }

  res.json({message: 'token ok', user: res.locals.user});
};

export {postLogin, getMe};
