// src/wishlist/wishlist-item.entity.ts
import {
    Entity, PrimaryGeneratedColumn, Column, ManyToOne,
    CreateDateColumn, UpdateDateColumn, JoinColumn
} from 'typeorm';
import { User } from '../user/user.entity';

@Entity('wishlist_items') // Nama tabel
export class WishlistItem {
    @PrimaryGeneratedColumn()
    id: number;

    @Column({ name: 'user_id' }) // Nama kolom foreign key di DB
    userId: number;

    @Column({ name: 'plant_name' }) // Nama tanaman yg diinginkan
    plantName: string;

    @Column({ type: 'text', nullable: true })
    notes: string;

    @Column({ name: 'source_idea', nullable: true })
    sourceIdea: string;

    @CreateDateColumn({ name: 'created_at' })
    createdAt: Date;

    @UpdateDateColumn({ name: 'updated_at' })
    updatedAt: Date;

    // Relasi Many-to-One ke User
    @ManyToOne(() => User, (user) => user.wishlistItems, { onDelete: 'CASCADE' })
    @JoinColumn({ name: 'user_id' })
    user: User;
}