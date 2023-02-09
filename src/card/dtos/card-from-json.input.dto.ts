export class CardFromJsonInputCardSetDTO {
  set_name: string;
  set_code: string;
  set_rarity: string;
  set_rarity_code: string;
  set_price: string;
}

export class CardFromJsonInputCardImagesDTO {
  id: number;
  image_url?: string;
  image_url_small?: string;
  image_url_cropped?: string;
}

export class CardFromJsonInputDTO {
  id: number;
  name: string;
  type: string;
  frameType: string;
  desc: string;
  atk?: number;
  def?: number;
  level?: number;
  race: string;
  attribute?: string;
  archetype?: string;
  scale?: number;
  linkval?: number;
  linkmarkers?: string[];
  card_sets?: CardFromJsonInputCardSetDTO[];
  card_images?: CardFromJsonInputCardImagesDTO[];
}
