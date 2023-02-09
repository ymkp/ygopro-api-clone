import {
  Column,
  CreateDateColumn,
  DeleteDateColumn,
  Entity,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';

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

  @Column({ nullable: true, type: 'date', default: null })
  tcgRelease: Date;

  @CreateDateColumn({ name: 'createdAt', nullable: true })
  createdAt: Date;

  @UpdateDateColumn({ name: 'updatedAt', nullable: true })
  updatedAt: Date;

  @DeleteDateColumn({ name: 'deletedAt', nullable: true })
  deletedAt: Date;
}
