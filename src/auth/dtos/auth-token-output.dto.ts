import { ApiProperty } from '@nestjs/swagger';
import { Expose } from 'class-transformer';

export class AuthTokenOutput {
  @Expose()
  @ApiProperty()
  accessToken: string;

  @Expose()
  @ApiProperty()
  refreshToken: string;
}

export class UserAccessTokenClaims {
  @Expose()
  id: number;

  @Expose()
  isSuperAdmin: boolean;

  @Expose()
  isModerator: boolean;

  @Expose()
  secret?: string;
}

export class UserRefreshTokenClaims {
  id: number;
}
