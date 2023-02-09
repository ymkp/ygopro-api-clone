import {
  BadRequestException,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { JwtService } from '@nestjs/jwt';
import { plainToInstance } from 'class-transformer';
// import { EmailService } from 'src/shared/email';
import { compare, hash } from 'bcrypt';
import { RequestContext } from '../../shared/request-context/request-context.dto';
import { UserOutput, UserOutputMini } from '../../user/dtos/user-output.dto';
import { UserService } from '../../user/services/user.service';
import {
  AuthTokenOutput,
  UserAccessTokenClaims,
} from '../dtos/auth-token-output.dto';
import { SSOService } from 'src/user/services/sso.service';
import { OTPService } from 'src/shared/otp/otp.service';
// import { WhatsappService } from 'src/shared/whatsapp/whatsapp.service';
import {
  UserRegisterInputBody,
  UserRegisterSimpleBody,
} from 'src/user/dtos/user-input.dto';
import { BaseApiResponse } from 'src/shared/dtos/base-api-response.dto';

@Injectable()
export class AuthService {
  constructor(
    private readonly userService: UserService,
    private readonly jwtService: JwtService,
    private readonly configService: ConfigService,
    // private readonly emailService: EmailService,
    // private readonly waService: WhatsappService,
    private readonly ssoService: SSOService,
    private readonly otpService: OTPService,
  ) {}

  async grantSuperAdminToUser(
    ctx: RequestContext,
    ids: number[],
  ): Promise<void> {
    await this.userService.grantSuperAdminToUser(ctx, ids);
  }

  async revokeSuperAdminFromUser(
    ctx: RequestContext,
    ids: number[],
  ): Promise<void> {
    await this.userService.revokeSuperAdminFromUser(ctx, ids);
  }

  async validateUser(
    ctx: RequestContext,
    username: string,
    pass: string,
  ): Promise<UserAccessTokenClaims> {
    const user = await this.userService.validateUsernamePassword(
      username,
      pass,
    );

    // Prevent disabled users from logging in.
    if (user.isAccountDisabled) {
      throw new UnauthorizedException('This user account has been disabled');
    }

    return user;
  }

  public async login(ctx: RequestContext): Promise<AuthTokenOutput> {
    return await this.getAuthToken(ctx.user, ctx);
  }

  async logout(ctx: RequestContext): Promise<void> {
    // TODO : implement logout
  }

  async registerSimple(
    ctx: RequestContext,
    input: UserRegisterSimpleBody,
  ): Promise<AuthTokenOutput> {
    if (!input.password) {
      input.password = await this.createRandomPassword(input.email);
    }
    const registeredUser = await this.userService.registerUserSimple(
      ctx,
      input,
    );

    // await this.sendSetPasswordEmail(input.email);
    return this.getAuthToken(registeredUser, ctx);
  }

  async refreshToken(ctx: RequestContext): Promise<AuthTokenOutput> {
    const user = await this.userService.findById(ctx, ctx.user.id);
    if (!user) {
      throw new UnauthorizedException('Invalid user id');
    }

    return this.getAuthToken(user, ctx);
  }

  public async getAuthToken(
    user: UserAccessTokenClaims | UserOutput,
    ctx: RequestContext,
  ): Promise<AuthTokenOutput> {
    const secret = await this.otpService.getSecret(
      user.id,
      ctx.ip,
      ctx.userAgent,
    );
    const subject = { sub: user.id };
    const payload = {
      sub: user.id,

      isSuperAdmin: user.isSuperAdmin,
      isModerator: user.isModerator,
      secret,
    };
    const authToken = {
      refreshToken: this.jwtService.sign(subject, {
        expiresIn: this.configService.get('jwt.refreshTokenExpiresInSec'),
      }),
      accessToken: this.jwtService.sign(
        { ...payload, ...subject },
        {
          expiresIn: this.configService.get('jwt.accessTokenExpiresInSec'),
        },
      ),
    };
    return plainToInstance(AuthTokenOutput, authToken, {
      excludeExtraneousValues: true,
    });
  }

  public async getAuthTokenForSSOOverrideSecret(
    user: UserAccessTokenClaims | UserOutput,
    ctx: RequestContext,
  ): Promise<AuthTokenOutput> {
    const secret = await this.otpService.overrideSecret(
      user.id,
      ctx.ip,
      ctx.userAgent,
    );
    const subject = { sub: user.id };
    const payload = {
      sub: user.id,
      isSuperAdmin: user.isSuperAdmin,
      isModerator: user.isModerator,
      secret,
    };
    const authToken = {
      refreshToken: this.jwtService.sign(subject, {
        expiresIn: this.configService.get('jwt.refreshTokenExpiresInSec'),
      }),
      accessToken: this.jwtService.sign(
        { ...payload, ...subject },
        {
          expiresIn: this.configService.get('jwt.accessTokenExpiresInSec'),
        },
      ),
    };
    return plainToInstance(AuthTokenOutput, authToken, {
      excludeExtraneousValues: true,
    });
  }

  public async getAuthTokenWithSecret(
    ctx: RequestContext,
    otp: string,
  ): Promise<AuthTokenOutput> {
    const secret = await this.otpService.validateOTP(
      ctx.user.id,
      otp,
      ctx.ip,
      ctx.userAgent,
    );
    const subject = { sub: ctx.user.id };
    const payload = {
      sub: ctx.user.id,
      isSuperAdmin: ctx.user.isSuperAdmin,
      isModerator: ctx.user.isModerator,
      secret,
    };
    const authToken = {
      refreshToken: this.jwtService.sign(subject, {
        expiresIn: this.configService.get('jwt.refreshTokenExpiresInSec'),
      }),
      accessToken: this.jwtService.sign(
        { ...payload, ...subject },
        {
          expiresIn: this.configService.get('jwt.accessTokenExpiresInSec'),
        },
      ),
    };
    return plainToInstance(AuthTokenOutput, authToken, {
      excludeExtraneousValues: true,
    });
  }

  public async generateOTP(ctx: RequestContext) {
    const user = await this.userService.getUserSimple(ctx.user.id);
    const otp = await this.otpService.generateOTP(user.id);
    // await this.sendOtpToEmailAndWA(otp, user.email, user.phone);
  }

  // public async generateSSOTokenTHenSendTOEmail(
  //   email: string,
  // ): Promise<BaseApiResponse<string>> {
  //   const dataToken = await this.generateSSOToken(email);
  //   //  FIXME : should await ??
  //   this.emailService.sendMailCTA({
  //     to: email,
  //     subject: 'LSP Polri : Masuk Menggunakan SSO',
  //     cta: 'Masuk ke LSP Polri',
  //     link: dataToken.url,
  //     subtitle: 'Silakan klik tombol di bawah untuk masuk ke LSP Polri',
  //     title: 'LSP Polri : Masuk Menggunakan SSO',
  //   });
  //   return { data: 'ok' };
  // }

  public async generateSSOToken(
    email: string,
  ): Promise<{ data: string; url: string }> {
    const user = await this.userService.getUserByEmail(email);
    const expiresIn =
      this.configService.get('jwt.refreshTokenExpiresInSec') / 10;
    const subject = { sub: user.id };
    let ssoToken = this.jwtService.sign(subject, {
      expiresIn,
    });

    const tokenToSave = await hash(ssoToken, 10);
    await this.ssoService.saveSSOToken(tokenToSave, user.id, expiresIn);
    return {
      data: ssoToken,
      url:
        this.configService.get('fe_url') +
        this.configService.get('ssoLoginURL') +
        ssoToken,
    };
  }

  public async useSSOToken(
    ctx: RequestContext,
    ssoToken: string,
  ): Promise<AuthTokenOutput> {
    const user = await this.userService.getUserDetailById(ctx.user.id);
    await this.ssoService.useSSOToken(user.id, ssoToken);
    return this.getAuthTokenForSSOOverrideSecret(user, ctx);
  }

  // private async sendPasswordEmail(
  //   email: string,
  //   password: string,
  // ): Promise<void> {
  //   await this.emailService.sendMailWithText({
  //     to: email,
  //     subject: 'Akun E-BERKAS terbuat',
  //     cta: password,
  //     link: '',
  //     subtitle: 'Password anda di bawah ini',
  //     title: 'Akun E-BERKAS terbuat',
  //   });
  // }

  // private async sendSetPasswordEmail(email: string): Promise<void> {
  //   try {
  //     const payload = { email };
  //     const token = this.jwtService.sign(payload, {
  //       expiresIn: this.configService.get('jwt.refreshTokenExpiresInSec'),
  //     });
  //     const forgotPasswordURL = this.configService.get(
  //       'email.forgotPasswordURL',
  //     );
  //     const url = `${forgotPasswordURL}/${token}`;
  //     this.emailService.sendMailCTA({
  //       to: email,
  //       subject: 'Set Password',
  //       cta: url,
  //       link: url,
  //       subtitle: 'Set Password Anda dengan menekan tombol di bawah',
  //       title: 'Set Password Anda',
  //     });
  //   } catch (err) {
  //     console.log('EMAIL FAILED ! : ', err);
  //   }
  // }

  // private async sendForgetPasswordEmail(email: string): Promise<void> {
  //   try {
  //     const user = await this.userService.getUserByEmail(email);
  //     const payload = { email };
  //     const token = this.jwtService.sign(payload, {
  //       expiresIn: this.configService.get('jwt.refreshTokenExpiresInSec'),
  //     });
  //     const forgotPasswordURL = this.configService.get(
  //       'email.forgotPasswordURL',
  //     );
  //     const url = `${forgotPasswordURL}/${token}`;
  //     this.emailService.sendMailCTA({
  //       to: email,
  //       subject: 'Lupa Password',
  //       cta: url,
  //       link: url,
  //       subtitle: 'Ubah Password Anda dengan menekan tombol di bawah',
  //       title: 'Ubah Password Anda',
  //     });
  //   } catch (err) {
  //     console.log('failed to send email : ', err);
  //   }
  // }

  // async requestForgetPassword(email: string): Promise<void> {
  //   await this.sendForgetPasswordEmail(email);
  // }

  private async createRandomPassword(email: string): Promise<string> {
    // TODO : create random string 10 password
    // TODO : create email service, and send the password to email
    return Array(10)
      .fill(null)
      .map(() => Math.round(Math.random() * 16).toString(16))
      .join('');
  }

  public async decodeConfirmationToken(token: string) {
    try {
      const payload = await this.jwtService.verify(token, {});
      if (typeof payload === 'object' && 'email' in payload) {
        return payload.email;
      }
      throw new BadRequestException();
    } catch (error) {
      if (error?.name === 'TokenExpiredError') {
        throw new BadRequestException('Email confirmation token expired');
      }
      throw new BadRequestException('Bad confirmation token');
    }
  }

  public async changeForgottenPassword(email: string, password: string) {
    const user = await this.userService.getUserByEmail(email);
    await this.userService.editPassword(
      {
        ip: '',
        requestID: '',
        url: '',
        userAgent: '',
        user: {
          id: user.id,
          isSuperAdmin: false,
          isModerator: false,
        },
      },
      { password },
    );
  }

  // private async sendOtpToEmailAndWA(
  //   otp: string,
  //   email?: string,
  //   phone?: string,
  // ) {
  //   const text = 'OTP anda adalah : ' + otp;
  //   if (phone) {
  //     let contactMsisdn: string;
  //     if (phone.substring(0, 1) === '0') {
  //       contactMsisdn = '62' + phone.substring(1);
  //     }
  //     if (phone.substring(0, 1) === '+') {
  //       if (phone.substring(1, 3) === '62') {
  //         contactMsisdn = phone.substring(1);
  //       }
  //     }
  //     if (contactMsisdn) {
  //       this.waService.sendWhatsapp({
  //         contactMsisdn,
  //         content: text,
  //       });
  //     }
  //   }
  //   if (email) {
  //     this.emailService.sendMailCTA({
  //       cta: '',
  //       link: '',
  //       subject: 'OTP Baru',
  //       subtitle: text,
  //       title: 'Eberkas - OTP Baru',
  //       to: email,
  //     });
  //   }
  // }
}
