import {
  Body,
  ClassSerializerInterceptor,
  Controller,
  Get,
  HttpCode,
  HttpStatus,
  Param,
  ParseIntPipe,
  Post,
  UseGuards,
  UseInterceptors,
} from '@nestjs/common';
import {
  ApiBearerAuth,
  ApiExcludeController,
  ApiOperation,
  ApiResponse,
  ApiTags,
} from '@nestjs/swagger';
import { MultipleIdsToSingleEntityInput } from 'src/shared/dtos/id-value-input.dto';
import {
  UserRegisterInputBody,
  UserRegisterSimpleBody,
} from 'src/user/dtos/user-input.dto';

import {
  BaseApiErrorResponse,
  BaseApiResponse,
  SwaggerBaseApiResponse,
} from '../../shared/dtos/base-api-response.dto';
import { ReqContext } from '../../shared/request-context/req-context.decorator';
import { RequestContext } from '../../shared/request-context/request-context.dto';
import {
  EmailConfirmationBody,
  LoginInput,
} from '../dtos/auth-login-input.dto';
import { RefreshTokenInput } from '../dtos/auth-refresh-token-input.dto';
import { SSORequestInput, SSOUseInput } from '../dtos/auth-register-input.dto';
import { AuthTokenOutput } from '../dtos/auth-token-output.dto';
import { JwtAuthGuard } from '../guards/jwt-auth.guard';
import { JwtRefreshGuard } from '../guards/jwt-refresh.guard';
import { LocalAuthGuard } from '../guards/local-auth.guard';
import { SuperAdminGuard } from '../guards/superadmin.guard';
import { AuthService } from '../services/auth.service';

@ApiTags('auth')
@Controller('auth')
@ApiExcludeController()
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('login')
  @ApiOperation({
    summary: 'User login API',
  })
  @ApiResponse({
    status: HttpStatus.OK,
    type: SwaggerBaseApiResponse(AuthTokenOutput),
  })
  @ApiResponse({
    status: HttpStatus.UNAUTHORIZED,
    type: BaseApiErrorResponse,
  })
  @HttpCode(HttpStatus.OK)
  @UseGuards(LocalAuthGuard)
  @UseInterceptors(ClassSerializerInterceptor)
  public async login(
    @ReqContext() ctx: RequestContext,
    @Body() credential: LoginInput,
  ): Promise<BaseApiResponse<AuthTokenOutput>> {
    const authToken = await this.authService.login(ctx);
    return { data: authToken, meta: {} };
  }

  @Post('register/simple')
  @ApiOperation({
    summary: 'User registration API',
  })
  @ApiBearerAuth()
  async registerSimple(
    @ReqContext() ctx: RequestContext,
    @Body() input: UserRegisterSimpleBody,
  ): Promise<BaseApiResponse<AuthTokenOutput>> {
    const data = await this.authService.registerSimple(ctx, input);
    return { data, meta: {} };
  }

  @Post('refresh-token')
  @ApiOperation({
    summary: 'Refresh access token API',
  })
  @ApiResponse({
    status: HttpStatus.OK,
    type: SwaggerBaseApiResponse(AuthTokenOutput),
  })
  @ApiResponse({
    status: HttpStatus.UNAUTHORIZED,
    type: BaseApiErrorResponse,
  })
  @HttpCode(HttpStatus.OK)
  @UseGuards(JwtRefreshGuard)
  @UseInterceptors(ClassSerializerInterceptor)
  async refreshToken(
    @ReqContext() ctx: RequestContext,
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    @Body() credential: RefreshTokenInput,
  ): Promise<BaseApiResponse<AuthTokenOutput>> {
    const authToken = await this.authService.refreshToken(ctx);
    return { data: authToken, meta: {} };
  }

  @Post('grant-super-admin')
  @ApiOperation({
    summary: 'grant superadmin to a user',
  })
  @ApiBearerAuth()
  @UseGuards(JwtAuthGuard, SuperAdminGuard)
  public async grantSuperAdmin(
    @ReqContext() ctx: RequestContext,
    @Body() body: MultipleIdsToSingleEntityInput,
  ): Promise<void> {
    await this.authService.grantSuperAdminToUser(ctx, body.ids);
  }

  @Post('revoke-super-admin')
  @ApiOperation({
    summary: 'revoke superadmin from a user',
  })
  @ApiBearerAuth()
  @UseGuards(JwtAuthGuard, SuperAdminGuard)
  public async revokeSuperAdmin(
    @ReqContext() ctx: RequestContext,
    @Body() body: MultipleIdsToSingleEntityInput,
  ): Promise<void> {
    await this.authService.revokeSuperAdminFromUser(ctx, body.ids);
  }

  @Get('generate-otp')
  @ApiOperation({
    summary: 'generate otp',
  })
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  public async generateOTP(
    @ReqContext() ctx: RequestContext,
  ): Promise<BaseApiResponse<string>> {
    await this.authService.generateOTP(ctx);
    return { data: 'ok' };
  }

  @Get('validate-otp/:otp')
  @ApiOperation({
    summary: 'validate otp',
  })
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  public async validateOTP(
    @ReqContext() ctx: RequestContext,
    @Param('otp', ParseIntPipe) otp: number,
  ): Promise<BaseApiResponse<AuthTokenOutput>> {
    const data = await this.authService.getAuthTokenWithSecret(
      ctx,
      otp.toString(),
    );
    return { data };
  }

  @Post('logout')
  @ApiOperation({
    summary: 'logout',
  })
  public async logout(@ReqContext() ctx: RequestContext): Promise<void> {
    return await this.authService.logout(ctx);
  }

  @Post('get-sso-token')
  @ApiOperation({
    summary: 'get sso token v 0.0.0.0.0.0',
  })
  public async generateSSOToken(
    @Body() input: SSORequestInput,
  ): Promise<{ data: string; url: string }> {
    return await this.authService.generateSSOToken(input.email);
  }

  // @Post('send-sso-token')
  // @ApiOperation({
  //   summary: 'get sso token v 0.0.0.0.0.0',
  // })
  // public async generateSSOTokenThenSendToEmail(
  //   @Body() input: SSORequestInput,
  // ): Promise<BaseApiResponse<string>> {
  //   return await this.authService.generateSSOTokenTHenSendTOEmail(input.email);
  // }

  @Post('use-sso-token')
  @ApiOperation({
    summary: 'use sso token v 0.0.0.0.0.0.0',
  })
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  public async useSSOTOken(
    @ReqContext() ctx: RequestContext,
    @Body() input: SSOUseInput,
  ): Promise<AuthTokenOutput> {
    return await this.authService.useSSOToken(ctx, input.ssoToken);
  }

  @Post('change-forgotten-password')
  @ApiOperation({
    summary: 'change password from token from email',
  })
  @ApiResponse({
    status: HttpStatus.OK,
    type: SwaggerBaseApiResponse('ok'),
  })
  @ApiResponse({
    status: HttpStatus.UNAUTHORIZED,
    type: BaseApiErrorResponse,
  })
  @UseInterceptors(ClassSerializerInterceptor)
  async changeForgottenPassword(
    @Body() confirmationData: EmailConfirmationBody,
  ): Promise<void> {
    const email = await this.authService.decodeConfirmationToken(
      confirmationData.token,
    );
    await this.authService.changeForgottenPassword(
      email,
      confirmationData.password,
    );
  }

  // @Post('request-forget-password')
  // async requestForgetPassword(@Body() input: { email: string }): Promise<void> {
  //   await this.authService.requestForgetPassword(input.email);
  // }
}
