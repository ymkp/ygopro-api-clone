import { Controller, Get } from '@nestjs/common';
import { ApiExcludeController, ApiTags } from '@nestjs/swagger';
import { SetInfoJsonService } from '../services/set-info-json.service';

@ApiTags('set-info-json')
@Controller('set-info-json')
// @ApiExcludeController()
export class SetInfoJsonController {
  constructor(private readonly service: SetInfoJsonService) {}

  @Get()
  async setInfoFromJson() {
    await this.service.readFromCardSetsJson();
  }
}
