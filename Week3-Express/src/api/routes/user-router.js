import express from 'express';
import {body, param} from 'express-validator';
import {
  deleteUser,
  getUserById,
  getUsers,
  postUser,
  putUser,
} from '../controllers/user-controller.js';
import {getCatsByUser} from '../controllers/cat-controller.js';
import {validationErrors} from '../../middlewares/error-handlers.js';
import {authenticateToken} from '../../middlewares/authentication.js';

const userRouter = express.Router();

userRouter
  .route('/')
  .get(getUsers)
  .post(
    body('name').trim().isLength({min: 1, max: 100}),
    body('username').trim().isLength({min: 3, max: 20}).isAlphanumeric(),
    body('email').trim().isEmail(),
    body('password').trim().isLength({min: 8}),
    validationErrors,
    postUser
  );

userRouter
  .route('/:id/cats')
  .get(param('id').isInt(), validationErrors, getCatsByUser);

userRouter
  .route('/:id')
  .get(param('id').isInt(), validationErrors, getUserById)
  .put(
    authenticateToken,
    param('id').isInt(),
    body('name').optional().trim().isLength({min: 1, max: 100}),
    body('username')
      .optional()
      .trim()
      .isLength({min: 3, max: 20})
      .isAlphanumeric(),
    body('email').optional().trim().isEmail(),
    body('password').optional().trim().isLength({min: 8}),
    body('role').optional().isIn(['user', 'admin']),
    validationErrors,
    putUser
  )
  .delete(
    authenticateToken,
    param('id').isInt(),
    validationErrors,
    deleteUser
  );

export default userRouter;
