// src/locations/location.entity.ts
import {
    Entity, PrimaryGeneratedColumn, Column, ManyToOne,
    OneToMany, CreateDateColumn, UpdateDateColumn, JoinColumn
} from 'typeorm';
import { User } from '../user/user.entity'; // Pastikan path benar
import { Plant } from '../plants/plant.entity'; // Pastikan path benar

@Entity('locations')
export class Location {
    @PrimaryGeneratedColumn()
    id: number;

    @Column({ name: 'user_id' })
    userId: number;

    @Column() // Nama lokasi
    name: string;

    @Column({ type: 'text', nullable: true })
    notes: string;

    @CreateDateColumn({ name: 'created_at' })
    created_at: Date;

    @UpdateDateColumn({ name: 'updated_at' })
    updated_at: Date;

    // Relasi kembali ke User
    @ManyToOne(() => User, (user) => user.locations, { onDelete: 'CASCADE' })
    @JoinColumn({ name: 'user_id' })
    user: User;

    // Relasi ke Plant (satu lokasi bisa punya banyak plant)
    @OneToMany(() => Plant, (plant) => plant.location)
    plants: Plant[];
}