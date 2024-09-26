// src/auth/guards/jwt-refresh.guard.ts
import { Injectable } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';

@Injectable()
export class JwtRefreshGuard extends AuthGuard('jwt') {
  // Este guard puede ser extendido para permitir acceso aún cuando el access token ha expirado.
}
