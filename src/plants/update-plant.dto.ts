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

  @IsString()
  @IsOptional() // Catatan boleh kosong
  photo_url?: string;

  @IsNumber()
  @IsOptional()
  locationId?: number; // Bisa null jika ingin menghapus dari lokasi
}
