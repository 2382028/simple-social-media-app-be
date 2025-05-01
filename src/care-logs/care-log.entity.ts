// src/care-logs/care-log.entity.ts
import {
    Entity, PrimaryGeneratedColumn, Column, ManyToOne,
    CreateDateColumn, UpdateDateColumn, JoinColumn
} from 'typeorm';
import { Plant } from '../plants/plant.entity'; // Pastikan path benar

@Entity('care_logs')
export class CareLog {
    @PrimaryGeneratedColumn()
    id: number;

    @Column({ name: 'plant_id' })
    plantId: number;

    @Column({ name: 'care_type' })
    careType: string; // Misal: 'Watering', 'Fertilizing'

    @Column({ type: 'text', nullable: true })
    note: string;

    @Column({ type: 'date', name: 'log_date' }) // Nama kolom di DB
    logDate: Date; // Nama properti di kode

    @CreateDateColumn({ name: 'created_at' })
    createdAt: Date;

    @UpdateDateColumn({ name: 'updated_at' })
    updatedAt: Date;

    // Relasi kembali ke Plant
    @ManyToOne(() => Plant, (plant) => plant.careLogs, { onDelete: 'CASCADE' })
    @JoinColumn({ name: 'plant_id' })
    plant: Plant;
}