import {
  Column,
  CreateDateColumn,
  DeleteDateColumn,
  Entity,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';
import { CARD_FRAME_TYPE_ENUM } from '../constants/card-frame-type.enum';
import { CARD_TYPE_TYPE_ENUM } from '../constants/card-type-type.enum';

@Entity('card_type')
export class CardType {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  name: string;

  @Column({
    type: 'enum',
    enum: CARD_TYPE_TYPE_ENUM,
    default: CARD_TYPE_TYPE_ENUM.OTHER,
  })
  type: CARD_TYPE_TYPE_ENUM;

  @Column({
    type: 'enum',
    enum: CARD_FRAME_TYPE_ENUM,
    default: CARD_FRAME_TYPE_ENUM.UNKNOWN,
  })
  frameType: CARD_FRAME_TYPE_ENUM;

  @CreateDateColumn({ name: 'createdAt', nullable: true })
  createdAt: Date;

  @UpdateDateColumn({ name: 'updatedAt', nullable: true })
  updatedAt: Date;

  @DeleteDateColumn({ name: 'deletedAt', nullable: true })
  deletedAt: Date;
}
