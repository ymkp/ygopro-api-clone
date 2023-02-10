import {
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
import { SetInfoDetailOutputDTO } from '../dtos/set-info-detail.output.dto';
import { SetInfoFilterInputDTO } from '../dtos/set-info-filter.input.dto';
import { SetInfoOutputDTO } from '../dtos/set-info.output.dto';
import { SetInfoService } from '../services/set-info.service';

@ApiTags('set-info')
@Controller('set-info')
@UseInterceptors(RemoveNullInterceptor)
export class SetInfoController {
  constructor(private readonly service: SetInfoService) {}

  @Get('')
  @ApiOperation({
    summary: 'get set infos with pagination and filter',
  })
  async getSetInfoPagination(
    @Query() pageQ: PaginationParamsDto,
    @Query() filter: SetInfoFilterInputDTO,
  ): Promise<BaseApiResponse<SetInfoOutputDTO[]>> {
    return await this.service.getSetInfoWithFilterAndPagination(pageQ, filter);
  }

  @Get('detail/:id')
  @ApiOperation({
    summary: 'get set info detail with cards by set info ID',
  })
  async getSetInfoDetailById(
    @Param('id', ParseIntPipe) id: number,
  ): Promise<SetInfoDetailOutputDTO> {
    return await this.service.getSetInfoDetailById(id);
  }
}
