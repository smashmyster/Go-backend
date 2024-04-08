import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Gender } from '../../entities/Gender';

@Injectable()
export class GenderService {
  constructor(
    @InjectRepository(Gender)
    private readonly genderRepo: Repository<Gender>,
  ) {}

  getAll(): Promise<Gender[]> {
    return this.genderRepo.find();
  }

  getOne(id): Promise<Gender> {
    return this.genderRepo.findOne({ where: { id } });
  }
}
