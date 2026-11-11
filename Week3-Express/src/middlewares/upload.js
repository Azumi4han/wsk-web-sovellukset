import multer from 'multer';
import sharp from 'sharp';

const upload = multer({
  dest: 'uploads/',
  limits: {
    fileSize: 10 * 1024 * 1024,
  },
  fileFilter: (req, file, cb) => {
    if (
      file.mimetype.startsWith('image/') ||
      file.mimetype.startsWith('video/')
    ) {
      cb(null, true);
      return;
    }

    const error = new Error('Only images and videos are allowed!');
    error.status = 400;
    cb(error, false);
  },
});

const requireCatFile = (req, res, next) => {
  if (!req.file) {
    const error = new Error('Cat file is required');
    error.status = 400;
    next(error);
    return;
  }

  next();
};

const createThumbnail = async (req, res, next) => {
  if (!req.file || !req.file.mimetype.startsWith('image/')) {
    next();
    return;
  }

  try {
    const thumbnailPath = `${req.file.path}_thumb.png`;
    await sharp(req.file.path)
      .resize(160, 160, {fit: 'cover'})
      .png()
      .toFile(thumbnailPath);
    next();
  } catch (error) {
    next(error);
  }
};

export {upload, requireCatFile, createThumbnail};
