import { NotFoundException } from '@nestjs/common';
import { CustomRepository } from 'src/shared/decorators/typeorm-ex.decorator';
import { Repository } from 'typeorm';
import { CardRace } from '../entities/card-race.entity';

@CustomRepository(CardRace)
export class CardRaceRepository extends Repository<CardRace> {
  async getById(id: number): Promise<CardRace> {
    const data = await this.findOne({ where: { id } });
    if (!data) {
      throw new NotFoundException();
    }

    return data;
  }
}
