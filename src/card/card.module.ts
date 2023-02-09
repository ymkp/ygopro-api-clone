import { HttpModule } from '@nestjs/axios';
import { Module } from '@nestjs/common';
import { ArchetypeRepository } from 'src/archetype/repositories/archetype.repository';
import { CardImagesTempRepository } from 'src/card-images/repositories/card-images-temp.repository';
import { CardImagesRepository } from 'src/card-images/repositories/card-images.repository';
import { CardSetRarityRepository } from 'src/set-info/repositories/card-set-rarity.repository';
import { CardSetRepository } from 'src/set-info/repositories/card-set.repository';
import { SetInfoRepository } from 'src/set-info/repositories/set-info.repository';
import { SharedModule } from 'src/shared/shared.module';
import { TypeOrmExModule } from 'src/shared/typeorm-ex.module';
import { CardJsonController } from './controllers/card-json.controller';
import { CardController } from './controllers/card.controller';
import { CardRaceRepository } from './repositories/card-race.repository';
import { CardTypeRepository } from './repositories/card-type.repository';
import { CardRepository } from './repositories/card.repository';
import { CardJsonService } from './services/card-json.service';
import { CardService } from './services/card.service';

@Module({
  imports: [
    HttpModule,
    SharedModule,
    TypeOrmExModule.forCustomRepository([
      CardRepository,
      CardImagesRepository,
      CardImagesTempRepository,
      CardTypeRepository,
      CardRaceRepository,
      SetInfoRepository,
      CardSetRarityRepository,
      CardSetRepository,
      ArchetypeRepository,
    ]),
  ],
  providers: [
    // CardJsonService,
    CardService,
  ],
  controllers: [
    // CardJsonController,
    CardController,
  ],
})
export class CardModule {}
