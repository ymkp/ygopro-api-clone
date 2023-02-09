import {
  Column,
  CreateDateColumn,
  DeleteDateColumn,
  Entity,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';
import { CARD_RACE_TYPE_ENUM } from '../constants/card-race-type.enum';

@Entity('card_race')
export class CardRace {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  name: string;

  @Column({
    type: 'enum',
    enum: CARD_RACE_TYPE_ENUM,
    default: CARD_RACE_TYPE_ENUM.UNKNOWN,
  })
  type: CARD_RACE_TYPE_ENUM;

  @CreateDateColumn({ name: 'createdAt', nullable: true })
  createdAt: Date;

  @UpdateDateColumn({ name: 'updatedAt', nullable: true })
  updatedAt: Date;

  @DeleteDateColumn({ name: 'deletedAt', nullable: true })
  deletedAt: Date;
}
