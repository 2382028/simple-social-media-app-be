import { IsString, IsNotEmpty, IsOptional } from 'class-validator';
export class CreateWishlistItemDto {
    @IsString() @IsNotEmpty() plantName: string;
    @IsString() @IsOptional() notes?: string;
    @IsString() @IsOptional() sourceIdea?: string;
}