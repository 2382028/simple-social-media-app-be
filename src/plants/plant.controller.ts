import { Controller, Get, Post, Body, Patch, Param, Delete, UseGuards, Req, ParseIntPipe } from '@nestjs/common';
import { PlantService } from './plant.service';
// --- Perbaikan Path DTO ---
import { CreatePlantDto } from './create-plant.dto'; // Langsung dari folder plants
import { UpdatePlantDto } from './update-plant.dto'; // Langsung dari folder plants
// --- Perbaikan Path AuthGuard ---
import { AuthGuard } from '../auth/auth.guard'; // Import dari folder auth lokal

@Controller('plants') // Base route -> /plants
// Jika AuthGuard lokalmu perlu argumen seperti AuthGuard('jwt'), sesuaikan di atas
export class PlantController {
    constructor(private readonly plantService: PlantService) {}

    // Endpoint POST /plants
    @Post()
    create(@Req() req, @Body() createPlantDto: CreatePlantDto) {
        // Pastikan req.user ada dan berisi data user setelah AuthGuard
        // Jika guard global di app.module, user mungkin sudah di req.user
        // Jika guard spesifik di sini, cara ambil user mungkin perlu disesuaikan
        // Asumsi guard global atau setup standar:
        const userId = req.user?.id; // Gunakan optional chaining (?) untuk keamanan
        if (!userId) {
            // Handle kasus user tidak terautentikasi (seharusnya sudah ditangani guard)
            // throw new UnauthorizedException(); // Contoh
        }
        return this.plantService.createPlant(userId, createPlantDto);
    }

    // Endpoint GET /plants
    @Get()
    findAll(@Req() req) {
        const userId = req.user?.id;
         if (!userId) {
            // Handle kasus user tidak terautentikasi
         }
        return this.plantService.findAllPlantsByUser(userId);
    }

    // Endpoint GET /plants/:id
    @Get(':id')
    findOne(@Req() req, @Param('id', ParseIntPipe) id: number) { // ParseIntPipe untuk konversi ke number
        const userId = req.user?.id;
         if (!userId) {
            // Handle kasus user tidak terautentikasi
         }
        return this.plantService.findOnePlantByUser(userId, id);
    }

    // Endpoint PATCH /plants/:id
    @Patch(':id')
    update(@Req() req, @Param('id', ParseIntPipe) id: number, @Body() updatePlantDto: UpdatePlantDto) {
        const userId = req.user?.id;
         if (!userId) {
            // Handle kasus user tidak terautentikasi
         }
        return this.plantService.updatePlant(userId, id, updatePlantDto);
    }

    // Endpoint DELETE /plants/:id
    @Delete(':id')
    remove(@Req() req, @Param('id', ParseIntPipe) id: number) {
        const userId = req.user?.id;
         if (!userId) {
            // Handle kasus user tidak terautentikasi
         }
        // Service removePlant sudah termasuk cek user, return biasanya void atau konfirmasi
        return this.plantService.removePlant(userId, id);
    }
}