import { BadRequestException, Injectable } from '@nestjs/common';
import { SetInfoRepository } from '../repositories/set-info.repository';
import { readFileSync } from 'fs';
import { SetFromJsonInputDTO } from '../dtos/set-from-json.input.dto';
import { SetInfoInput } from '../dtos/set-info.input.dto';

@Injectable()
export class SetInfoJsonService {
  constructor(private readonly setRepo: SetInfoRepository) {}

  async readFromCardSetsJson(): Promise<void> {
    try {
      const str = readFileSync('assets/cardsets.json', 'utf8');
      const data = JSON.parse(str) as SetFromJsonInputDTO[];
      const logInfoName = 'readFromJSON';
      for (let i = 0; i < data.length; i++) {
        const check = await this.setRepo.findOne({
          where: { name: data[i].set_name },
        });
        if (!check) {
          const tcgRelease: Date = data[i].tcg_date
            ? new Date(data[i].tcg_date)
            : null;
          const toSave: SetInfoInput = {
            name: data[i].set_name,
            code: data[i].set_code,
            nCards: data[i].num_of_cards,
            tcgRelease,
          };
          await this.setRepo.save(toSave);
          console.log(logInfoName, data[i].set_name, 'successfully saved');
        } else {
          console.log(logInfoName, data[i].set_name, 'exists');
        }
      }
    } catch (err) {
      throw new BadRequestException(err);
    }
  }
}
