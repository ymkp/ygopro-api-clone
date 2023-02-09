import { NotFoundException } from '@nestjs/common';
import { CustomRepository } from 'src/shared/decorators/typeorm-ex.decorator';
import { Repository } from 'typeorm';
import { Archetype } from '../entities/archetype.entity';

@CustomRepository(Archetype)
export class ArchetypeRepository extends Repository<Archetype> {
  async getById(id: number): Promise<Archetype> {
    const data = await this.findOne({ where: { id } });
    if (!data) {
      throw new NotFoundException();
    }

    return data;
  }
}
