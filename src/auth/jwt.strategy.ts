// src/auth/jwt.strategy.ts
import { Injectable, UnauthorizedException } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { ExtractJwt, Strategy, StrategyOptions } from 'passport-jwt';
import { ConfigService } from '@nestjs/config';
import { UserService } from '../user/user.service'; // << Pastikan path benar
import { JwtPayloadDto } from './dto/jwt-payload.dto'; // << Pastikan path dan isi DTO benar
import { User } from '../user/user.entity'; // << Pastikan path benar

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
  constructor(
    private readonly configService: ConfigService,
    private readonly userService: UserService,
  ) {
    // Ambil secret key, pastikan ada nilainya
    const jwtSecret = configService.get<string>('JWT_SECRET');
    if (!jwtSecret) {
      // Lebih baik gagal startup jika secret tidak ada
      throw new Error('JWT_SECRET environment variable is not set!');
    }

    const strategyOptions: StrategyOptions = {
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      ignoreExpiration: false,
      secretOrKey: jwtSecret, // Gunakan variabel yang sudah divalidasi
      // passReqToCallback: false, // Bisa dihapus, defaultnya false
    };
    super(strategyOptions);
  }

  /**
   * Validasi payload token dan cari user.
   */
  async validate(payload: JwtPayloadDto): Promise<Omit<User, 'password_hash'>> {
    console.log('--- JWT Strategy Validate ---');
    console.log('Received Payload:', payload);

    // Validasi dasar payload
    if (!payload || typeof payload.sub !== 'number') {
      console.error('Invalid payload structure or missing/invalid sub (userId)');
      throw new UnauthorizedException('Invalid token payload');
    }

    try {
      // Cari user berdasarkan ID dari payload token
      // Penting: Pastikan userService.findById mengembalikan User | null atau User | undefined
      const user = await this.userService.findById(payload.sub);
      console.log(`User lookup result for ID ${payload.sub}:`, user);

      // --- Gunakan !user untuk mengecek null dan undefined ---
      if (!user) {
        console.error(`User with ID ${payload.sub} not found in database.`);
        throw new UnauthorizedException('User not found');
      }

      // --- Pastikan 'password_hash' adalah nama properti yang benar di User entity ---
      const { password_hash, ...result } = user; // Hapus password hash

      // Jika user.password_hash tidak ada (misal karena nama properti salah),
      // result akan sama dengan user, jadi password ikut terkirim! Double check nama properti.

      console.log('Successfully validated. Returning user data:', result);
      return result; // Kembalikan data user tanpa password -> ini akan jadi req.user

    } catch (error) {
      console.error('Error during user validation in JWT strategy:', error);
      if (error instanceof UnauthorizedException) {
        throw error; // Lempar ulang jika memang UnauthorizedException dari findById/validate
      }
      // Untuk error lain (misal database), lempar error generik
      throw new UnauthorizedException('Token validation failed due to internal error');
    }
  }
}