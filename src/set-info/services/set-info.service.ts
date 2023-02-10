import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { plainToInstance } from 'class-transformer';
import { BaseApiResponse } from 'src/shared/dtos/base-api-response.dto';
import { PaginationParamsDto } from 'src/shared/dtos/pagination-params.dto';
import { PaginationResponseDto } from 'src/shared/dtos/pagination-response.dto';
import {
  Between,
  FindManyOptions,
  FindOptionsOrder,
  FindOptionsWhere,
  Like,
} from 'typeorm';
import { CardInfoOnSetOutputDTO } from '../dtos/card-info-on-set.output.dto';
import { SetInfoDetailOutputDTO } from '../dtos/set-info-detail.output.dto';
import { SetInfoFilterInputDTO } from '../dtos/set-info-filter.input.dto';
import { SetInfoOutputDTO } from '../dtos/set-info.output.dto';
import { CardSet } from '../entities/card-set.entity';
import { SetInfo } from '../entities/set-info.entity';
import { CardSetRepository } from '../repositories/card-set.repository';
import { SetInfoRepository } from '../repositories/set-info.repository';

@Injectable()
export class SetInfoService {
  constructor(
    private readonly setRepo: SetInfoRepository,
    private readonly cardSetRepo: CardSetRepository,
  ) {}

  async getSetInfoWithFilterAndPagination(
    pageQ: PaginationParamsDto,
    filter: SetInfoFilterInputDTO,
  ): Promise<BaseApiResponse<SetInfoOutputDTO[]>> {
    const where: FindOptionsWhere<SetInfo> = {};
    const options: FindManyOptions<SetInfo> = {
      take: pageQ.limit,
      skip: (pageQ.page - 1) * pageQ.limit,
      select: ['id', 'code', 'nCards', 'name', 'tcgRelease'],
    };
    if (filter.name) {
      where.name = Like(`%${filter.name}%`);
    }

    if (filter.firstDate || filter.lastDate) {
      const lastDate = filter.lastDate
        ? new Date(filter.lastDate)
        : new Date(Date.now());
      const firstDate = filter.firstDate
        ? new Date(filter.firstDate)
        : new Date('2002-01-01');
      where.tcgRelease = Between(firstDate, lastDate);
    }

    if (filter.sortBy) {
      const key = filter.sortBy;
      const order: FindOptionsOrder<any> = {};
      order[key] = filter.order ?? 'asc';
      options.order = order;
    }

    options.where = where;

    const [res, count] = await this.setRepo.findAndCount(options);
    const meta: PaginationResponseDto = {
      count,
      page: pageQ.page,
      maxPage: Math.ceil(count / pageQ.limit),
    };
    const data = plainToInstance(SetInfoOutputDTO, res);
    return { data, meta };
  }

  async getSetInfoDetailById(id: number): Promise<SetInfoDetailOutputDTO> {
    const setinfo = await this.setRepo.findOne({
      where: { id },
      relations: [
        'cardSets',
        'cardSets.card',
        'cardSets.card.cardImages',
        'cardSets.rarity',
      ],
    });
    if (!setinfo) throw new NotFoundException('Set info not found');
    const cards: CardInfoOnSetOutputDTO[] = setinfo.cardSets.map((c) =>
      this.changeCardSetToCardInfoOnSet(c),
    );
    const data = plainToInstance(SetInfoDetailOutputDTO, setinfo);
    data.cards = cards;
    return data;
  }

  async getCardsOnSetBySetId(
    setInfoId: number,
  ): Promise<CardInfoOnSetOutputDTO[]> {
    const cardSets = await this.cardSetRepo.find({ where: { setInfoId } });
    return cardSets.map((c) => this.changeCardSetToCardInfoOnSet(c));
  }

  private changeCardSetToCardInfoOnSet(input: CardSet): CardInfoOnSetOutputDTO {
    return {
      code: input.code,
      rarity: input.rarity.name,
      rarityCode: input.code,
      imageSmall:
        input.card.cardImages.length > 0
          ? input.card.cardImages[0].urlSmall
          : null,
      id: input.card.id,
      name: input.card.name,
    };
  }
}
