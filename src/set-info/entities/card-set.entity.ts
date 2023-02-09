import { Card } from 'src/card/entities/card.entity';
import {
  Column,
  CreateDateColumn,
  DeleteDateColumn,
  Entity,
  JoinColumn,
  ManyToOne,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';
import { CardSetRarity } from './card-set-rarity.entity';
import { SetInfo } from './set-info.entity';

@Entity('card_set')
export class CardSet {
  @PrimaryGeneratedColumn()
  id: number;

  @ManyToOne(() => Card)
  @JoinColumn()
  card: Card;

  @Column()
  cardId: number;

  @ManyToOne(() => SetInfo)
  @JoinColumn()
  setInfo: SetInfo;

  @Column()
  setInfoId: number;

  @Column()
  code: string;

  @ManyToOne(() => CardSetRarity)
  @JoinColumn()
  rarity: CardSetRarity;

  @Column()
  rarityId: number;

  @Column()
  setPrice: string;

  @CreateDateColumn({ name: 'createdAt', nullable: true })
  createdAt: Date;

  @UpdateDateColumn({ name: 'updatedAt', nullable: true })
  updatedAt: Date;

  @DeleteDateColumn({ name: 'deletedAt', nullable: true })
  deletedAt: Date;
}
