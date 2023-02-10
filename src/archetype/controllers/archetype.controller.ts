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
import { IdNameStringDTO } from 'src/shared/dtos/id-value-response.dto';
import { PaginationParamsDto } from 'src/shared/dtos/pagination-params.dto';
import { RemoveNullInterceptor } from 'src/shared/interceptors/remove-null.interceptor';
import { ArchetypeDetailOutputDTO } from '../dtos/archetype-detail.output.dto';
import { ArchetypeFilterInputDTO } from '../dtos/archetype-filter.input.dto';
import { ArchetypeService } from '../services/archetype.service';

@ApiTags('archetype')
@Controller('archetype')
@UseInterceptors(RemoveNullInterceptor)
export class ArchetypeController {
  constructor(private readonly service: ArchetypeService) {}

  @Get('')
  @ApiOperation({
    summary: 'get archetypes with pagination',
  })
  async getArchetypesPagination(
    @Query() pageQ: PaginationParamsDto,
    @Query() filter: ArchetypeFilterInputDTO,
  ): Promise<BaseApiResponse<IdNameStringDTO[]>> {
    return await this.service.getArchetypesWIthFilterAndPagination(
      pageQ,
      filter,
    );
  }

  @Get('detail/:id')
  @ApiOperation({ summary: 'get archetype detail with members as ygoproid' })
  async getArchetypeDetail(
    @Param('id', ParseIntPipe) id: number,
  ): Promise<ArchetypeDetailOutputDTO> {
    return await this.service.getArchetypeDetailById(id);
  }
}
