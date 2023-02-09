import { BadRequestException, Injectable } from '@nestjs/common';
import { plainToInstance } from 'class-transformer';
import { BaseApiResponse } from 'src/shared/dtos/base-api-response.dto';
import { PaginationParamsDto } from 'src/shared/dtos/pagination-params.dto';
import { PaginationResponseDto } from 'src/shared/dtos/pagination-response.dto';
import { FindManyOptions, FindOptionsWhere } from 'typeorm';
import { SetInfoOutputDTO } from '../dtos/set-info.output.dto';
import { SetInfo } from '../entities/set-info.entity';
import { SetInfoRepository } from '../repositories/set-info.repository';

@Injectable()
export class SetInfoService {
  constructor(private readonly setRepo: SetInfoRepository) {}

  async getSetInfoWithFilterAndPagination(
    pageQ: PaginationParamsDto,
  ): Promise<BaseApiResponse<SetInfoOutputDTO[]>> {
    const where: FindOptionsWhere<SetInfo> = {};
    const options: FindManyOptions<SetInfo> = {
      take: pageQ.limit,
      skip: (pageQ.page - 1) * pageQ.limit,
      select: ['id', 'code', 'nCards', 'name', 'tcgRelease'],
    };

    const [res, count] = await this.setRepo.findAndCount(options);
    const meta: PaginationResponseDto = {
      count,
      page: pageQ.page,
      maxPage: Math.ceil(count / pageQ.limit),
    };
    const data = plainToInstance(SetInfoOutputDTO, res);
    return { data, meta };
  }
}
