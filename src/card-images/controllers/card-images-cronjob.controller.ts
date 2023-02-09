import { Controller, Get, Param, ParseIntPipe } from '@nestjs/common';
import { ApiExcludeController, ApiTags } from '@nestjs/swagger';
import { CardImagesCronjobService } from '../services/card-images-cronjob.service';

@ApiTags('card-images-cronjob')
@Controller('card-images-cronjob')
// @ApiExcludeController()
export class CardImagesCronjobController {
  constructor(private readonly service: CardImagesCronjobService) {}

  @Get('first-file')
  async setCard() {
    await this.service.setFirstImagesFromTemp();
  }
}
