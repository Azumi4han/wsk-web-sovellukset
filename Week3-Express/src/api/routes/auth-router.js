import express from 'express';
import {body} from 'express-validator';
import {getMe, postLogin} from '../controllers/auth-controller.js';
import {validationErrors} from '../../middlewares/error-handlers.js';
import {authenticateToken} from '../../middlewares/authentication.js';

const authRouter = express.Router();

authRouter.post(
  '/login',
  body('username').trim().notEmpty(),
  body('password').notEmpty(),
  validationErrors,
  postLogin
);
authRouter.get('/me', authenticateToken, getMe);

export default authRouter;
