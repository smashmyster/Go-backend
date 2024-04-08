import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Gender } from '../../entities/Gender';

@Module({
  imports: [TypeOrmModule.forFeature([Gender])],
  exports: [TypeOrmModule],
})
export class GenderModule {}
