import { Controller, Get, Query } from '@nestjs/common';
import { ApiOperation, ApiTags } from '@nestjs/swagger';
import { BaseApiResponse } from 'src/shared/dtos/base-api-response.dto';
import { PaginationParamsDto } from 'src/shared/dtos/pagination-params.dto';
import { SetInfoOutputDTO } from '../dtos/set-info.output.dto';
import { SetInfoJsonService } from '../services/set-info-json.service';
import { SetInfoService } from '../services/set-info.service';

@ApiTags('set-info')
@Controller('set-info')
export class SetInfoController {
  constructor(private readonly service: SetInfoService) {}

  @Get('')
  @ApiOperation({
    summary: 'get set infos with pagination and filter',
  })
  async getSetInfoPagination(
    @Query() pageQ: PaginationParamsDto,
  ): Promise<BaseApiResponse<SetInfoOutputDTO[]>> {
    return await this.service.getSetInfoWithFilterAndPagination(pageQ);
  }
}
