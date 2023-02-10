import {
  Column,
  CreateDateColumn,
  DeleteDateColumn,
  Entity,
  OneToMany,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';
import { CardSet } from './card-set.entity';

@Entity('set_info')
export class SetInfo {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  name: string;

  @Column()
  code: string;

  @Column({ default: 0 })
  nCards: number;

  @OneToMany(() => CardSet, (d) => d.setInfo)
  cardSets: CardSet[];

  @Column({ nullable: true, type: 'date', default: null })
  tcgRelease: Date;

  @CreateDateColumn({ name: 'createdAt', nullable: true })
  createdAt: Date;

  @UpdateDateColumn({ name: 'updatedAt', nullable: true })
  updatedAt: Date;

  @DeleteDateColumn({ name: 'deletedAt', nullable: true })
  deletedAt: Date;
}
