import {
  Body,
  ClassSerializerInterceptor,
  Controller,
  Get,
  Param,
  Patch,
  ParseIntPipe,
  Query,
  UseGuards,
  UseInterceptors,
  Post,
} from '@nestjs/common';
import {
  ApiBearerAuth,
  ApiExcludeController,
  ApiOperation,
  ApiResponse,
  ApiTags,
} from '@nestjs/swagger';
import { JwtAuthSecretGuard } from 'src/auth/guards/jwt-auth-secret.guard';
import { ModeratorGuard } from 'src/auth/guards/moderator.guard';
import { SuperAdminGuard } from 'src/auth/guards/superadmin.guard';
import { IdValNumberDTO } from 'src/shared/dtos/id-value-response.dto';
import { JwtAuthGuard } from '../../auth/guards/jwt-auth.guard';
import {
  BaseApiResponse,
  SwaggerBaseApiResponse,
} from '../../shared/dtos/base-api-response.dto';
import { PaginationParamsDto } from '../../shared/dtos/pagination-params.dto';

import { ReqContext } from '../../shared/request-context/req-context.decorator';
import { RequestContext } from '../../shared/request-context/request-context.dto';
import {
  UserEditPasswordBody,
  UserFilterInput,
  UserRegisterInputBody,
} from '../dtos/user-input.dto';
import {
  UserDetailOutputDTO,
  UserOutput,
  UserOutputMini,
} from '../dtos/user-output.dto';
import { UserService } from '../services/user.service';

@ApiTags('user')
@Controller('user')
@UseGuards(JwtAuthGuard, JwtAuthSecretGuard)
@ApiBearerAuth()
@ApiExcludeController()
export class UserController {
  constructor(private readonly userService: UserService) {}

  @ApiBearerAuth()
  @UseInterceptors(ClassSerializerInterceptor)
  @Get('me')
  @ApiOperation({
    summary: 'Get user me API',
  })
  async getMyProfile(
    @ReqContext() ctx: RequestContext,
  ): Promise<BaseApiResponse<UserDetailOutputDTO>> {
    const data = await this.userService.getUserDetailCompleteById(
      ctx,
      ctx.user.id,
    );
    return { data };
  }

  @Post('create/full')
  @UseGuards(ModeratorGuard)
  @ApiOperation({
    summary: 'create user with profile',
  })
  async createUserFull(
    @Body() input: UserRegisterInputBody,
  ): Promise<UserDetailOutputDTO> {
    return await this.userService.registerUser(input);
  }

  @Get('count/user')
  @UseGuards(SuperAdminGuard)
  @ApiOperation({
    summary: 'get users count',
  })
  async getUsersCount(): Promise<IdValNumberDTO> {
    const value = await this.userService.countUser();
    return { id: 0, value };
  }

  @Get('/pagination/')
  @ApiOperation({
    summary: 'get users with pagination and filter',
  })
  async getUsersWithPaginationAndFilters(
    @ReqContext() ctx: RequestContext,
    @Query() pageQ: PaginationParamsDto,
    @Query() filter: UserFilterInput,
  ): Promise<BaseApiResponse<UserOutput[]>> {
    return await this.userService.getUsersWithFilterAndPagination(
      ctx,
      pageQ,
      filter,
    );
  }

  @Get('/pagination/admin')
  @ApiOperation({
    summary: 'get users with pagination and filter',
  })
  @UseGuards(SuperAdminGuard)
  async getAdminWithPaginationAndFilters(
    @ReqContext() ctx: RequestContext,
    @Query() pageQ: PaginationParamsDto,
    @Query() filter: UserFilterInput,
  ): Promise<BaseApiResponse<UserOutputMini[]>> {
    filter.isSuperAdmin = true;
    return await this.userService.getUsersWithFilterAndPagination(
      ctx,
      pageQ,
      filter,
    );
  }

  @Get(':id')
  @ApiOperation({
    summary: 'Get user detail complete by id API',
  })
  async getUser(
    @ReqContext() ctx: RequestContext,
    @Param('id', ParseIntPipe) id: number,
  ): Promise<UserDetailOutputDTO> {
    return await this.userService.getUserDetailCompleteById(ctx, id);
  }

  @Patch('edit/password')
  @ApiOperation({
    summary: 'Update user password',
  })
  @UseInterceptors(ClassSerializerInterceptor)
  async editPassword(
    @ReqContext() ctx: RequestContext,
    @Body() input: UserEditPasswordBody,
  ): Promise<void> {
    await this.userService.editPassword(ctx, input);
  }
}
