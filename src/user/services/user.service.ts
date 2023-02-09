import {
  BadRequestException,
  Injectable,
  NotFoundException,
  UnauthorizedException,
} from '@nestjs/common';
import { compare, hash } from 'bcrypt';
import { plainToInstance } from 'class-transformer';
import { BaseApiResponse } from 'src/shared/dtos/base-api-response.dto';
import { PaginationParamsDto } from 'src/shared/dtos/pagination-params.dto';
import { PaginationResponseDto } from 'src/shared/dtos/pagination-response.dto';
import { FindManyOptions, FindOptionsWhere, In, Like } from 'typeorm';

import { RequestContext } from '../../shared/request-context/request-context.dto';
import {
  UserEditPasswordBody,
  UserFilterInput,
  UserRegisterInputBody,
  UserRegisterSimpleBody,
} from '../dtos/user-input.dto';

import {
  UserDetailOutputDTO,
  UserOutput,
  UserOutputMini,
} from '../dtos/user-output.dto';
import { User } from '../entities/user.entity';
import { UserRepository } from '../repositories/user.repository';

@Injectable()
export class UserService {
  constructor(private readonly userRepo: UserRepository) {}

  async countUser(): Promise<number> {
    return await this.userRepo.count();
  }
  async registerUser(
    input: UserRegisterInputBody,
  ): Promise<UserDetailOutputDTO> {
    await this.checkUserFromInput(input);
    const userInput = plainToInstance(User, input);
    userInput.password = await hash(input.password, 10);
    const user = await this.userRepo.save(userInput);

    await this.userRepo.save(user);
    return plainToInstance(UserDetailOutputDTO, user, {
      excludeExtraneousValues: true,
    });
  }

  async registerUserSimple(
    ctx: RequestContext,
    input: UserRegisterSimpleBody,
  ): Promise<UserOutput> {
    await this.checkUserFromInput(input);
    const userInput = plainToInstance(User, input);
    userInput.password = await hash(input.password, 10);
    const user = await this.userRepo.save(userInput);
    await this.userRepo.save(user);
    return plainToInstance(UserOutput, user, {
      excludeExtraneousValues: true,
    });
  }

  private async checkUserFromInput(
    input: UserRegisterInputBody | UserRegisterSimpleBody,
  ): Promise<void> {
    const userFromEmail = await this.userRepo.findOne({
      where: { email: input.email },
    });
    if (userFromEmail) throw new BadRequestException('Email sudah dipakai');
  }

  async getUserByEmail(email: string): Promise<User> {
    return await this.userRepo.findOneOrFail({ where: { email } });
  }

  async getUserDetailById(id: number): Promise<User> {
    return await this.userRepo.findOneOrFail({ where: { id } });
  }

  async getUserDetailCompleteById(
    ctx: RequestContext,
    id: number,
  ): Promise<UserDetailOutputDTO> {
    if (!ctx.user.isModerator && !ctx.user.isSuperAdmin && ctx.user.id != id)
      throw new NotFoundException('Anda tidak bisa melihat user ini');
    const user = await this.userRepo.findOne({
      where: { id },
      relations: [
        'profile',
        'polriProfile',
        'polriProfile.pangkat',
        'pnsProfile',
        'pnsProfile.pangkat',
        'sipilProfile',
        'sipilProfile.organization',
        'profile.ijazah',
        'profile.pasFoto',
        'profile.ektp',
      ],
    });
    return plainToInstance(UserDetailOutputDTO, user);
  }

  async validateUsernamePassword(
    username: string,
    pass: string,
  ): Promise<UserOutput> {
    const user = await this.userRepo.find({
      where: [{ email: username }],
    });
    if (user.length === 0) throw new UnauthorizedException();
    let match = false;
    let userFound: User;
    for (let i = 0; i < user.length && !match; i++) {
      match = await compare(pass, user[i].password);
      if (match) userFound = user[i];
    }
    if (!match || !userFound) throw new UnauthorizedException();
    return plainToInstance(UserOutput, userFound, {
      excludeExtraneousValues: true,
    });
  }

  async getUsers(
    ctx: RequestContext,
    limit: number,
  ): Promise<{ users: UserOutput[]; count: number }> {
    const [users, count] = await this.userRepo.findAndCount({
      where: {},
      take: limit,
    });

    const usersOutput = plainToInstance(UserOutput, users, {
      excludeExtraneousValues: true,
    });

    return { users: usersOutput, count };
  }

  async getUsersWithFilterAndPagination(
    ctx: RequestContext,
    pageQ: PaginationParamsDto,
    filter: UserFilterInput,
  ): Promise<BaseApiResponse<UserOutput[]>> {
    const where: FindOptionsWhere<User> = {};
    const options: FindManyOptions<User> = {
      take: pageQ.limit,
      skip: (pageQ.page - 1) * pageQ.limit,
      select: {
        id: true,
        email: true,
        isAccountDisabled: true,
        isModerator: true,
        isSuperAdmin: true,
        updatedAt: true,
      },
      relations: ['profile'],
    };

    // ? ------------------------------------------------------------ FILTER BY INPUT

    if (filter.email) where.email = Like(`%${filter.email}%`);
    if (filter.isAccountDisabled)
      where.isAccountDisabled = filter.isAccountDisabled;
    if (filter.isSuperAdmin) where.isSuperAdmin = filter.isSuperAdmin;

    options.where = where;
    const [res, count] = await this.userRepo.findAndCount(options);
    const meta: PaginationResponseDto = {
      count,
      page: pageQ.page,
      maxPage: Math.ceil(count / pageQ.limit),
    };
    const data = plainToInstance(UserOutput, res);
    return { data, meta };
  }

  async getUserSimple(id: number): Promise<UserOutput> {
    const user = await this.userRepo.findOne({
      where: { id },
      select: ['id', 'email'],
      loadEagerRelations: false,
    });
    return plainToInstance(UserOutput, user);
  }

  async findById(ctx: RequestContext, id: number): Promise<UserOutput> {
    const user = await this.userRepo.findOne({ where: { id } });
    return plainToInstance(UserOutput, user, {
      excludeExtraneousValues: true,
    });
  }

  async editPassword(
    ctx: RequestContext,
    input: UserEditPasswordBody,
  ): Promise<void> {
    const user = await this.userRepo.getById(ctx.user.id);
    input.password = await hash(input.password, 10);
    user.password = input.password;
    await this.userRepo.save(user);
  }

  public async grantSuperAdminToUser(
    ctx: RequestContext,
    ids: number[],
  ): Promise<void> {
    const user = await this.userRepo.getById(ctx.user.id);
    if (user.isSuperAdmin) {
      const users = await this.userRepo.find({ where: { id: In(ids) } });
      if (users.length > 0) {
        users.forEach((u) => {
          u.isSuperAdmin = true;
        });
        await this.userRepo.save(users);
      } else {
        throw new BadRequestException();
      }
    } else {
      throw new UnauthorizedException();
    }
  }

  public async revokeSuperAdminFromUser(
    ctx: RequestContext,
    ids: number[],
  ): Promise<void> {
    const user = await this.userRepo.getById(ctx.user.id);
    if (user.isSuperAdmin) {
      const users = await this.userRepo.find({ where: { id: In(ids) } });
      if (users.length > 0) {
        users.forEach((u) => {
          u.isSuperAdmin = false;
        });
        await this.userRepo.save(users);
      } else {
        throw new BadRequestException();
      }
    } else {
      throw new UnauthorizedException();
    }
  }
}
