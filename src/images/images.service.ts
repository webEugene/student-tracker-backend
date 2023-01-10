import { Injectable } from '@nestjs/common';
import { mkdir, constants, promises, unlink, rm } from 'fs';
import path = require('path');

@Injectable()
export class ImagesService {
  private readonly PROFILES_AVATARS_DIR = './uploads/profiles/';

  deleteAvatar(companyId, avatarPath) {
    const fullPath = `${this.PROFILES_AVATARS_DIR}/${companyId}/${avatarPath}`;
    unlink(fullPath, err => {
      return !err;
    });
  }

  removeCompanyAvatarFolder(companyId) {
    rm(
      `${this.PROFILES_AVATARS_DIR}/${companyId}`,
      { recursive: true, force: true },
      err => {
        if (err) {
          throw err;
        }
      },
    );
  }

  createImageName(forSaveAvatarInfo): string {
    const filename: string =
      forSaveAvatarInfo.id + '_uu_' + forSaveAvatarInfo.company_id;
    const extension: string = path.parse(forSaveAvatarInfo.avatar_name).ext;

    return `${filename}${extension}`;
  }

  createDirectory(folderName: string): void | never {
    const directoryExist = this.checkForExistence(folderName);
    if (!directoryExist) {
      mkdir(
        `${this.PROFILES_AVATARS_DIR}/${folderName}`,
        { recursive: true },
        err => {
          if (err) throw new Error('Crashed while creating folder');
        },
      );
    }
  }

  checkForExistence(companyId, avatarPath?: string): boolean {
    let isExist = false;
    const fullPath = avatarPath
      ? `${this.PROFILES_AVATARS_DIR}/${companyId}/${avatarPath}`
      : `${this.PROFILES_AVATARS_DIR}/${companyId}`;
    promises
      .access(fullPath, constants.R_OK)
      .then(() => (isExist = true))
      .catch(() => (isExist = false));

    return isExist;
  }
}
