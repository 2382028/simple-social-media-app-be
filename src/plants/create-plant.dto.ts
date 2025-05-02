import { IsString, IsNotEmpty, IsOptional, IsNumber } from 'class-validator';

export class CreatePlantDto {
    @IsString()
    @IsNotEmpty()
    name: string; // Nama tanaman wajib

    @IsString()
    @IsOptional() // Spesies boleh kosong
    species?: string;

    @IsString()
    @IsOptional() // Catatan boleh kosong
    notes?: string;

    @IsString()
    @IsOptional() // Catatan boleh kosong
    photo_url?: string;

    @IsNumber()
    @IsOptional() // Lokasi boleh kosong saat pertama dibuat
    locationId?: number;

    // photo_url dan date_added tidak perlu di DTO create
}