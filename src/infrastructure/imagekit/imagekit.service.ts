import { envsConfig } from '@infrastructure/envs';
import { Injectable, OnModuleInit } from '@nestjs/common';
import ImageKit = require('imagekit');

export type ImageKitUploadResult = {
  url: string;
  fileId: string;
};

@Injectable()
export class ImageKitService implements OnModuleInit {
  private client!: ImageKit;

  onModuleInit() {
    const env = envsConfig();
    if (
      !env.imagekitPublicKey ||
      !env.imagekitPrivateKey ||
      !env.imagekitUrlEndpoint
    ) {
      throw new Error(
        'ImageKit credentials are required (IMAGEKIT_PUBLIC_KEY, IMAGEKIT_PRIVATE_KEY, IMAGEKIT_URL_ENDPOINT)',
      );
    }

    this.client = new ImageKit({
      publicKey: env.imagekitPublicKey,
      privateKey: env.imagekitPrivateKey,
      urlEndpoint: env.imagekitUrlEndpoint,
    });
  }

  upload(
    file: Buffer,
    fileName: string,
    folder = '/Works',
  ): Promise<ImageKitUploadResult> {
    return new Promise((resolve, reject) => {
      this.client.upload(
        {
          file,
          fileName,
          folder,
        },
        (error, result) => {
          if (error || !result) {
            reject(error ?? new Error('ImageKit upload failed'));
            return;
          }
          resolve({
            url: result.url,
            fileId: result.fileId,
          });
        },
      );
    });
  }

  async delete(fileId: string): Promise<void> {
    return new Promise((resolve, reject) => {
      this.client.deleteFile(fileId, (error) => {
        if (error) {
          reject(error);
          return;
        }
        resolve();
      });
    });
  }
}
