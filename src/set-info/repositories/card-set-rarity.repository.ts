import { NotFoundException } from '@nestjs/common';
import { CustomRepository } from 'src/shared/decorators/typeorm-ex.decorator';
import { Repository } from 'typeorm';
import { CardSetRarity } from '../entities/card-set-rarity.entity';

@CustomRepository(CardSetRarity)
export class CardSetRarityRepository extends Repository<CardSetRarity> {
  async getById(id: number): Promise<CardSetRarity> {
    const data = await this.findOne({ where: { id } });
    if (!data) {
      throw new NotFoundException();
    }

    return data;
  }
}
