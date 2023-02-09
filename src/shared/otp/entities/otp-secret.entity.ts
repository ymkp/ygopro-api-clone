import {
  Column,
  CreateDateColumn,
  Entity,
  PrimaryGeneratedColumn,
} from 'typeorm';

@Entity('otp_secret')
export class OtpSecret {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  userId: number;

  @Column()
  secret: string;

  @CreateDateColumn({ name: 'createdAt', nullable: true })
  createdAt: Date;
}
