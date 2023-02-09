import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { Transform } from 'class-transformer';
import {
  IsBoolean,
  IsDateString,
  IsEmail,
  IsEnum,
  IsNotEmpty,
  IsNumber,
  IsOptional,
  IsString,
} from 'class-validator';

//FIXME
export class UserFilterInput {
  @ApiPropertyOptional()
  @IsString()
  @IsOptional()
  name: string;

  @ApiPropertyOptional()
  @IsString()
  @IsOptional()
  username: string;

  @ApiPropertyOptional()
  @IsString()
  @IsOptional()
  email: string;

  @ApiPropertyOptional()
  @IsString()
  @IsOptional()
  identificationNo: string;

  @ApiPropertyOptional()
  @IsBoolean()
  @IsOptional()
  isAccountDisabled: boolean;

  @ApiPropertyOptional()
  @IsBoolean()
  @IsOptional()
  isSuperAdmin: boolean;

  @ApiPropertyOptional()
  @IsDateString()
  @IsOptional()
  createdAt: string;

  @ApiPropertyOptional()
  @IsDateString()
  @IsOptional()
  updatedAt: string;
}

export class UserRegisterSimpleBody {
  @ApiProperty()
  @IsEmail()
  @IsNotEmpty()
  email: string;

  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  password: string;

  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  phone?: string;
}

export class UserRegisterInputBody {
  @ApiProperty()
  @IsEmail()
  @IsNotEmpty()
  email: string;

  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  password: string;

  @ApiProperty()
  @IsNotEmpty()
  @IsString()
  name: string;

  @ApiProperty()
  @IsNotEmpty()
  @IsString()
  placeOfBirth: string;

  @ApiProperty()
  @IsNotEmpty()
  @IsDateString()
  dateOfBirth: Date;

  @ApiProperty()
  @IsNotEmpty()
  @IsString()
  addressKTP: string;

  @ApiProperty()
  @IsNotEmpty()
  @IsString()
  address: string;

  @ApiProperty()
  @IsNotEmpty()
  @IsString()
  nik: string;

  @ApiProperty()
  @IsNotEmpty()
  @IsString()
  phone: string;
}

export class UserEditPasswordBody {
  @ApiProperty()
  @IsString()
  @IsNotEmpty()
  password: string;
}
