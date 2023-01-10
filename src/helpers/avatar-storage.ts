import { diskStorage } from 'multer';
import path = require('path');
import { imageFileFilter } from '../utils/file-upload.utils';

// https://github.com/TannerGabriel/Blog/blob/091cbf99bc9409629e1ab717ca8ec405c421d6d4/nest-file-uploading/src/utils/file-upload.utils.ts
export const avatarStorage = {
  storage: diskStorage({
    destination: (req, file, cb) => {
      cb(null, `./uploads/profiles/${req.query.company_id}`);
    },
    filename: (req, file, cb) => {
      const filename: string = req.params.id;
      const extension: string = path.parse(file.originalname).ext;

      cb(null, `${filename}${extension}`);
    },
  }),
  fileFilter: imageFileFilter,
};
