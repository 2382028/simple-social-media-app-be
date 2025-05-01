import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import { ValidationPipe } from '@nestjs/common'; // Pastikan ini diimpor

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  // Mengaktifkan CORS untuk mengizinkan request dari domain lain (misal frontend)
  app.enableCors();

  // Menetapkan prefix global '/api' untuk semua route
  app.setGlobalPrefix('api');

  // Konfigurasi untuk dokumen Swagger/OpenAPI
  const config = new DocumentBuilder()
    .setTitle('PlanTrella API')
    .setDescription('Dokumentasi API untuk aplikasi PlanTrella')
    .setVersion('1.0')
    .addBearerAuth(
      {
        type: 'http',
        scheme: 'bearer',
        bearerFormat: 'JWT',
        name: 'JWT Authorization',
        description: 'Enter JWT token',
        in: 'header',
      },
      'JWT-auth',
    )
    .build();

  // Membuat dokumen OpenAPI berdasarkan aplikasi NestJS dan konfigurasi
  const document = SwaggerModule.createDocument(app, config);

  // --- Menghapus Setup Swagger Manual ---
  // app.use('/api/swagger-json', ...); <<< DIHAPUS
  // app.use('/api/swagger', ...); <<< DIHAPUS

  // --- Setup Swagger UI menggunakan fungsi bawaan NestJS ---
  // Menyajikan UI Swagger di path '/api/docs'
  // Path ini menggabungkan global prefix 'api' dan path spesifik 'docs'
  SwaggerModule.setup('api/docs', app, document);
  // --- Akhir Setup Swagger ---

  // Mengaktifkan validasi global untuk semua DTO yang masuk
  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true, // Menghapus properti yang tidak didefinisikan di DTO
      forbidNonWhitelisted: true, // Memberi error jika ada properti tak dikenal
      transform: true, // Mengubah payload masuk menjadi instance DTO (otomatis konversi tipe jika memungkinkan)
    }),
  );

  // Menjalankan aplikasi di port dari environment variable PORT atau default ke 3000
  const port = process.env.PORT || 3000;
  await app.listen(port);

  // Menampilkan log di konsol saat server berhasil berjalan
  console.log(`==========================================================`);
  console.log(`🚀 Application is running on: ${await app.getUrl()}`);
  console.log(
    `📚 Swagger documentation is available at: ${await app.getUrl()}/api/docs`,
  );
  console.log(`==========================================================`);
}

// Menjalankan fungsi bootstrap
bootstrap();
