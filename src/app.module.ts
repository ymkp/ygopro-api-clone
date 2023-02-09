import { Module } from '@nestjs/common';
import { CardModule } from './card/card.module';
import { ArchetypeModule } from './archetype/archetype.module';
import { CardImagesModule } from './card-images/card-images.module';
import { SetInfoModule } from './set-info/set-info.module';
import { ConfigModule } from './config/config.module';
import { SharedModule } from './shared/shared.module';
import { AuthModule } from './auth/auth.module';
import { UserModule } from './user/user.module';
import { ServeStaticModule } from '@nestjs/serve-static';
import { join } from 'path';

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
    ServeStaticModule.forRoot({
      rootPath: join(__dirname, '..', 'static'),
    }),
  ],
})
export class AppModule {}
