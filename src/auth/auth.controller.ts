// src/auth/auth.controller.ts
import { Body, Controller, Get, Post, Req, UseGuards } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { AuthService } from './auth.service';
import {
    ApiBadRequestResponse,
    ApiBearerAuth,
    ApiBody,
    ApiForbiddenResponse,
    ApiOkResponse,
    ApiTags,
    ApiUnauthorizedResponse
} from '@nestjs/swagger';
import { LoginDto } from './dto/login.dto';

const entityName = 'Autenticacion'

@ApiTags('Authentication')
@Controller('auth')
@ApiForbiddenResponse({ description: `${entityName} no autorizado` })
@ApiBadRequestResponse({ description: 'Los datos enviados son incorrectos' })
export class AuthController {
    constructor(private readonly authService: AuthService) { }

    @Get('google')
    @UseGuards(AuthGuard('google'))
    @ApiOkResponse({ description: 'Redireccionamiento a la autenticación de Google' })
    async googleAuth(@Req() req) { }

    @Get('google/callback')
    @UseGuards(AuthGuard('google'))
    @ApiOkResponse({ description: 'Autenticación exitosa con Google' })
    @ApiUnauthorizedResponse({ description: 'Autenticación fallida con Google' })
    googleAuthRedirect(@Req() req) {
        return this.authService.login(req.user);
    }

    @Post('login')
    @ApiBody({ type: LoginDto })
    @ApiOkResponse({ description: 'Inicio de sesión exitoso' })
    @ApiUnauthorizedResponse({ description: 'Credenciales incorrectas' })
    async login(@Body('username') username: string, @Body('password') password: string) {
        return this.authService.loginWithCredentials(username, password);
    }

    @Post('refresh')
    @ApiBody({ description: 'Token de actualización', type: String })
    @ApiOkResponse({ description: 'Token actualizado exitosamente' })
    @ApiUnauthorizedResponse({ description: 'Token de actualización inválido o expirado' })
    async refreshToken(@Body('refresh_token') refreshToken: string, @Req() req) {
        console.log(req);
        const userId = req.id; // obtener el ID del usuario desde el access token anterior (JWT)
        return this.authService.refreshToken(userId, refreshToken);
    }

    @Post('logout')
    @UseGuards(AuthGuard('jwt'))
    @ApiBearerAuth('access-token')
    @ApiOkResponse({ description: 'Cierre de sesión exitoso' })
    @ApiUnauthorizedResponse({ description: 'Token de acceso inválido o expirado' })
    async logout(@Req() req) {
        const userId = req.user.userId;
        return this.authService.logout(userId);
    }
}
