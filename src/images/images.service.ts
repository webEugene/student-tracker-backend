import { Injectable } from '@nestjs/common';
import { mkdir, constants, promises, unlink, rm } from 'fs';

@Injectable()
export class ImagesService {
  private readonly PROFILES_AVATARS_DIR = './uploads/profiles/';

  deleteAvatar(companyId: string, avatarPath: string): void {
    const fullPath = `${this.PROFILES_AVATARS_DIR}/${companyId}/${avatarPath}`;
    unlink(fullPath, err => {
      return !err;
    });
  }

  removeCompanyAvatarFolder(companyId: string) {
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

  createDirectory(folderName: string): void | never {
    const directoryExist: boolean = this.checkForExistence(folderName);
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

  checkForExistence(companyId: string, avatarPath?: string): boolean {
    let isExist: boolean = false;
    const fullPath: string = avatarPath
      ? `${this.PROFILES_AVATARS_DIR}/${companyId}/${avatarPath}`
      : `${this.PROFILES_AVATARS_DIR}/${companyId}`;
    promises
      .access(fullPath, constants.R_OK)
      .then(() => (isExist = true))
      .catch(() => (isExist = false));

    return isExist;
  }
}
