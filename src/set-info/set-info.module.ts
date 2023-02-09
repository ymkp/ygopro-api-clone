import { Module } from '@nestjs/common';
import { SharedModule } from 'src/shared/shared.module';
import { TypeOrmExModule } from 'src/shared/typeorm-ex.module';
import { UserRepository } from 'src/user/repositories/user.repository';
import { SetInfoJsonController } from './controllers/set-info-json.controller';
import { SetInfoController } from './controllers/set-info.controller';
import { CardSetRarityRepository } from './repositories/card-set-rarity.repository';
import { CardSetRepository } from './repositories/card-set.repository';
import { SetInfoRepository } from './repositories/set-info.repository';
import { SetInfoJsonService } from './services/set-info-json.service';
import { SetInfoService } from './services/set-info.service';

@Module({
  imports: [
    SharedModule,
    TypeOrmExModule.forCustomRepository([
      CardSetRepository,
      CardSetRarityRepository,
      SetInfoRepository,
    ]),
  ],
  providers: [
    // SetInfoJsonService,
    SetInfoService,
  ],
  controllers: [
    // SetInfoJsonController,
    SetInfoController,
  ],
})
export class SetInfoModule {}
