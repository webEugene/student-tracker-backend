import { Injectable } from '@nestjs/common';

interface ISaveAvatarInfo {
  id: string;
  company_id: string;
  avatar_name: string;
  deep_folder?: string;
}

@Injectable()
export class ImagesService {
  async saveAvatarToStorage(ISaveAvatarInfo): Promise<boolean> {
    // const filename: string = req.params.id + '_uu_' + req.query.company_id;
    // const extension: string = path.parse(file.originalname).ext;

    return true;
  }

  async deleteImageAvatar() {
    return true;
  }

  async deleteAllCompanyImageAvatars() {
    return true;
  }

  async createImageAvatar() {
    return true;
  }
}
