import { Module } from '@nestjs/common';

import { SharedModule } from '../shared/shared.module';
import { UserController } from './controllers/user.controller';
import { UserService } from './services/user.service';
import { UserAclService } from './services/user-acl.service';
import { SSOService } from './services/sso.service';
import { TypeOrmExModule } from 'src/shared/typeorm-ex.module';
import { SSOTokenRepository } from './repositories/sso-token.repository';
import { UserRepository } from './repositories/user.repository';

@Module({
  imports: [
    SharedModule,
    TypeOrmExModule.forCustomRepository([SSOTokenRepository, UserRepository]),
  ],
  providers: [
    UserService,
    UserAclService,
    SSOService,
    // FileBerkasService,
  ],
  controllers: [UserController],
  exports: [UserService, SSOService],
})
export class UserModule {}
