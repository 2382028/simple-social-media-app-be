import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { WishlistItem } from './wishlist-item.entity';
import { CreateWishlistItemDto } from './create-wishlist-item.dto';
import { UpdateWishlistItemDto } from './update-wishlist-item.dto';

@Injectable()
export class WishlistService {
    constructor(
        @InjectRepository(WishlistItem)
        private wishlistRepository: Repository<WishlistItem>,
    ) {}

    async create(userId: number, createDto: CreateWishlistItemDto): Promise<WishlistItem> {
        const newItem = this.wishlistRepository.create({ ...createDto, userId });
        return this.wishlistRepository.save(newItem);
    }

    async findAllByUser(userId: number): Promise<WishlistItem[]> {
        return this.wishlistRepository.find({ where: { userId } });
    }

    async findOneByUser(userId: number, id: number): Promise<WishlistItem> {
        const item = await this.wishlistRepository.findOne({ where: { id, userId } });
        if (!item) {
            throw new NotFoundException(`Wishlist item with ID ${id} not found for this user`);
        }
        return item;
    }

    async update(userId: number, id: number, updateDto: UpdateWishlistItemDto): Promise<WishlistItem> {
        const item = await this.findOneByUser(userId, id); // Cek kepemilikan
        Object.assign(item, updateDto);
        return this.wishlistRepository.save(item);
    }

    async remove(userId: number, id: number): Promise<void> {
        const result = await this.wishlistRepository.delete({ id, userId });
        if (result.affected === 0) {
            throw new NotFoundException(`Wishlist item with ID ${id} not found for this user`);
        }
    }
}