import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { APP_GUARD } from '@nestjs/core';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { AuthGuard } from './auth/auth.guard'; // Pastikan ini adalah Guard yang benar
import { AuthModule } from './auth/auth.module';
import { UserModule } from './user/user.module';
// --- Perbaikan Import ---
import { PlantModule } from './plants/plant.module'; // <<< Ganti PostModule menjadi PlantModule di sini
import { WishlistModule } from './wishlist/wishlist.module';
import { LocationsModule } from './locations/locations.module';
import { CareLogsModule } from './care-logs/care-logs.module';

@Module({
  imports: [
    ConfigModule.forRoot({ isGlobal: true }), // Membuat ConfigModule tersedia global
    TypeOrmModule.forRootAsync({
      // Menggunakan Async agar bisa inject ConfigService untuk ambil data dari .env
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: (configService: ConfigService) => ({
        type: 'postgres', // Tipe database
        host: configService.get<string>('POSTGRES_HOST'), // Ambil dari .env
        port: configService.get<string>('POSTGRES_PORT') // Ambil dari .env
          ? configService.get<number>('POSTGRES_PORT')
          : 5432, // Default port postgres
        password: configService.get<string>('POSTGRES_PASSWORD'), // Ambil dari .env
        username: configService.get<string>('POSTGRES_USER'), // Ambil dari .env
        database: configService.get<string>('POSTGRES_DATABASE'), // Ambil dari .env
        migrations: ['dist/migrations/*.js'], // Lokasi migration setelah di-build (JS)
        entities: [__dirname + '/**/*.entity{.ts,.js}'], // Cari semua file .entity.ts/.js
        // autoLoadEntities: true, // Alternatif untuk 'entities' di atas, otomatis load entity yang didaftarkan via forFeature
        synchronize: false, // !!! PENTING: Set false karena kita menggunakan Migrations
        ssl: true, // Diperlukan untuk koneksi ke Vercel/NeonDB
      }),
    }),
    AuthModule, // Modul untuk autentikasi (login, register, jwt)
    UserModule, // Modul untuk data pengguna
    // --- Perbaikan Penggunaan Module ---
    PlantModule,
    WishlistModule, // <<< Gunakan PlantModule di sini, bukan PostModule
    LocationsModule,
    CareLogsModule,
  ],
  controllers: [AppController], // Controller utama (biasanya untuk root path /)
  providers: [
    // ConfigService otomatis tersedia karena ConfigModule isGlobal:true
    // JwtService - Biasanya di-provide di dalam AuthModule, mungkin tidak perlu global
    { provide: APP_GUARD, useClass: AuthGuard }, // !!! Menerapkan AuthGuard ke SEMUA route secara global
    AppService, // Service utama
  ],
})
export class AppModule {}
