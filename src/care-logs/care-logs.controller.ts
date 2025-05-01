// src/care-logs/care-logs.controller.ts
import { Controller, Get, Post, Body, Patch, Param, Delete, UseGuards, Req, ParseIntPipe } from '@nestjs/common';
import { CareLogsService } from './care-logs.service';
import { CreateCareLogDto } from './create-care-log.dto';
import { UpdateCareLogDto } from './update-care-log.dto';
import { AuthGuard } from '../auth/auth.guard';
import { ApiTags, ApiBearerAuth, ApiOperation, ApiResponse } from '@nestjs/swagger';

@ApiTags('Care Logs')
@ApiBearerAuth('JWT-auth')
// @UseGuards(AuthGuard) // Bisa dikomentari jika global guard aktif
@Controller('plants/:plantId/care-logs') // <<< ROUTE BERSARANG
export class CareLogsController {
    constructor(private readonly careLogsService: CareLogsService) {}

    @Post()
    @ApiOperation({ summary: 'Menambahkan catatan perawatan baru untuk tanaman' })
    create(
        @Req() req,
        @Param('plantId', ParseIntPipe) plantId: number, // <<< Ambil plantId dari URL
        @Body() createCareLogDto: CreateCareLogDto
    ) {
        return this.careLogsService.create(req.user.id, plantId, createCareLogDto);
    }

    @Get()
    @ApiOperation({ summary: 'Melihat semua catatan perawatan untuk tanaman' })
    findAll(@Req() req, @Param('plantId', ParseIntPipe) plantId: number) {
        return this.careLogsService.findAllByPlantForUser(req.user.id, plantId);
    }

    // Untuk Get One, Update, Delete, kita perlu logId juga
    @Get(':logId')
    @ApiOperation({ summary: 'Melihat detail satu catatan perawatan' })
    findOne(
        @Req() req,
        @Param('plantId', ParseIntPipe) plantId: number,
        @Param('logId', ParseIntPipe) logId: number // <<< Ambil logId
    ) {
        return this.careLogsService.findOneForUser(req.user.id, plantId, logId);
    }

    @Patch(':logId')
    @ApiOperation({ summary: 'Mengupdate catatan perawatan' })
    update(
        @Req() req,
        @Param('plantId', ParseIntPipe) plantId: number,
        @Param('logId', ParseIntPipe) logId: number, // <<< Ambil logId
        @Body() updateCareLogDto: UpdateCareLogDto
    ) {
        return this.careLogsService.update(req.user.id, plantId, logId, updateCareLogDto);
    }

    @Delete(':logId')
    @ApiOperation({ summary: 'Menghapus catatan perawatan' })
    remove(
        @Req() req,
        @Param('plantId', ParseIntPipe) plantId: number,
        @Param('logId', ParseIntPipe) logId: number // <<< Ambil logId
    ) {
        return this.careLogsService.remove(req.user.id, plantId, logId);
    }
}