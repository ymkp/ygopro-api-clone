import {
  ClassSerializerInterceptor,
  Controller,
  Get,
  Param,
  ParseIntPipe,
  Query,
  UseInterceptors,
} from '@nestjs/common';
import { ApiOperation, ApiTags } from '@nestjs/swagger';
import { BaseApiResponse } from 'src/shared/dtos/base-api-response.dto';
import { PaginationParamsDto } from 'src/shared/dtos/pagination-params.dto';
import { RemoveNullInterceptor } from 'src/shared/interceptors/remove-null.interceptor';
import { CardDetailOutputDTO } from '../dtos/card-detail.output.dto';
import { CardFilterInputDTO } from '../dtos/card-filter.input.dto';
import { CardMiniOutputDTO } from '../dtos/card-mini.output.dto';
import { CardService } from '../services/card.service';

@ApiTags('card')
@Controller('card')
@UseInterceptors(RemoveNullInterceptor)
export class CardController {
  constructor(private readonly service: CardService) {}

  @Get('mini')
  @ApiOperation({
    summary: 'get cards with pagination and filter',
  })
  async getCardsPagination(
    @Query() pageQ: PaginationParamsDto,
    @Query() filter: CardFilterInputDTO,
  ): Promise<BaseApiResponse<CardMiniOutputDTO[]>> {
    return await this.service.getCardsWithFilterAndPagination(pageQ, filter);
  }

  @Get('mini/ygoid/:ygoproid')
  @ApiOperation({
    summary: 'get card mini by ygoproid',
  })
  async getCardMiniByYgoproId(
    @Param('ygoproid', ParseIntPipe) ygoproId: number,
  ): Promise<CardMiniOutputDTO> {
    return await this.service.getCardMiniByYGOID(ygoproId);
  }

  @Get('detail/id/:id')
  @ApiOperation({
    summary: 'get card detail by db ID',
  })
  async getDetailById(
    @Param('id', ParseIntPipe) id: number,
  ): Promise<CardDetailOutputDTO> {
    return await this.service.getCardDetailById(id);
  }

  @Get('detail/ygoid/:ygoproid')
  @ApiOperation({
    summary: 'get card detail by ygopro ID / password',
  })
  async getDetailByYGOID(
    @Param('ygoproid', ParseIntPipe) ygoproId: number,
  ): Promise<CardDetailOutputDTO> {
    return await this.service.getCardDetailByYGOID(ygoproId);
  }
}
