import { ApiPropertyOptional } from '@nestjs/swagger';
import { IsDateString, IsEnum, IsOptional, IsString } from 'class-validator';
import { ORDER_ENUM } from 'src/shared/constants/order.enum';
import { SET_INFO_FILTER_ENUM } from '../constants/set-info-filter.enum';

export class SetInfoFilterInputDTO {
  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  name: string;

  @ApiPropertyOptional({
    description: 'Optional, e.g : 2022-07-20. defaults to today  ',
  })
  @IsDateString()
  @IsOptional()
  firstDate: string;

  @ApiPropertyOptional({
    description: 'Optional, e.g : 2022-07-21. defaults to today ',
  })
  @IsDateString()
  @IsOptional()
  lastDate: string;

  @ApiPropertyOptional({
    enum: SET_INFO_FILTER_ENUM,
  })
  @IsOptional()
  @IsEnum(SET_INFO_FILTER_ENUM)
  sortBy: string;

  @ApiPropertyOptional({
    enum: ORDER_ENUM,
  })
  @IsOptional()
  @IsEnum(ORDER_ENUM)
  order: string;
}
