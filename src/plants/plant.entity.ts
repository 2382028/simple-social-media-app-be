// src/plants/plant.entity.ts
import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  ManyToOne,
  OneToMany,
  CreateDateColumn,
  UpdateDateColumn,
  JoinColumn,
} from 'typeorm';
import { User } from '../user/user.entity';
import { Location } from '../locations/location.entity';
import { CareLog } from '../care-logs/care-log.entity';

@Entity('plants')
export class Plant {
  @PrimaryGeneratedColumn()
  id: number;

  // --- PERBAIKAN: Tambahkan opsi 'name' ---
  @Column({ name: 'user_id' }) // <<< Beritahu TypeORM nama kolom di DB adalah 'user_id'
  userId: number; // Nama properti di kode tetap 'userId' (camelCase)

  @Column({ name: 'location_id', type: 'integer', nullable: true }) // <<< Tambahkan 'name' & pastikan type ada
  locationId: number | null;

  // ... (sisa properti: name, species, notes, photo_url, date_added) ...
  @Column()
  name: string;

  @Column({ nullable: true })
  species: string;

  @Column({ type: 'text', nullable: true })
  notes: string;

  @Column({ nullable: true })
  photo_url: string;

  @Column({ type: 'timestamp', default: () => 'CURRENT_TIMESTAMP' })
  date_added: Date;
  // --- Akhir properti biasa ---

  @CreateDateColumn({ name: 'created_at' }) // <<< Konsisten pakai name jika kolom DB snake_case
  created_at: Date;

  @UpdateDateColumn({ name: 'updated_at' }) // <<< Konsisten pakai name jika kolom DB snake_case
  updated_at: Date;

  // --- Relasi ---

  // Relasi Many-to-One ke User
  @ManyToOne(() => User, (user) => user.plants, { onDelete: 'CASCADE' })
  // JoinColumn sudah benar mereferensikan 'user_id'
  @JoinColumn({ name: 'user_id' })
  user: User;

  // Relasi Many-to-One ke Location
  @ManyToOne(() => Location, (location) => location.plants, { nullable: true, onDelete: 'SET NULL' })
  // JoinColumn sudah benar mereferensikan 'location_id'
  @JoinColumn({ name: 'location_id' })
  location: Location | null;

  // Relasi One-to-Many ke CareLog
  @OneToMany(() => CareLog, (careLog) => careLog.plant)
  careLogs: CareLog[];
}