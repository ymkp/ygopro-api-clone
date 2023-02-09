import { CacheModule, Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { OTPService } from './otp.service';
import { OTPSecretRepository } from './repositories/otp-secret.repository';
import {OtpSecret} from './entities/otp-secret.entity'

@Module({
  imports: [
    CacheModule.register({ ttl: 0 }),
    TypeOrmModule.forFeature([OtpSecret])

  ],
  providers: [OTPService, OTPSecretRepository],
  exports: [OTPSecretRepository, OTPService, CacheModule],
})
export class OTPModule {}
