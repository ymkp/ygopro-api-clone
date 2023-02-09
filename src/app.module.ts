import { Module } from '@nestjs/common';
import { CardModule } from './card/card.module';
import { ArchetypeModule } from './archetype/archetype.module';
import { CardImagesModule } from './card-images/card-images.module';
import { SetInfoModule } from './set-info/set-info.module';
import { ConfigModule } from './config/config.module';
import { SharedModule } from './shared/shared.module';
import { AuthModule } from './auth/auth.module';
import { UserModule } from './user/user.module';

@Module({
  imports: [
    SharedModule,
    AuthModule,
    UserModule,
    CardModule,
    ArchetypeModule,
    CardImagesModule,
    SetInfoModule,
    ConfigModule,
  ],
})
export class AppModule {}
