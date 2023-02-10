import { ApiPropertyOptional } from '@nestjs/swagger';
import { IsOptional, IsString } from 'class-validator';

export class ArchetypeFilterInputDTO {
  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  name: string;
}
