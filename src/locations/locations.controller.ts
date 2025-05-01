// src/locations/locations.controller.ts
import { Controller, Get, Post, Body, Patch, Param, Delete, UseGuards, Req, ParseIntPipe } from '@nestjs/common';
import { LocationsService } from './locations.service';
import { CreateLocationDto } from './create-location.dto';
import { UpdateLocationDto } from './update-location.dto';
import { AuthGuard } from '../auth/auth.guard';
import { ApiTags, ApiBearerAuth, ApiOperation, ApiResponse } from '@nestjs/swagger';

@ApiTags('Locations')
@ApiBearerAuth('JWT-auth')
// @UseGuards(AuthGuard) // Ingat, bisa dikomentari jika guard global aktif
@Controller('locations') // Base route /api/locations
export class LocationsController {
    constructor(private readonly locationsService: LocationsService) {}

    @Post()
    @ApiOperation({ summary: 'Membuat lokasi penyimpanan baru' })
    create(@Req() req, @Body() createLocationDto: CreateLocationDto) {
        return this.locationsService.create(req.user.id, createLocationDto);
    }

    @Get()
    @ApiOperation({ summary: 'Melihat semua lokasi pengguna' })
    findAll(@Req() req) {
        return this.locationsService.findAllByUser(req.user.id);
    }

    @Get(':id')
    @ApiOperation({ summary: 'Melihat detail satu lokasi' })
    findOne(@Req() req, @Param('id', ParseIntPipe) id: number) {
        return this.locationsService.findOneByUser(req.user.id, id);
    }

    @Patch(':id')
    @ApiOperation({ summary: 'Mengupdate lokasi' })
    update(@Req() req, @Param('id', ParseIntPipe) id: number, @Body() updateLocationDto: UpdateLocationDto) {
        return this.locationsService.update(req.user.id, id, updateLocationDto);
    }

    @Delete(':id')
    @ApiOperation({ summary: 'Menghapus lokasi' })
    remove(@Req() req, @Param('id', ParseIntPipe) id: number) {
        return this.locationsService.remove(req.user.id, id);
    }
}