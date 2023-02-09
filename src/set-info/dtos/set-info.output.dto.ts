import { Exclude, Expose } from 'class-transformer';

@Exclude()
export class SetInfoOutputDTO {
  @Expose()
  name: string;

  @Expose()
  code: string;

  @Expose()
  nCards: number;

  @Expose()
  tcgRelease: Date;
}
