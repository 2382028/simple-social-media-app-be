// src/care-logs/care-logs.service.ts
import { Injectable, NotFoundException, ForbiddenException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { CareLog } from './care-log.entity';
import { CreateCareLogDto } from './create-care-log.dto';
import { UpdateCareLogDto } from './update-care-log.dto';
import { Plant } from '../plants/plant.entity'; // Import Plant untuk cek kepemilikan

@Injectable()
export class CareLogsService {
    constructor(
        @InjectRepository(CareLog)
        private careLogsRepository: Repository<CareLog>,
        // Inject Plant Repository untuk verifikasi kepemilikan plant
        @InjectRepository(Plant)
        private plantsRepository: Repository<Plant>,
    ) {}

    // Fungsi helper untuk mengecek apakah plant milik user
    private async verifyPlantOwnership(userId: number, plantId: number): Promise<Plant> {
        const plant = await this.plantsRepository.findOneBy({ id: plantId });
        if (!plant) {
            throw new NotFoundException(`Plant with ID ${plantId} not found`);
        }
        if (plant.userId !== userId) {
            throw new ForbiddenException(`You do not own plant with ID ${plantId}`);
        }
        return plant;
    }

    async create(userId: number, plantId: number, createDto: CreateCareLogDto): Promise<CareLog> {
        // Verifikasi dulu plant ada dan milik user
        await this.verifyPlantOwnership(userId, plantId);
        const newLog = this.careLogsRepository.create({
            ...createDto,
            plantId: plantId,
            logDate: new Date(createDto.logDate) // Konversi string tanggal ke Date
         });
        return this.careLogsRepository.save(newLog);
    }

    async findAllByPlantForUser(userId: number, plantId: number): Promise<CareLog[]> {
        // Verifikasi kepemilikan plant
        await this.verifyPlantOwnership(userId, plantId);
        return this.careLogsRepository.find({
            where: { plantId },
            order: { logDate: 'DESC', createdAt: 'DESC' }, // Urutkan log terbaru di atas
         });
    }

    async findOneForUser(userId: number, plantId: number, logId: number): Promise<CareLog> {
         // Verifikasi kepemilikan plant
         await this.verifyPlantOwnership(userId, plantId);
         const log = await this.careLogsRepository.findOne({ where: { id: logId, plantId: plantId } });
         if (!log) {
             throw new NotFoundException(`Care log with ID ${logId} not found for plant ${plantId}`);
         }
         return log;
    }

    async update(userId: number, plantId: number, logId: number, updateDto: UpdateCareLogDto): Promise<CareLog> {
        // Cek kepemilikan plant dan keberadaan log
        const log = await this.findOneForUser(userId, plantId, logId);
        Object.assign(log, updateDto);
         // Konversi string tanggal jika ada di DTO update
         if (updateDto.logDate) {
            log.logDate = new Date(updateDto.logDate);
         }
        return this.careLogsRepository.save(log);
    }

    async remove(userId: number, plantId: number, logId: number): Promise<void> {
         // Cek kepemilikan plant dulu
         await this.verifyPlantOwnership(userId, plantId);
         const result = await this.careLogsRepository.delete({ id: logId, plantId: plantId });
         if (result.affected === 0) {
             throw new NotFoundException(`Care log with ID ${logId} not found for plant ${plantId}`);
         }
    }
}