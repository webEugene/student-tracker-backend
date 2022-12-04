import { diskStorage } from 'multer';
import path = require('path');

type validFileExtension = 'png' | 'jpg' | 'jpeg' | 'gif';
type validMimeType = 'image/png' | 'image/jpg' | 'image/jpeg' | 'image/gif';

const validFileExtension: validFileExtension[] = ['png', 'jpg', 'jpeg', 'gif'];
const validMimeType: validMimeType[] = [
  'image/png',
  'image/jpg',
  'image/jpeg',
  'image/gif',
];
// TODO Rewrite saving avatar
export const avatarStorage = {
  storage: diskStorage({
    destination: `./uploads/profiles`,
    filename: (req, file, cb) => {
      // const originalName: string = file.originalname
      //   .toLowerCase()
      //   .split(' ')
      //   .join('-');
      // path.parse(originalName).name.replace(/\s/g, '') +
      // '_' +

      const filename: string = req.params.id + '_uu_' + req.query.company_id;
      const extension: string = path.parse(file.originalname).ext;

      cb(null, `${filename}${extension}`);
    },
  }),
  fileFilter: (req, file, cb) => {
    const allowedMimeTypes: validMimeType[] = validMimeType;
    allowedMimeTypes.includes(file.mimetype) ? cb(null, true) : cb(null, false);
  },
};
