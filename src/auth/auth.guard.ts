import {
  ExecutionContext,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { AuthGuard as PassportAuthGuard } from '@nestjs/passport';

@Injectable()
export class AuthGuard extends PassportAuthGuard('jwt') {
  canActivate(context: ExecutionContext) {
    const request = context.switchToHttp().getRequest();
    console.log('Request URL:', request.url);
    console.log('Auth Header:', request.headers.authorization); // Cek header

    // Skip authentication untuk routes tertentu
    if (['/api/auth/login', '/api/auth/register'].includes(request.url)) {
      return true;
    }

    // Gunakan implementasi passport untuk routes lainnya
    return super.canActivate(context);
  }
}
