import { Injectable, NotFoundException } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { plainToInstance } from 'class-transformer';
import { BaseApiResponse } from 'src/shared/dtos/base-api-response.dto';
import { PaginationParamsDto } from 'src/shared/dtos/pagination-params.dto';
import { PaginationResponseDto } from 'src/shared/dtos/pagination-response.dto';
import { FindManyOptions, FindOptionsWhere } from 'typeorm';
import { CardDetailOutputDTO } from '../dtos/card-detail.output.dto';
import { CardMiniOutputDTO } from '../dtos/card-mini.output.dto';
import { Card } from '../entities/card.entity';
import { CardRepository } from '../repositories/card.repository';

@Injectable()
export class CardService {
  constructor(private readonly cardRepo: CardRepository) {}

  public async getCardsWithFilterAndPagination(
    pageQ: PaginationParamsDto,
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

    const [res, count] = await this.cardRepo.findAndCount(options);
    const meta: PaginationResponseDto = {
      count,
      page: pageQ.page,
      maxPage: Math.ceil(count / pageQ.limit),
    };
    const data = plainToInstance(CardMiniOutputDTO, res);
    return { data, meta };
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
}
