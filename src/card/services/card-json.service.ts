import { BadRequestException, Injectable } from '@nestjs/common';
import { CardImagesTempRepository } from 'src/card-images/repositories/card-images-temp.repository';
import { CardSetRarityRepository } from 'src/set-info/repositories/card-set-rarity.repository';
import { CardSetRepository } from 'src/set-info/repositories/card-set.repository';
import { SetInfoRepository } from 'src/set-info/repositories/set-info.repository';
import { CardRaceRepository } from '../repositories/card-race.repository';
import { CardTypeRepository } from '../repositories/card-type.repository';
import { CardRepository } from '../repositories/card.repository';
import { readFileSync } from 'fs';
import {
  CardFromJsonInputCardImagesDTO,
  CardFromJsonInputCardSetDTO,
  CardFromJsonInputDTO,
} from '../dtos/card-from-json.input.dto';
import { CardTypeInputDTO } from '../dtos/card-type.input.dto';
import {
  CARD_TYPE_TYPE_ENUM,
  extraDeckMembers,
  mainDeckMembers,
} from '../constants/card-type-type.enum';
import { CARD_FRAME_TYPE_ENUM } from '../constants/card-frame-type.enum';
import {
  CARD_RACE_TYPE_ENUM,
  monsterMembers,
  spellMembers,
  trapMembers,
} from '../constants/card-race-type.enum';

import { CardType } from '../entities/card-type.entity';
import { CardRace } from '../entities/card-race.entity';
import { CARD_ATTRIBUTE_ENUM } from '../constants/card-attribute-type.enum';
import { CardInputDTO } from '../dtos/card.input.dto';
import { Archetype } from 'src/archetype/entities/archetype.entity';
import { ArchetypeRepository } from 'src/archetype/repositories/archetype.repository';
import { CardSet } from 'src/set-info/entities/card-set.entity';
import { SetInfo } from 'src/set-info/entities/set-info.entity';
import { CardSetRarity } from 'src/set-info/entities/card-set-rarity.entity';
import { HttpService } from '@nestjs/axios';
import { firstValueFrom } from 'rxjs';

@Injectable()
export class CardJsonService {
  constructor(
    private readonly cardRepo: CardRepository,
    private readonly imageTempRepo: CardImagesTempRepository,
    private readonly typeRepo: CardTypeRepository,
    private readonly raceRepo: CardRaceRepository,
    private readonly setRepo: SetInfoRepository,
    private readonly setRarityRepo: CardSetRarityRepository,
    private readonly cardSetRepo: CardSetRepository,
    private readonly archetypeRepo: ArchetypeRepository,
    private readonly http: HttpService,
  ) {}

  tmpCardTypes: CardType[] = [];
  tmpCardRaces: CardRace[] = [];
  tmpArchetypes: Archetype[] = [];
  tmpSets: SetInfo[] = [];
  tmpRarities: CardSetRarity[] = [];

  async readFromCardInfoJson() {
    const str = readFileSync('assets/cardinfo.json', 'utf8');
    const data = JSON.parse(str)['data'] as CardFromJsonInputDTO[];
    await this.saveCardFromJson(data);
  }

  async getCardsFromReleaseYearly(startYear: number, lastYear: number) {
    if (startYear < 2000)
      throw new BadRequestException(
        'I am sure there is no TCG cards released on ' + startYear,
      );
    if (lastYear > new Date(Date.now()).getFullYear())
      throw new BadRequestException(
        'I think there is no TCG cards released on ' + lastYear + ' yet',
      );

    for (let i = startYear; i <= lastYear; i++) {
      for (let m = 1; m <= 12; m++) {
        try {
          console.log('try month : ', m, ' : ', i);
          const res = await firstValueFrom(
            this.http.get(
              `https://db.ygoprodeck.com/api/v7/cardinfo.php?&startdate=${m}/01/${i}&enddate=${m}/31/${i}&dateregion=tcg_date`,
            ),
          );
          if (res.status === 200) {
            const data: CardFromJsonInputDTO[] = res.data['data'];
            await this.saveCardFromJson(data);
          } else {
            console.warn(res.status, res.statusText);
          }
        } catch (err) {
          console.log(' month : ', m, ' : ', i, 'failed');
        }

        await new Promise((r) => setTimeout(r, 15000));
      }
    }
  }

  private async saveCardFromJson(data: CardFromJsonInputDTO[]) {
    console.log('data to check : ', data.length);
    for (let i = 0; i < data.length; i++) {
      const check = await this.cardRepo.findOne({
        where: { name: data[i].name },
      });
      if (!check) {
        const [type, race, archetype] = await this.getTypeRaceArchetype(
          data[i].type,
          data[i].frameType,
          data[i].race,
          data[i].archetype,
        );
        const toSave: CardInputDTO = {
          ygoproId: data[i].id,
          name: data[i].name,
          desc: data[i].desc,
          atk: data[i].atk,
          def: data[i].def,
          level: data[i].level,
          scale: data[i].scale,
          linkMarkers: data[i].linkmarkers,
          attribute: this.getAttribute(data[i].attribute),
          raceId: race.id,
          typeId: type.id,
          // archetypes: archetype ? [archetype.id] : [],
        };
        const card = await this.cardRepo.save(toSave);
        if (archetype) {
          card.archetypes = [archetype];
          await this.cardRepo.save(card);
        }
        if (data[i].card_sets) {
          await this.setCardSets(card.id, data[i].card_sets);
        }
        if (data[i].card_images) {
          await this.setImagesTemp(card.id, data[i].card_images);
        }
        // console.log(
        //   `${((100 * i) / data.length).toPrecision(3)}%`,
        //   data[i].name,
        //   data[i].id,
        //   'successfully saved',
        // );
      } else {
        // console.log(
        //   `${((100 * i) / data.length).toPrecision(3)}}%`,
        //   data[i].name,
        //   data[i].id,
        //   'exists',
        // );
      }
    }
  }

  private async getTypeRaceArchetype(
    type: string,
    frameType: string,
    race: string,
    archetype: string,
  ): Promise<[CardType, CardRace, Archetype]> {
    const t = await this.getOrCreateCardType(type, frameType);
    const r = await this.getOrCreateCardRace(race, frameType);
    const a = await this.getOrSetArchetypes(archetype);
    return [t, r, a];
  }

  private async getOrCreateCardType(
    name: string,
    frame: string,
  ): Promise<CardType> {
    var cardType: CardType = this.tmpCardTypes.find((o) => o.name === name);

    if (!cardType) {
      cardType = await this.typeRepo.findOne({ where: { name } });
      if (!cardType) {
        const type = this.getCardTypeType(name);
        const frameType = this.getCardFrameType(frame);
        cardType = await this.typeRepo.save({
          name,
          type,
          frameType,
        });
      }
      if (cardType) this.tmpCardTypes.push(cardType);
    }
    return cardType;
  }

  private getCardTypeType(name: string): CARD_TYPE_TYPE_ENUM {
    if (mainDeckMembers.includes(name)) {
      return CARD_TYPE_TYPE_ENUM.MAIN_DECK;
    } else if (extraDeckMembers.includes(name)) {
      return CARD_TYPE_TYPE_ENUM.EXTRA_DECK;
    } else {
      return CARD_TYPE_TYPE_ENUM.OTHER;
    }
  }

  private getCardFrameType(frameType: string): CARD_FRAME_TYPE_ENUM {
    try {
      const res = frameType
        .replace('_', ' ')
        .toUpperCase() as CARD_FRAME_TYPE_ENUM;
      return res;
    } catch (err) {
      return CARD_FRAME_TYPE_ENUM.UNKNOWN;
    }
  }

  private async getOrCreateCardRace(
    name: string,
    frame: string,
  ): Promise<CardRace> {
    var cardRace: CardRace = this.tmpCardRaces.find((o) => o.name === name);
    if (!cardRace) {
      cardRace = await this.raceRepo.findOne({ where: { name } });
      if (!cardRace) {
        var type = CARD_RACE_TYPE_ENUM.UNKNOWN;
        if (frame === 'spell') {
          type = CARD_RACE_TYPE_ENUM.SPELL;
        } else if (frame === 'trap') {
          type = CARD_RACE_TYPE_ENUM.TRAP;
        } else {
          if (monsterMembers.includes(name)) {
            type = CARD_RACE_TYPE_ENUM.MONSTER;
          }
        }
        cardRace = await this.raceRepo.save({ name, type });
      }
      if (cardRace) this.tmpCardRaces.push(cardRace);
    }
    return cardRace;
  }

  private getAttribute(input?: string): CARD_ATTRIBUTE_ENUM {
    if (!input) return null;
    try {
      const res = input.toUpperCase() as CARD_ATTRIBUTE_ENUM;
      return res;
    } catch (err) {
      return null;
    }
  }

  private async getOrSetArchetypes(name?: string): Promise<Archetype> {
    if (!name) return null;
    var archetype: Archetype = this.tmpArchetypes.find((o) => o.name === name);
    if (!archetype) {
      archetype = await this.archetypeRepo.findOne({ where: { name } });
      if (!archetype) {
        archetype = await this.archetypeRepo.save({ name });
      }
      if (archetype) this.tmpArchetypes.push(archetype);
    }
    return archetype;
  }

  private async setCardSets(
    cardId: number,
    inputs: CardFromJsonInputCardSetDTO[],
  ) {
    for (let i = 0; i < inputs.length; i++) {
      const setInfo = await this.getSetInfo(inputs[i].set_name);
      if (setInfo) {
        const rarity = await this.getOrCreateRarity(
          inputs[i].set_rarity,
          inputs[i].set_rarity_code,
        );
        await this.cardSetRepo.save({
          cardId,
          code: inputs[i].set_code,
          setInfo,
          setPrice: inputs[i].set_price,
          rarity,
        });
      } else {
        console.warn(inputs[i].set_name, 'doesnt have ID');
      }
    }
  }

  private async getOrCreateRarity(
    name: string,
    code: string,
  ): Promise<CardSetRarity> {
    var rarity = this.tmpRarities.find((o) => o.name === name);
    if (!rarity) {
      rarity = await this.setRarityRepo.findOne({ where: { name } });
      if (!rarity) {
        rarity = await this.setRarityRepo.save({ name, code });
      }
      if (rarity) this.tmpRarities.push(rarity);
    }
    return rarity;
  }

  private async getSetInfo(name: string): Promise<SetInfo> {
    var set = this.tmpSets.find((o) => o.name === name);
    if (!set) {
      set = await this.setRepo.findOne({ where: { name } });
      if (set) this.tmpSets.push(set);
    }
    return set;
  }

  private async setImagesTemp(
    cardId: number,
    inputs: CardFromJsonInputCardImagesDTO[],
  ) {
    for (let i = 0; i < inputs.length; i++) {
      await this.imageTempRepo.save({
        cardId,
        ygoproId: inputs[i].id,
        url: inputs[i].image_url,
        urlSmall: inputs[i].image_url_small,
        urlCropped: inputs[i].image_url_cropped,
      });
    }
  }
}
