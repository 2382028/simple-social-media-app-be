import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { PlantService } from './plant.service';
import { PlantController } from './plant.controller';
import { Plant } from './plant.entity';
// Import AuthModule jika guard bergantung padanya (opsional tergantung setup)
// import { AuthModule } from '../auth/auth.module';

@Module({
    imports: [
        TypeOrmModule.forFeature([Plant]), // !!! Daftarkan Entity Plant
        // AuthModule // Mungkin perlu diimpor jika guard membutuhkannya
    ],
    controllers: [PlantController], // !!! Daftarkan Controller
    providers: [PlantService], // !!! Daftarkan Service
})
export class PlantModule {}