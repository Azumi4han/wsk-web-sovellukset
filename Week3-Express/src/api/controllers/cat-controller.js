import {
  addCat,
  findCatById,
  findCatsByOwner,
  listAllCats,
  modifyCat,
  removeCat,
} from '../models/cat-model.js';

const createError = (message, status) => {
  const error = new Error(message);
  error.status = status;
  return error;
};

const getCats = async (req, res, next) => {
  try {
    res.json(await listAllCats());
  } catch (error) {
    next(error);
  }
};

const getCatById = async (req, res, next) => {
  try {
    const cat = await findCatById(req.params.id);

    if (!cat) {
      next(createError('Cat not found', 404));
      return;
    }

    res.json(cat);
  } catch (error) {
    next(error);
  }
};

const getCatsByUser = async (req, res, next) => {
  try {
    res.json(await findCatsByOwner(req.params.id));
  } catch (error) {
    next(error);
  }
};

const postCat = async (req, res, next) => {
  try {
    if (!req.file) {
      next(createError('Cat file is required', 400));
      return;
    }

    const owner =
      res.locals.user.role === 'admin' && req.body.owner
        ? req.body.owner
        : res.locals.user.user_id;
    const newCat = {
      ...req.body,
      owner,
      filename: req.file.filename,
    };
    const result = await addCat(newCat);

    if (!result) {
      next(createError('Could not add cat', 400));
      return;
    }

    res.status(201).json({message: 'New cat added.', result});
  } catch (error) {
    next(error);
  }
};

const putCat = async (req, res, next) => {
  try {
    const cat = await findCatById(req.params.id);

    if (!cat) {
      next(createError('Cat not found', 404));
      return;
    }

    const isAdmin = res.locals.user.role === 'admin';
    const isOwner = Number(cat.owner) === Number(res.locals.user.user_id);

    if (!isAdmin && !isOwner) {
      next(createError('Forbidden', 403));
      return;
    }

    const updates = {...req.body};

    if (!isAdmin) {
      delete updates.owner;
    }

    const result = await modifyCat(updates, req.params.id);

    if (!result) {
      next(createError('Could not update cat', 400));
      return;
    }

    res.json({message: 'Cat item updated.'});
  } catch (error) {
    next(error);
  }
};

const deleteCat = async (req, res, next) => {
  try {
    const cat = await findCatById(req.params.id);

    if (!cat) {
      next(createError('Cat not found', 404));
      return;
    }

    const isAdmin = res.locals.user.role === 'admin';
    const isOwner = Number(cat.owner) === Number(res.locals.user.user_id);

    if (!isAdmin && !isOwner) {
      next(createError('Forbidden', 403));
      return;
    }

    const result = await removeCat(req.params.id);

    if (!result) {
      next(createError('Could not delete cat', 400));
      return;
    }

    res.json({message: 'Cat item deleted.'});
  } catch (error) {
    next(error);
  }
};

export {
  getCats,
  getCatById,
  getCatsByUser,
  postCat,
  putCat,
  deleteCat,
};
