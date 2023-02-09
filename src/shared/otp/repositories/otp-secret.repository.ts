import { Injectable, NotFoundException } from '@nestjs/common';
import { DataSource, Repository } from 'typeorm';
import { OtpSecret } from '../entities/otp-secret.entity';

@Injectable()
export class OTPSecretRepository extends Repository<OtpSecret> {

    constructor(private readonly dataSource :DataSource){
    super(OtpSecret, dataSource.createEntityManager());
  }

  async getById(id: number): Promise<OtpSecret> {
    const user = await this.findOne({ where: { id } });
    if (!user) {
      throw new NotFoundException();
    }

    return user;
  }
}
