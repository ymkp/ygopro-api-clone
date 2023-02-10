import { Exclude, Expose } from 'class-transformer';
import { CardInfoOnSetOutputDTO } from './card-info-on-set.output.dto';

@Exclude()
export class SetInfoDetailOutputDTO {
  @Expose()
  name: string;

  @Expose()
  code: string;

  @Expose()
  nCards: number;

  @Expose()
  tcgRelease: Date;

  cards: CardInfoOnSetOutputDTO[];
}
