import { Injectable, NotFoundException } from '@nestjs/common';
import { plainToInstance } from 'class-transformer';
import { BaseApiResponse } from 'src/shared/dtos/base-api-response.dto';
import { IdNameStringDTO } from 'src/shared/dtos/id-value-response.dto';
import { PaginationParamsDto } from 'src/shared/dtos/pagination-params.dto';
import { PaginationResponseDto } from 'src/shared/dtos/pagination-response.dto';
import { FindManyOptions, FindOptionsWhere, Like } from 'typeorm';
import { ArchetypeDetailOutputDTO } from '../dtos/archetype-detail.output.dto';
import { ArchetypeFilterInputDTO } from '../dtos/archetype-filter.input.dto';
import { Archetype } from '../entities/archetype.entity';
import { ArchetypeRepository } from '../repositories/archetype.repository';

@Injectable()
export class ArchetypeService {
  constructor(private readonly archRepo: ArchetypeRepository) {}

  public async getArchetypesWIthFilterAndPagination(
    pageQ: PaginationParamsDto,
    filter: ArchetypeFilterInputDTO,
  ): Promise<BaseApiResponse<IdNameStringDTO[]>> {
    const options: FindManyOptions<Archetype> = {
      take: pageQ.limit,
      skip: (pageQ.page - 1) * pageQ.limit,
    };
    if (filter.name) options.where = { name: Like(`%${filter.name}%`) };
    const [res, count] = await this.archRepo.findAndCount(options);
    const meta: PaginationResponseDto = {
      count,
      page: pageQ.page,
      maxPage: Math.ceil(count / pageQ.limit),
    };
    const data = plainToInstance(IdNameStringDTO, res);
    return { data, meta };
  }

  public async getArchetypeDetailById(
    id: number,
  ): Promise<ArchetypeDetailOutputDTO> {
    const arch = await this.archRepo.findOne({
      where: { id },
      select: {
        id: true,
        name: true,
        // cards: { id: true, ygoproId: true },
        cards: {
          id: true,
          name: true,
          type: { name: true },
          race: { name: true },
          atk: true,
          def: true,
          level: true,
          scale: true,
          linkVal: true,
          linkMarkers: true,
          cardImages: { urlSmall: true },
        },
      },
      relations: ['cards', 'cards.type', 'cards.race', 'cards.cardImages'],
    });
    if (!arch) throw new NotFoundException('Archetype not found');
    return plainToInstance(ArchetypeDetailOutputDTO, arch);
  }
}
