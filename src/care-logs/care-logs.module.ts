// src/care-logs/care-logs.module.ts
import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { CareLogsService } from './care-logs.service';
import { CareLogsController } from './care-logs.controller';
import { CareLog } from './care-log.entity';
import { Plant } from '../plants/plant.entity'; // <<< Import Plant Entity

@Module({
  imports: [
      TypeOrmModule.forFeature([CareLog, Plant]) // <<< Daftarkan CareLog dan Plant
    ],
  controllers: [CareLogsController],
  providers: [CareLogsService],
})
export class CareLogsModule {}