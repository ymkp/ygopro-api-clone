import {
  Column,
  CreateDateColumn,
  DeleteDateColumn,
  Entity,
  PrimaryGeneratedColumn,
  Unique,
  UpdateDateColumn,
} from 'typeorm';

@Entity('user')
export class User {
  @PrimaryGeneratedColumn()
  id: number;

  @Unique('email', ['email'])
  @Column({ length: 200 })
  email: string;

  @Column({ default: null, nullable: true })
  password: string;

  @Column({ default: false })
  isAccountDisabled: boolean;

  @Column({ default: false })
  isModerator: boolean;

  @Column({ default: false })
  isSuperAdmin: boolean;

  @CreateDateColumn({ name: 'createdAt', nullable: true })
  createdAt: Date;

  @UpdateDateColumn({ name: 'updatedAt', nullable: true })
  updatedAt: Date;

  @DeleteDateColumn({ name: 'deletedAt', nullable: true })
  deletedAt: Date;
}
