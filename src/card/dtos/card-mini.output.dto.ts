import { Exclude, Expose, Transform } from 'class-transformer';

@Exclude()
export class CardMiniOutputDTO {
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
  @Transform(({ value }) =>
    Array.isArray(value)
      ? value.length > 0
        ? process.env.IMAGE_URL + value[0].urlSmall
        : null
      : null,
  )
  cardImages: string;
}
