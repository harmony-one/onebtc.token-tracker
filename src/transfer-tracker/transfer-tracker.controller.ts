import { Controller, Get } from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { TransferTrackerService } from './transfer-tracker.service';

@ApiTags('tracker')
@Controller('tracker')
export class TransferTrackerController {
  constructor(
    private readonly trackerService: TransferTrackerService
  ) { }

  @Get('/info')
  getConfig() {
    return this.trackerService.getInfo();
  }

  @Get('/transfers')
  getTransfers() {
    return this.trackerService.getTransfers();
  }
}
