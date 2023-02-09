import { CanActivate, ExecutionContext, Injectable } from '@nestjs/common';
import { OTPService } from 'src/shared/otp/otp.service';

@Injectable()
export class JwtAuthSecretGuard implements CanActivate {
  constructor(private readonly otpService: OTPService) {}
  async canActivate(context: ExecutionContext): Promise<boolean> {
    // TODO : return this to normal
    // FIXME : yes, fix me
    // const { user } = context.switchToHttp().getRequest();
    // return await this.otpService.checkSecret(user.id, user.secret);
    return true;
  }
}
