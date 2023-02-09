import { Card } from 'src/card/entities/card.entity';
import {
  Column,
  CreateDateColumn,
  DeleteDateColumn,
  Entity,
  ManyToMany,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';

@Entity('archetype')
export class Archetype {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  name: string;

  @ManyToMany(() => Card, (d) => d.archetypes)
  cards: Card[];

  @CreateDateColumn({ name: 'createdAt', nullable: true })
  createdAt: Date;

  @UpdateDateColumn({ name: 'updatedAt', nullable: true })
  updatedAt: Date;

  @DeleteDateColumn({ name: 'deletedAt', nullable: true })
  deletedAt: Date;
}
