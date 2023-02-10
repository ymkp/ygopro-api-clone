import { Injectable, NotFoundException } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { plainToInstance } from 'class-transformer';
import { BaseApiResponse } from 'src/shared/dtos/base-api-response.dto';
import { PaginationParamsDto } from 'src/shared/dtos/pagination-params.dto';
import { PaginationResponseDto } from 'src/shared/dtos/pagination-response.dto';
import {
  FindManyOptions,
  FindOptionsWhere,
  FindOptionsOrder,
  Like,
  Between,
} from 'typeorm';
import { CardDetailOutputDTO } from '../dtos/card-detail.output.dto';
import { CardFilterInputDTO } from '../dtos/card-filter.input.dto';
import { CardMiniOutputDTO } from '../dtos/card-mini.output.dto';
import { Card } from '../entities/card.entity';
import { CardRepository } from '../repositories/card.repository';

@Injectable()
export class CardService {
  constructor(private readonly cardRepo: CardRepository) {}

  public async getCardsWithFilterAndPagination(
    pageQ: PaginationParamsDto,
    filter: CardFilterInputDTO,
  ): Promise<BaseApiResponse<CardMiniOutputDTO[]>> {
    const where: FindOptionsWhere<Card> = {};
    const options: FindManyOptions<Card> = {
      take: pageQ.limit,
      skip: (pageQ.page - 1) * pageQ.limit,
      select: {
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
      relations: ['type', 'race', 'cardImages'],
    };

    if (filter.sortBy) {
      const key = filter.sortBy;
      const order: FindOptionsOrder<any> = {};
      order[key] = filter.order ?? 'asc';
      options.order = order;
    }
    if (filter.name) {
      where.name = Like(`%${filter.name.toLowerCase()}%`);
    }
    if (filter.type) {
      where.type = { name: filter.type };
    }
    if (filter.race) {
      where.race = { name: filter.type };
    }
    if (filter.atkMin || filter.atkMax) {
      where.atk = Between(filter.atkMin ?? 0, filter.atkMax ?? 10000);
    }
    if (filter.defMin || filter.defMax) {
      where.def = Between(filter.defMin ?? 0, filter.defMax ?? 10000);
    }
    if (filter.levelMin || filter.levelMax) {
      where.level = Between(filter.levelMin ?? 0, filter.levelMax ?? 13);
    }

    if (filter.scaleMin || filter.scaleMax) {
      where.level = Between(filter.scaleMin ?? 0, filter.scaleMax ?? 13);
    }

    if (filter.linkValMin || filter.linkValMax) {
      where.level = Between(filter.linkValMin ?? 0, filter.linkValMax ?? 8);
    }

    options.where = where;
    const [res, count] = await this.cardRepo.findAndCount(options);
    const meta: PaginationResponseDto = {
      count,
      page: pageQ.page,
      maxPage: Math.ceil(count / pageQ.limit),
    };
    const data = plainToInstance(CardMiniOutputDTO, res);
    return { data, meta };
  }

  public async getCardMiniByYGOID(
    ygoproId: number,
  ): Promise<CardMiniOutputDTO> {
    const card = await this.cardRepo.findOne({
      where: { ygoproId },
      select: {
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
      relations: ['type', 'race', 'cardImages'],
    });
    if (!card) throw new NotFoundException();
    return plainToInstance(CardMiniOutputDTO, card);
  }

  public async getCardDetailById(id: number): Promise<CardDetailOutputDTO> {
    const card = await this.cardRepo.findOne({
      where: { id },
      relations: [
        'type',
        'race',
        'archetypes',
        'cardSets',
        'cardSets.setInfo',
        'cardSets.rarity',
        'cardImages',
      ],
    });
    if (!card) throw new NotFoundException();
    return plainToInstance(CardDetailOutputDTO, card);
  }

  public async getCardDetailByYGOID(
    ygoproId: number,
  ): Promise<CardDetailOutputDTO> {
    const card = await this.cardRepo.findOne({
      where: { ygoproId },
      relations: [
        'type',
        'race',
        'archetypes',
        'cardSets',
        'cardSets.setInfo',
        'cardSets.rarity',
        'cardImages',
      ],
    });
    if (!card) throw new NotFoundException();
    return plainToInstance(CardDetailOutputDTO, card);
  }
}
