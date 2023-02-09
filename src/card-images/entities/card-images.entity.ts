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

@Entity('card_images')
export class CardImages {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  ygoproId: number;

  @ManyToOne(() => Card)
  @JoinColumn()
  card: Card;

  @Column({ nullable: true, default: null })
  cardId: number;

  @Column({ nullable: true, default: null })
  url: string;

  @Column({ nullable: true, default: null })
  urlSmall: string;

  @Column({ nullable: true, default: null })
  urlCropped: string;

  @CreateDateColumn({ name: 'createdAt', nullable: true })
  createdAt: Date;

  @UpdateDateColumn({ name: 'updatedAt', nullable: true })
  updatedAt: Date;

  @DeleteDateColumn({ name: 'deletedAt', nullable: true })
  deletedAt: Date;
}
