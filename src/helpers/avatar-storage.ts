import { diskStorage } from 'multer';
import path = require('path');
import { imageFileFilter } from '../utils/file-upload.utils';
import { constants, mkdir, promises } from 'fs';
const PROFILES_AVATARS_DIR = './uploads/profiles/';
// https://github.com/TannerGabriel/Blog/blob/091cbf99bc9409629e1ab717ca8ec405c421d6d4/nest-file-uploading/src/utils/file-upload.utils.ts
function checkForExistence(companyId): boolean {
  let isExist = false;
  const fullPath = `${PROFILES_AVATARS_DIR}/${companyId}`;
  promises
    .access(fullPath, constants.R_OK)
    .then(() => (isExist = true))
    .catch(() => (isExist = false));

  return isExist;
}

export const avatarStorage = {
  storage: diskStorage({
    destination: (req, file, cb) => {
      const directoryExist = checkForExistence(req.query.company_id);

      if (!directoryExist) {
        mkdir(
          `${PROFILES_AVATARS_DIR}/${req.query.company_id}`,
          { recursive: true },
          err => {
            if (err) throw new Error('Crashed while creating folder');
          },
        );
      }

      cb(null, `${PROFILES_AVATARS_DIR}/${req.query.company_id}`);
    },
    filename: (req, file, cb) => {
      const filename: string = req.params.id;
      const extension: string = path.parse(file.originalname).ext;

      cb(null, `${filename}${extension}`);
    },
  }),
  fileFilter: imageFileFilter,
};
