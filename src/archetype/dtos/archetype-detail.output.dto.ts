import { Exclude, Expose, Transform, Type } from 'class-transformer';
import { CardMiniOutputDTO } from 'src/card/dtos/card-mini.output.dto';

@Exclude()
export class ArchetypeDetailOutputDTO {
  @Expose()
  name: string;

  @Expose()
  @Type(() => CardMiniOutputDTO)
  cards: CardMiniOutputDTO[];

  // @Expose()
  // @Transform(({ value }) =>
  //   Array.isArray(value)
  //     ? value.length > 0
  //       ? value.map((c) => c.ygoproId)
  //       : null
  //     : null,
  // )
  // cards: number[];
}
