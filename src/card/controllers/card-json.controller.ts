import { Controller, Get, Param, ParseIntPipe } from '@nestjs/common';
import { ApiExcludeController, ApiTags } from '@nestjs/swagger';
import { CardJsonService } from '../services/card-json.service';

@ApiTags('card-json')
@Controller('card-json')
@ApiExcludeController()
export class CardJsonController {
  constructor(private readonly service: CardJsonService) {}

  @Get('json-file')
  async setCard() {
    await this.service.readFromCardInfoJson();
  }

  @Get('fetch/:startYear/:lastYear')
  async setInfoFromJson(
    @Param('startYear', ParseIntPipe) start: number,

    @Param('lastYear', ParseIntPipe) last: number,
  ) {
    await this.service.getCardsFromReleaseYearly(start, last);
  }
}
