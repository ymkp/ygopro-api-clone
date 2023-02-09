import { NotFoundException } from '@nestjs/common';
import { CustomRepository } from 'src/shared/decorators/typeorm-ex.decorator';
import { Repository } from 'typeorm';
import { CardImagesTemp } from '../entities/card-images-temp.entity';

@CustomRepository(CardImagesTemp)
export class CardImagesTempRepository extends Repository<CardImagesTemp> {
  async getById(id: number): Promise<CardImagesTemp> {
    const data = await this.findOne({ where: { id } });
    if (!data) {
      throw new NotFoundException();
    }

    return data;
  }
}
