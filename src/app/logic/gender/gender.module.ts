import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Gender } from '../../entities/gender';

@Module({
  imports: [TypeOrmModule.forFeature([Gender])],
  exports: [TypeOrmModule],
})
export class GenderModule {}
