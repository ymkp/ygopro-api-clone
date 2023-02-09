import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { IsEmail, IsNotEmpty, IsString, MaxLength } from 'class-validator';

export class SSORequestInput {
  @ApiProperty()
  @IsNotEmpty()
  @IsString()
  @MaxLength(100)
  email: string;
}

export class SSOUseInput {
  @ApiProperty()
  @IsNotEmpty()
  @IsString()
  ssoToken: string;
}
