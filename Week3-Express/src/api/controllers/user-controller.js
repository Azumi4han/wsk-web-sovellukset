import bcrypt from 'bcrypt';
import {
  addUser,
  findUserById,
  listAllUsers,
  modifyUser,
  removeUser,
} from '../models/user-model.js';

const createError = (message, status) => {
  const error = new Error(message);
  error.status = status;
  return error;
};

const getUsers = async (req, res, next) => {
  try {
    res.json(await listAllUsers());
  } catch (error) {
    next(error);
  }
};

const getUserById = async (req, res, next) => {
  try {
    const user = await findUserById(req.params.id);

    if (!user) {
      next(createError('User not found', 404));
      return;
    }

    res.json(user);
  } catch (error) {
    next(error);
  }
};

const postUser = async (req, res, next) => {
  try {
    const newUser = {...req.body, role: 'user'};
    newUser.password = bcrypt.hashSync(newUser.password, 10);
    const result = await addUser(newUser);

    if (!result) {
      next(createError('Could not add user', 400));
      return;
    }

    res.status(201).json({message: 'New user added.', result});
  } catch (error) {
    if (error.code === 'ER_DUP_ENTRY') {
      next(createError('Username or email already exists', 409));
      return;
    }
    next(error);
  }
};

const putUser = async (req, res, next) => {
  try {
    const target = await findUserById(req.params.id);

    if (!target) {
      next(createError('User not found', 404));
      return;
    }

    const isAdmin = res.locals.user.role === 'admin';
    const isSelf =
      Number(res.locals.user.user_id) === Number(req.params.id);

    if (!isAdmin && !isSelf) {
      next(createError('Forbidden', 403));
      return;
    }

    const updates = {...req.body};

    if (!isAdmin) {
      delete updates.role;
    }

    if (updates.password) {
      updates.password = bcrypt.hashSync(updates.password, 10);
    }

    const result = await modifyUser(updates, req.params.id);

    if (!result) {
      next(createError('Could not update user', 400));
      return;
    }

    res.json({message: 'User item updated.'});
  } catch (error) {
    if (error.code === 'ER_DUP_ENTRY') {
      next(createError('Username or email already exists', 409));
      return;
    }
    next(error);
  }
};

const deleteUser = async (req, res, next) => {
  try {
    const target = await findUserById(req.params.id);

    if (!target) {
      next(createError('User not found', 404));
      return;
    }

    const isAdmin = res.locals.user.role === 'admin';
    const isSelf =
      Number(res.locals.user.user_id) === Number(req.params.id);

    if (!isAdmin && !isSelf) {
      next(createError('Forbidden', 403));
      return;
    }

    const result = await removeUser(req.params.id);

    if (!result) {
      next(createError('Could not delete user', 400));
      return;
    }

    res.json({
      message: 'User item deleted.',
      deletedCats: result.deletedCats,
    });
  } catch (error) {
    next(error);
  }
};

export {getUsers, getUserById, postUser, putUser, deleteUser};
