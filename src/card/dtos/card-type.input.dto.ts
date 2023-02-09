import { CARD_FRAME_TYPE_ENUM } from '../constants/card-frame-type.enum';
import { CARD_TYPE_TYPE_ENUM } from '../constants/card-type-type.enum';

export class CardTypeInputDTO {
  name: string;
  type: CARD_TYPE_TYPE_ENUM;
  frameType: CARD_FRAME_TYPE_ENUM;
}
