import express from 'express';
import {body, param} from 'express-validator';
import {
  deleteCat,
  getCatById,
  getCats,
  postCat,
  putCat,
} from '../controllers/cat-controller.js';
import {validationErrors} from '../../middlewares/error-handlers.js';
import {
  createThumbnail,
  requireCatFile,
  upload,
} from '../../middlewares/upload.js';
import {authenticateToken} from '../../middlewares/authentication.js';

const catRouter = express.Router();

catRouter
  .route('/')
  .get(getCats)
  .post(
    authenticateToken,
    upload.single('cat'),
    requireCatFile,
    body('cat_name').trim().isLength({min: 3, max: 50}),
    body('weight').isFloat({gt: 0}),
    body('birthdate').isDate(),
    body('owner').optional().isInt(),
    validationErrors,
    createThumbnail,
    postCat
  );

catRouter
  .route('/:id')
  .get(param('id').isInt(), validationErrors, getCatById)
  .put(
    authenticateToken,
    param('id').isInt(),
    body('cat_name').optional().trim().isLength({min: 3, max: 50}),
    body('weight').optional().isFloat({gt: 0}),
    body('birthdate').optional().isDate(),
    body('owner').optional().isInt(),
    validationErrors,
    putCat
  )
  .delete(
    authenticateToken,
    param('id').isInt(),
    validationErrors,
    deleteCat
  );

export default catRouter;
