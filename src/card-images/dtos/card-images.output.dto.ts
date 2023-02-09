import { Exclude, Expose, Transform } from 'class-transformer';

@Exclude()
export class CardImagesOutputDTO {
  @Expose()
  @Transform(({ value }) => process.env.IMAGE_URL + value)
  url: string;

  @Expose()
  @Transform(({ value }) => process.env.IMAGE_URL + value)
  urlSmall: string;

  @Expose()
  @Transform(({ value }) => process.env.IMAGE_URL + value)
  urlCropped: string;
}
