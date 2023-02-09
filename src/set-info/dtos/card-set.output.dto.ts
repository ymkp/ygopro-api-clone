import { Exclude, Expose, Transform, Type } from 'class-transformer';
import { SetInfoOutputDTO } from './set-info.output.dto';

@Exclude()
export class CardSetOutputDTO {
  @Expose()
  @Type(() => SetInfoOutputDTO)
  setInfo: SetInfoOutputDTO;

  @Expose()
  code: string;

  @Expose()
  @Transform(({ value }) => value?.name ?? null)
  rarity: string;
}
