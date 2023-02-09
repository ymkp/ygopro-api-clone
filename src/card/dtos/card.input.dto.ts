import { number } from 'joi';
import { CARD_ATTRIBUTE_ENUM } from '../constants/card-attribute-type.enum';

export class CardInputDTO {
  ygoproId: number;
  name: string;
  typeId: number;
  desc: string;
  atk?: number;
  def?: number;
  level?: number;
  scale?: number;
  linkMarkers?: string[];
  raceId: number;
  attribute?: CARD_ATTRIBUTE_ENUM;
}
