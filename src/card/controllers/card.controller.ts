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
import { CardMiniOutputDTO } from '../dtos/card-mini.output.dto';
import { CardService } from '../services/card.service';

@ApiTags('card')
@Controller('card')
export class CardController {
  constructor(private readonly service: CardService) {}

  @Get('')
  @ApiOperation({
    summary: 'get cards with pagination and filter',
  })
  @UseInterceptors(RemoveNullInterceptor)
  async getCardsPagination(
    @Query() pageQ: PaginationParamsDto,
  ): Promise<BaseApiResponse<CardMiniOutputDTO[]>> {
    return await this.service.getCardsWithFilterAndPagination(pageQ);
  }

  @Get('detail/:id')
  @ApiOperation({
    summary: 'get card detail by db ID',
  })
  @UseInterceptors(RemoveNullInterceptor)
  async getDetail(
    @Param('id', ParseIntPipe) id: number,
  ): Promise<CardDetailOutputDTO> {
    return await this.service.getCardDetailById(id);
  }
}
