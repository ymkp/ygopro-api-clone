import { ApiPropertyOptional } from '@nestjs/swagger';
import { Transform } from 'class-transformer';
import { IsEnum, IsNumber, IsOptional, IsString } from 'class-validator';
import { ORDER_ENUM } from 'src/shared/constants/order.enum';
import { CARD_FILTER_INPUT_SORT } from '../constants/card-filter-input.enum';

export class CardFilterInputDTO {
  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  name: string;

  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  type: string;

  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  race: string;

  @ApiPropertyOptional()
  @IsOptional()
  @Transform(({ value }) => parseInt(value, 10), { toClassOnly: true })
  @IsNumber()
  atkMin: number;

  @ApiPropertyOptional()
  @IsOptional()
  @Transform(({ value }) => parseInt(value, 10), { toClassOnly: true })
  @IsNumber()
  atkMax: number;

  @ApiPropertyOptional()
  @IsOptional()
  @Transform(({ value }) => parseInt(value, 10), { toClassOnly: true })
  @IsNumber()
  defMin: number;

  @ApiPropertyOptional()
  @IsOptional()
  @Transform(({ value }) => parseInt(value, 10), { toClassOnly: true })
  @IsNumber()
  defMax: number;

  @ApiPropertyOptional()
  @IsOptional()
  @Transform(({ value }) => parseInt(value, 10), { toClassOnly: true })
  @IsNumber()
  levelMin: number;

  @ApiPropertyOptional()
  @IsOptional()
  @Transform(({ value }) => parseInt(value, 10), { toClassOnly: true })
  @IsNumber()
  levelMax: number;

  @ApiPropertyOptional()
  @IsOptional()
  @Transform(({ value }) => parseInt(value, 10), { toClassOnly: true })
  @IsNumber()
  scaleMin: number;

  @ApiPropertyOptional()
  @IsOptional()
  @Transform(({ value }) => parseInt(value, 10), { toClassOnly: true })
  @IsNumber()
  scaleMax: number;

  @ApiPropertyOptional()
  @IsOptional()
  @Transform(({ value }) => parseInt(value, 10), { toClassOnly: true })
  @IsNumber()
  linkValMin: number;

  @ApiPropertyOptional()
  @IsOptional()
  @Transform(({ value }) => parseInt(value, 10), { toClassOnly: true })
  @IsNumber()
  linkValMax: number;

  @ApiPropertyOptional({
    enum: CARD_FILTER_INPUT_SORT,
  })
  @IsOptional()
  @IsEnum(CARD_FILTER_INPUT_SORT)
  sortBy: string;

  @ApiPropertyOptional({
    enum: ORDER_ENUM,
  })
  @IsOptional()
  @IsEnum(ORDER_ENUM)
  order: string;
}
