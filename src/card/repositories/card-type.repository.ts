import { NotFoundException } from '@nestjs/common';
import { CustomRepository } from 'src/shared/decorators/typeorm-ex.decorator';
import { Repository } from 'typeorm';
import { CardType } from '../entities/card-type.entity';

@CustomRepository(CardType)
export class CardTypeRepository extends Repository<CardType> {
  async getById(id: number): Promise<CardType> {
    const data = await this.findOne({ where: { id } });
    if (!data) {
      throw new NotFoundException();
    }

    return data;
  }
}
