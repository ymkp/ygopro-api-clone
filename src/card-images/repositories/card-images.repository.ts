import { NotFoundException } from '@nestjs/common';
import { CustomRepository } from 'src/shared/decorators/typeorm-ex.decorator';
import { Repository } from 'typeorm';
import { CardImages } from '../entities/card-images.entity';

@CustomRepository(CardImages)
export class CardImagesRepository extends Repository<CardImages> {
  async getById(id: number): Promise<CardImages> {
    const data = await this.findOne({ where: { id } });
    if (!data) {
      throw new NotFoundException();
    }

    return data;
  }
}
