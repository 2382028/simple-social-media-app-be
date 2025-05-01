// src/wishlist/wishlist.controller.ts
import {
    Controller,
    Get,
    Post,
    Body,
    Patch,
    Param,
    Delete,
    UseGuards, // Untuk melindungi endpoint
    Req, // Untuk mendapatkan data user dari request
    ParseIntPipe, // Untuk validasi dan konversi ID dari parameter URL
  } from '@nestjs/common';
  import { WishlistService } from './wishlist.service';
  import { CreateWishlistItemDto } from './create-wishlist-item.dto';
  import { UpdateWishlistItemDto } from './update-wishlist-item.dto';
  import { AuthGuard } from '../auth/auth.guard'; // Asumsi path guard benar
  import { ApiTags, ApiBearerAuth, ApiOperation, ApiResponse } from '@nestjs/swagger'; // Untuk dokumentasi Swagger
  
  @ApiTags('Wishlist') // Mengelompokkan endpoint ini di bawah tag 'Wishlist' di Swagger
  @ApiBearerAuth('JWT-auth') // Menandakan endpoint ini butuh otentikasi Bearer Token di Swagger
  @UseGuards(AuthGuard) // Melindungi SEMUA endpoint di controller ini (jika guard global tidak ada, atau untuk kejelasan)
  // Jika kamu sudah punya guard global di AppModule, baris @UseGuards ini bisa dihapus.
  @Controller('wishlist') // Base route untuk controller ini adalah /api/wishlist
  export class WishlistController {
    constructor(private readonly wishlistService: WishlistService) {}
  
    // Endpoint: POST /api/wishlist
    @Post()
    @ApiOperation({ summary: 'Menambahkan tanaman baru ke wishlist' }) // Deskripsi di Swagger
    @ApiResponse({ status: 201, description: 'Item wishlist berhasil dibuat.'})
    @ApiResponse({ status: 401, description: 'Unauthorized (Token tidak valid/tidak ada).'})
    create(@Req() req, @Body() createWishlistItemDto: CreateWishlistItemDto) {
      // Mengambil userId dari objek user yang ditempelkan oleh AuthGuard/JwtStrategy
      const userId = req.user.id;
      // Memanggil service untuk membuat item baru
      return this.wishlistService.create(userId, createWishlistItemDto);
    }
  
    // Endpoint: GET /api/wishlist
    @Get()
    @ApiOperation({ summary: 'Mendapatkan semua item wishlist milik pengguna' })
    @ApiResponse({ status: 200, description: 'Daftar item wishlist berhasil diambil.'})
    @ApiResponse({ status: 401, description: 'Unauthorized.'})
    findAll(@Req() req) {
      const userId = req.user.id;
      return this.wishlistService.findAllByUser(userId);
    }
  
    // Endpoint: GET /api/wishlist/:id
    @Get(':id')
    @ApiOperation({ summary: 'Mendapatkan detail satu item wishlist berdasarkan ID' })
    @ApiResponse({ status: 200, description: 'Detail item wishlist berhasil diambil.'})
    @ApiResponse({ status: 404, description: 'Item wishlist tidak ditemukan.'})
    @ApiResponse({ status: 401, description: 'Unauthorized.'})
    findOne(@Req() req, @Param('id', ParseIntPipe) id: number) {
      // ParseIntPipe otomatis mengubah string 'id' dari URL menjadi number
      // dan memberi error jika bukan angka valid
      const userId = req.user.id;
      return this.wishlistService.findOneByUser(userId, id);
    }
  
    // Endpoint: PATCH /api/wishlist/:id
    @Patch(':id')
    @ApiOperation({ summary: 'Mengupdate item wishlist berdasarkan ID' })
    @ApiResponse({ status: 200, description: 'Item wishlist berhasil diupdate.'})
    @ApiResponse({ status: 404, description: 'Item wishlist tidak ditemukan.'})
    @ApiResponse({ status: 401, description: 'Unauthorized.'})
    update(
      @Req() req,
      @Param('id', ParseIntPipe) id: number,
      @Body() updateWishlistItemDto: UpdateWishlistItemDto,
    ) {
      const userId = req.user.id;
      return this.wishlistService.update(userId, id, updateWishlistItemDto);
    }
  
    // Endpoint: DELETE /api/wishlist/:id
    @Delete(':id')
    @ApiOperation({ summary: 'Menghapus item wishlist berdasarkan ID' })
    @ApiResponse({ status: 200, description: 'Item wishlist berhasil dihapus.'}) // Atau 204 No Content
    @ApiResponse({ status: 404, description: 'Item wishlist tidak ditemukan.'})
    @ApiResponse({ status: 401, description: 'Unauthorized.'})
    remove(@Req() req, @Param('id', ParseIntPipe) id: number) {
      const userId = req.user.id;
      // Method remove di service biasanya tidak mengembalikan apa-apa (void)
      // Controller akan otomatis mengirim status 200 OK jika tidak ada error
      return this.wishlistService.remove(userId, id);
    }
  }