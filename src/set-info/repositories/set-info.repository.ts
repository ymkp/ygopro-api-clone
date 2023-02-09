import { NotFoundException } from '@nestjs/common';
import { CustomRepository } from 'src/shared/decorators/typeorm-ex.decorator';
import { Repository } from 'typeorm';
import { SetInfo } from '../entities/set-info.entity';

@CustomRepository(SetInfo)
export class SetInfoRepository extends Repository<SetInfo> {
  async getById(id: number): Promise<SetInfo> {
    const data = await this.findOne({ where: { id } });
    if (!data) {
      throw new NotFoundException();
    }

    return data;
  }
}
