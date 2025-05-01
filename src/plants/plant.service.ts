import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Plant } from './plant.entity';
// --- Perbaikan Path DTO ---
import { CreatePlantDto } from './create-plant.dto'; // Hapus '/dto'
import { UpdatePlantDto } from './update-plant.dto'; // Hapus '/dto'

@Injectable()
export class PlantService {
  constructor(
    @InjectRepository(Plant)
    private plantRepository: Repository<Plant>,
  ) {}

  // Method untuk CREATE plant
  async createPlant(
    userId: number,
    createPlantDto: CreatePlantDto,
  ): Promise<Plant> {
    const newPlant = this.plantRepository.create({
      ...createPlantDto,
      userId: userId, // !!! Set user ID pemilik
    });
    return this.plantRepository.save(newPlant);
  }

  // Method untuk READ all plants milik user
  async findAllPlantsByUser(userId: number): Promise<Plant[]> {
    console.log(`Finding all plants for user ID: ${userId}`);
    try {
      const plants = await this.plantRepository.find({
        where: { userId: userId },
        // relations: ['location'], // dikomentari dulu
        order: { name: 'ASC' },
      });
      console.log('Plants found:', plants);
      return plants;
    } catch (error) {
      console.error('!!! ERROR finding plants:', error);
      throw error;
    }
  }

  // Method untuk READ one plant milik user
  async findOnePlantByUser(userId: number, plantId: number): Promise<Plant> {
    const plant = await this.plantRepository.findOne({
      where: { id: plantId, userId: userId }, // !!! Filter berdasarkan ID plant DAN user ID
      // relations: ['location', 'careLogs'], // dikomentari/hapus bagian ini
    });
    if (!plant) {
      throw new NotFoundException(
        `Plant with ID ${plantId} not found for this user`,
      );
    }
    return plant;
  }

  // Method untuk UPDATE plant milik user
  async updatePlant(
    userId: number,
    plantId: number,
    updatePlantDto: UpdatePlantDto,
  ): Promise<Plant> {
    // Pertama, cek apakah plant ada dan milik user
    const plant = await this.findOnePlantByUser(userId, plantId);

    // Update properti yang ada di DTO
    Object.assign(plant, updatePlantDto);

    // Jika locationId di DTO adalah null secara eksplisit, set jadi null
    if (updatePlantDto.locationId === null) {
      plant.locationId = null;
    } else if (updatePlantDto.locationId !== undefined) {
      // Atau jika ada locationId baru, validasi dulu jika perlu
      plant.locationId = updatePlantDto.locationId;
    }

    return this.plantRepository.save(plant);
  }

  // Method untuk DELETE plant milik user
  async removePlant(userId: number, plantId: number): Promise<void> {
    // Pertama, cek apakah plant ada dan milik user
    const plant = await this.findOnePlantByUser(userId, plantId);

    // Hapus plant
    await this.plantRepository.remove(plant);
    // Atau gunakan:
    // const result = await this.plantRepository.delete({ id: plantId, userId: userId });
    // if (result.affected === 0) {
    //    throw new NotFoundException(`Plant with ID ${plantId} not found for this user`);
    // }
  }
}
