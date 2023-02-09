import { Injectable, NotAcceptableException } from '@nestjs/common';
import { OTPSecretRepository } from './repositories/otp-secret.repository';
import { memoryStore } from 'cache-manager';
var md5 = require('md5');

@Injectable()
export class OTPService {
  constructor(
    private readonly otpSecretRepo: OTPSecretRepository, // @Inject(CACHE_MANAGER) private readonly cacheManager: Cache,
  ) {
    this.getAndCacheOTPSecrets();
  }

  memoryCache = memoryStore({ ttl: 0 });

  public async checkSecret(userId: number, secret: string): Promise<boolean> {
    const s = await this.memoryCache.get<string>(`secret-${userId}`);
    if (s == undefined || s != secret) {
      throw new NotAcceptableException('otp needed');
    }
    return true;
  }

  public async getSecret(
    userId: number,
    ip: string,
    userAgent: string,
  ): Promise<string> {
    const secret = md5(`${userId}-${ip}-${userAgent}`);
    return secret;
  }

  public async overrideSecret(
    userId: number,
    ip: string,
    userAgent: string,
  ): Promise<string> {
    const secret = md5(`${userId}-${ip}-${userAgent}`);
    await this.memoryCache.set(`secret-${userId}`, secret, 0);
    return secret ?? '';
  }

  public async generateOTP(userId: number): Promise<string> {
    const first = Math.floor(Math.random() * 10);
    const second = Math.floor(Math.random() * 10);
    const third = Math.floor(Math.random() * 10);
    const fourth = Math.floor(Math.random() * 10);
    const otp = `${first}${second}${third}${fourth}`;

    await this.memoryCache.set(`otp-${userId}`, otp, 0);
    return otp;
  }

  public async validateOTP(
    userId: number,
    otp: string,
    ip: string,
    userAgent: string,
  ): Promise<string> {
    const o = await this.memoryCache.get<string>(`otp-${userId}`);
    if (otp != o) {
      throw new NotAcceptableException('otp not found');
    }
    await this.memoryCache.del(`otp-${userId}`);
    const secret = md5(`${userId}-${ip}-${userAgent}`);
    const otpSecretCheck = await this.otpSecretRepo.findOne({
      where: { userId },
    });
    if (otpSecretCheck) {
      await this.otpSecretRepo.delete(otpSecretCheck.id);
    }
    await this.otpSecretRepo.save({ userId, secret });

    await this.memoryCache.set(`secret-${userId}`, secret, 0);
    return secret;
  }

  private async getAndCacheOTPSecrets() {
    const secrets = await this.otpSecretRepo.find({
      select: ['id', 'userId', 'secret'],
    });
    for (let i = 0; i < secrets.length; i++) {
      await this.memoryCache.set(
        `secret-${secrets[i].userId}`,
        secrets[i].secret,
        0,
      );
    }
  }
}
