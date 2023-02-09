import { NotFoundException } from '@nestjs/common';
import { CustomRepository } from 'src/shared/decorators/typeorm-ex.decorator';
import { Repository } from 'typeorm';
import { CardSet } from '../entities/card-set.entity';

@CustomRepository(CardSet)
export class CardSetRepository extends Repository<CardSet> {
  async getById(id: number): Promise<CardSet> {
    const data = await this.findOne({ where: { id } });
    if (!data) {
      throw new NotFoundException();
    }

    return data;
  }
}
