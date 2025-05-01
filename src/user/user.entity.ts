import {
  Column,
  CreateDateColumn,
  Entity,
  OneToMany, // <<< TAMBAHKAN IMPORT OneToMany
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';

// --- TAMBAHKAN IMPORT UNTUK ENTITAS TERKAIT ---
import { Plant } from '../plants/plant.entity';

import { Location } from '../locations/location.entity'; // Path bisa salah jika file belum dibuat

import { WishlistItem } from '../wishlist/wishlist-item.entity'; // Path bisa salah jika file belum dibuat

@Entity('users') // Pastikan nama tabel sesuai dengan database
export class User {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ unique: true }) // Tambahkan unique constraint jika username harus unik
  username: string;

  @Column({ unique: true }) // Tambahkan unique constraint jika email harus unik
  email: string;

  // Jika nama kolom di DB adalah 'password_hash', biarkan @Column() saja,
  // atau gunakan @Column({ name: 'password_hash' }) jika nama properti beda (misal 'password')
  @Column()
  password_hash: string; // Nama properti ini HARUS sama dengan nama kolom di DB jika tidak pakai { name: ... }

  @Column({ nullable: true }) // Foto profil mungkin opsional
  profile_picture: string;

  @Column({ type: 'text', nullable: true }) // Bio bisa panjang dan opsional
  bio: string;

  @CreateDateColumn()
  created_at: Date;

  @UpdateDateColumn()
  updated_at: Date;

  // --- TAMBAHKAN RELASI OneToMany ---

  /**
   * Relasi One-to-Many: Satu User bisa memiliki banyak Plant.
   * () => Plant: Menunjuk ke class Entity Plant.
   * (plant) => plant.user: Menunjuk ke properti 'user' di class Plant (yang memiliki decorator @ManyToOne).
   */
  @OneToMany(() => Plant, (plant) => plant.user)
  plants: Plant[]; // Nama properti ini ('plants') dirujuk oleh Plant entity

  /**
   * Relasi One-to-Many: Satu User bisa memiliki banyak Location.
   * (location) => location.user: Menunjuk ke properti 'user' di class Location.
   */
  
  @OneToMany(() => Location, (location) => location.user)
  locations: Location[];

  /**
   * Relasi One-to-Many: Satu User bisa memiliki banyak WishlistItem.
   * (item) => item.user: Menunjuk ke properti 'user' di class WishlistItem.
   */
   
  @OneToMany(() => WishlistItem, (item) => item.user)
  wishlistItems: WishlistItem[];
}