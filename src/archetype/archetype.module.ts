import { Module } from '@nestjs/common';
import { SharedModule } from 'src/shared/shared.module';
import { TypeOrmExModule } from 'src/shared/typeorm-ex.module';
import { ArchetypeController } from './controllers/archetype.controller';
import { ArchetypeRepository } from './repositories/archetype.repository';
import { ArchetypeService } from './services/archetype.service';

@Module({
  imports: [
    SharedModule,
    TypeOrmExModule.forCustomRepository([ArchetypeRepository]),
  ],
  providers: [ArchetypeService],
  controllers: [ArchetypeController],
})
export class ArchetypeModule {}
