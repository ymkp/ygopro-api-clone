import { ApiProperty } from '@nestjs/swagger';
import { Exclude, Expose, Transform, Type } from 'class-transformer';

@Exclude()
export class UserDetailOutputDTO {
  @Expose()
  id: number;

  @Expose()
  email: string;

  @Expose()
  phone: string;

  @Expose()
  isAccountDisabled: boolean;

  @Expose()
  isSuperAdmin: boolean;

  @Expose()
  isModerator: boolean;

  @Expose()
  updatedAt: string;
}

@Exclude()
export class UserOutput {
  @Expose()
  @ApiProperty()
  id: number;

  @Expose()
  @ApiProperty()
  email: string;

  @Expose()
  @ApiProperty()
  phone: string;

  @Expose()
  @ApiProperty()
  isAccountDisabled: boolean;

  @Expose()
  @ApiProperty()
  isModerator: boolean;

  @Expose()
  @ApiProperty()
  isSuperAdmin: boolean;

  @Expose()
  @ApiProperty()
  updatedAt: string;

  @Expose()
  @ApiProperty()
  secret?: string;
}

@Exclude()
export class UserOutputMini {
  @Expose()
  @ApiProperty()
  id: number;

  @Expose()
  @ApiProperty()
  email: string;
}
