// src/care-logs/dto/create-care-log.dto.ts
import { IsString, IsNotEmpty, IsOptional, IsDateString } from 'class-validator';
export class CreateCareLogDto {
    @IsString() @IsNotEmpty() careType: string;
    @IsString() @IsOptional() note?: string;
    @IsDateString() @IsNotEmpty() logDate: string; // Terima sebagai string YYYY-MM-DD
}