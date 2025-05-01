import { IsString, IsOptional, IsNumber } from 'class-validator';

export class UpdatePlantDto {
    @IsString()
    @IsOptional()
    name?: string;

    @IsString()
    @IsOptional()
    species?: string;

    @IsString()
    @IsOptional()
    notes?: string;

    @IsNumber()
    @IsOptional()
    locationId?: number; // Bisa null jika ingin menghapus dari lokasi
}