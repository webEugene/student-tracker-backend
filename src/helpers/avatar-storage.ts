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

export const avatarStorage = {
  storage: diskStorage({
    destination: './uploads/profileImages',
    filename: (req, file, cb) => {
      const filename: string = path
        .parse(file.originalname)
        .name.replace(/\s/g, '');
      const extension: string = path.parse(file.originalname).ext;

      cb(null, `${filename}${extension}`);
    },
  }),
  fileFilter: (req, file, cb) => {
    const allowedMimeTypes: validMimeType[] = validMimeType;
    allowedMimeTypes.includes(file.mimetype) ? cb(null, true) : cb(null, false);
  },
};
