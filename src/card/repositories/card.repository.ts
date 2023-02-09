import { NotFoundException } from '@nestjs/common';
import { CustomRepository } from 'src/shared/decorators/typeorm-ex.decorator';
import { Repository } from 'typeorm';
import { Card } from '../entities/card.entity';

@CustomRepository(Card)
export class CardRepository extends Repository<Card> {
  async getById(id: number): Promise<Card> {
    const data = await this.findOne({ where: { id } });
    if (!data) {
      throw new NotFoundException();
    }

    return data;
  }
}
