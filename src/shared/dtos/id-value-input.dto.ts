import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import {
  ArrayNotEmpty,
  IsNotEmpty,
  IsNumber,
  IsOptional,
  IsString,
} from 'class-validator';

export class MultipleIdsToSingleEntityInput {
  @ApiProperty({ type: [Number] })
  @ArrayNotEmpty()
  ids: number[];

  @ApiProperty()
  @IsNumber()
  @IsNotEmpty()
  entityId: number;
}

export class SingleIdToSingleEntityInput {
  @ApiProperty()
  @IsNumber()
  @IsNotEmpty()
  id: number;

  @ApiProperty()
  @IsNumber()
  @IsNotEmpty()
  entityId: number;
}

export class IdNameInputAllRequired {
  @ApiProperty()
  @IsNumber()
  @IsNotEmpty()
  id: number;

  @ApiProperty()
  @IsString()
  @IsNotEmpty()
  name: string;
}

export class IdNameInput {
  @ApiProperty()
  @IsString()
  @IsNotEmpty()
  name: string;
}

export class IdNameInputAllOptional {
  @ApiPropertyOptional()
  @IsNumber()
  @IsOptional()
  id: number;

  @ApiPropertyOptional()
  @IsString()
  @IsOptional()
  name: string;
}
