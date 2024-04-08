import { Controller, Get } from '@nestjs/common';
import { GenderService } from './gender.service';

@Controller('gender')
export class GenderController {
  constructor(private readonly genderService: GenderService) {}

  @Get('/')
  getAvailableGender() {
    return this.genderService.getAll();
  }
}
