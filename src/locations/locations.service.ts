// src/locations/locations.service.ts
import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Location } from './location.entity';
import { CreateLocationDto } from './create-location.dto';
import { UpdateLocationDto } from './update-location.dto';

@Injectable()
export class LocationsService {
    constructor(
        @InjectRepository(Location)
        private locationsRepository: Repository<Location>,
    ) {}

    async create(userId: number, createDto: CreateLocationDto): Promise<Location> {
        const newLocation = this.locationsRepository.create({ ...createDto, userId });
        return this.locationsRepository.save(newLocation);
    }

    async findAllByUser(userId: number): Promise<Location[]> {
        return this.locationsRepository.find({
            where: { userId },
            // relations: ['plants'], // Tunda load relasi plants jika belum perlu
            order: { name: 'ASC' },
        });
    }

    async findOneByUser(userId: number, id: number): Promise<Location> {
        const location = await this.locationsRepository.findOne({
            where: { id, userId },
            // relations: ['plants'], // Tunda load relasi plants
        });
        if (!location) {
            throw new NotFoundException(`Location with ID ${id} not found for this user`);
        }
        return location;
    }

    async update(userId: number, id: number, updateDto: UpdateLocationDto): Promise<Location> {
        const location = await this.findOneByUser(userId, id); // Cek kepemilikan
        Object.assign(location, updateDto);
        return this.locationsRepository.save(location);
    }

    // Hapus lokasi (PERHATIAN: Tanaman yang terkait akan jadi null locationId-nya karena ON DELETE SET NULL di migration)
    async remove(userId: number, id: number): Promise<void> {
        const result = await this.locationsRepository.delete({ id, userId });
        if (result.affected === 0) {
            throw new NotFoundException(`Location with ID ${id} not found for this user`);
        }
        // Hati-hati jika ada logic lain yang perlu dilakukan saat lokasi dihapus
    }
}