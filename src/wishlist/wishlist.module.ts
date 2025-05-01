
// src/wishlist/wishlist.module.ts
import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm'; // <<< Impor TypeOrmModule
import { WishlistService } from './wishlist.service'; // <<< Impor Service
import { WishlistController } from './wishlist.controller'; // <<< Impor Controller
import { WishlistItem } from './wishlist-item.entity'; // <<< Impor Entity
@Module({
    imports: [
      TypeOrmModule.forFeature([WishlistItem]) // <<< Daftarkan Entity
    ],
    controllers: [WishlistController], // <<< Daftarkan Controller
    providers: [WishlistService],     // <<< Daftarkan Service
    // exports: [WishlistService] // Opsional: ekspor jika service dibutuhkan modul lain
  })
  export class WishlistModule {}
  