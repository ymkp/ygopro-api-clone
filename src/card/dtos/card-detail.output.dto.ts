import { Exclude, Expose, Transform, Type } from 'class-transformer';
import { CardImagesOutputDTO } from 'src/card-images/dtos/card-images.output.dto';
import { CardSetOutputDTO } from 'src/set-info/dtos/card-set.output.dto';
import { IdNameStringDTO } from 'src/shared/dtos/id-value-response.dto';

@Exclude()
export class CardDetailOutputDTO {
  @Expose()
  id: number;

  @Expose()
  name: string;

  @Expose()
  @Transform(({ value }) => value?.name ?? null)
  type: string;

  @Expose()
  @Transform(({ value }) => value?.name ?? null)
  race: string;

  @Expose()
  attribute: string;

  @Expose()
  desc: string;

  @Expose()
  atk: number;

  @Expose()
  def: number;

  @Expose()
  level: number;

  @Expose()
  scale: number;

  @Expose()
  linkVal: number;

  @Expose()
  linkMarkers: string[];

  @Expose()
  @Type(() => CardImagesOutputDTO)
  cardImages: CardImagesOutputDTO[];

  @Expose()
  @Type(() => IdNameStringDTO)
  archetypes: IdNameStringDTO[];

  @Expose()
  @Type(() => CardSetOutputDTO)
  cardSets: CardSetOutputDTO[];
}
