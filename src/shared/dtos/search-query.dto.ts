import {
  ApiOperation,
  ApiProperty,
  ApiPropertyOptional,
} from '@nestjs/swagger';
import { IsNotEmpty, IsOptional, IsString } from 'class-validator';

export class SearchQuery {
  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  search: string;
}

export class SearchBody {
  @ApiProperty()
  @IsNotEmpty()
  @IsString()
  search: string;
}
