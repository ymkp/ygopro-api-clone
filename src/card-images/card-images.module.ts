import { HttpModule } from '@nestjs/axios';
import { Module } from '@nestjs/common';
import { ScheduleModule } from '@nestjs/schedule';
import { SharedModule } from 'src/shared/shared.module';
import { TypeOrmExModule } from 'src/shared/typeorm-ex.module';
// import { CardImagesCronjobController } from './controllers/card-images-cronjob.controller';
import { CardImagesTempRepository } from './repositories/card-images-temp.repository';
import { CardImagesRepository } from './repositories/card-images.repository';
import { CardImagesCronjobService } from './services/card-images-cronjob.service';

@Module({
  imports: [
    SharedModule,
    HttpModule,
    ScheduleModule.forRoot(),
    TypeOrmExModule.forCustomRepository([
      CardImagesTempRepository,
      CardImagesRepository,
    ]),
  ],
  providers: [CardImagesCronjobService],
  // controllers: [CardImagesCronjobController],
})
export class CardImagesModule {}
