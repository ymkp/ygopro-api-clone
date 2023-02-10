import { HttpService } from '@nestjs/axios';
import { Injectable } from '@nestjs/common';
import { CardImagesTempRepository } from '../repositories/card-images-temp.repository';
import { CardImagesRepository } from '../repositories/card-images.repository';
import { writeFile } from 'fs/promises';
import { firstValueFrom } from 'rxjs';
import { Cron } from '@nestjs/schedule';

@Injectable()
export class CardImagesCronjobService {
  constructor(
    private readonly tempRepo: CardImagesTempRepository,
    private readonly imageRepo: CardImagesRepository,
    private readonly http: HttpService,
  ) {}

  // @Cron('45 * * * * *', { name: 'image-fetcher' })
  async setFirstImagesFromTemp() {
    const temps = await this.tempRepo.find({
      where: {
        isSuccess: false,
        isCroppedSuccess: false,
        isSmallSuccess: false,
      },
      take: 5,
    });
    if (temps) {
      for (let i = 0; i < temps.length; i++) {
        const temp = temps[i];

        console.log('try to get : ', temp.ygoproId);
        var image = await this.imageRepo.findOne({
          where: { ygoproId: temp.ygoproId },
        });
        if (!image) {
          image = await this.imageRepo.save({
            ygoproId: temp.ygoproId,
            cardId: temp.cardId,
          });
        }

        try {
          // ? full image
          const dir = `images/cards/full/${temp.ygoproId}.jpg`;
          const res = await firstValueFrom(
            this.http.get(temp.url, { responseType: 'stream' }),
          );
          await writeFile('static/' + dir, res.data);
          await this.tempRepo.update(temp.id, { isSuccess: true });
          await this.imageRepo.update(image.id, { url: dir });
          console.log('full OK : ', temp.ygoproId);
        } catch (err) {
          // console.log(err);
          console.log('failed : FULL : ', temp.ygoproId);
        }

        try {
          // ? small image
          const dir = `images/cards/small/${temp.ygoproId}.jpg`;
          const res = await firstValueFrom(
            this.http.get(temp.urlSmall, { responseType: 'stream' }),
          );
          await writeFile('static/' + dir, res.data);

          await this.tempRepo.update(temp.id, { isSmallSuccess: true });
          await this.imageRepo.update(image.id, { urlSmall: dir });
          console.log('small OK : ', temp.ygoproId);
        } catch (err) {
          // console.log(err);
          console.log('failed : SMALL : ', temp.ygoproId);
        }

        try {
          // ? cropped image
          const dir = `images/cards/cropped/${temp.ygoproId}.jpg`;
          const res = await firstValueFrom(
            this.http.get(temp.urlCropped, { responseType: 'stream' }),
          );
          await writeFile('static/' + dir, res.data);

          await this.tempRepo.update(temp.id, { isCroppedSuccess: true });
          await this.imageRepo.update(image.id, { urlCropped: dir });
          console.log('cropped OK : ', temp.ygoproId);
        } catch (err) {
          // console.log(err);
          console.log('failed : CROPPED : ', temp.ygoproId);
        }
        await new Promise((r) => setTimeout(r, 2000));
      }
    }
  }
}
