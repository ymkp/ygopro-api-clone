import { Archetype } from 'src/archetype/entities/archetype.entity';
import { CardImages } from 'src/card-images/entities/card-images.entity';
import { CardSet } from 'src/set-info/entities/card-set.entity';
import {
  Column,
  CreateDateColumn,
  DeleteDateColumn,
  Entity,
  JoinColumn,
  JoinTable,
  ManyToMany,
  ManyToOne,
  OneToMany,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';
import { CARD_ATTRIBUTE_ENUM } from '../constants/card-attribute-type.enum';
import { CardRace } from './card-race.entity';
import { CardType } from './card-type.entity';

@Entity('card')
export class Card {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  ygoproId: number;

  @Column()
  name: string;

  @ManyToOne(() => CardType)
  @JoinColumn()
  type: CardType;

  @Column()
  typeId: number;

  @Column({ type: 'text' })
  desc: string;

  @Column({ nullable: true, default: null })
  atk: number;

  @Column({ nullable: true, default: null })
  def: number;

  @Column({ nullable: true, default: null })
  level: number;

  @Column({ nullable: true, default: null })
  scale: number;

  @Column({ nullable: true, default: null })
  linkVal: number;

  @Column({ nullable: true, type: 'simple-array', default: null })
  linkMarkers: string[];

  @ManyToOne(() => CardRace)
  @JoinColumn()
  race: CardRace;

  @Column()
  raceId: number;

  @Column({
    nullable: true,
    type: 'enum',
    enum: CARD_ATTRIBUTE_ENUM,
    default: null,
  })
  attribute: CARD_ATTRIBUTE_ENUM;

  @ManyToMany(() => Archetype, (d) => d.cards)
  @JoinTable()
  archetypes: Archetype[];

  @OneToMany(() => CardSet, (d) => d.card)
  cardSets: CardSet[];

  @OneToMany(() => CardImages, (d) => d.card)
  cardImages: CardImages[];

  @CreateDateColumn({ name: 'createdAt', nullable: true })
  createdAt: Date;

  @UpdateDateColumn({ name: 'updatedAt', nullable: true })
  updatedAt: Date;

  @DeleteDateColumn({ name: 'deletedAt', nullable: true })
  deletedAt: Date;
}
