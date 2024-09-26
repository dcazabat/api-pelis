import { ServeStaticModule } from '@nestjs/serve-static';
import { MiddlewareConsumer, Module, NestModule, RequestMethod } from '@nestjs/common';
import { RedirectMiddleware } from './redirect.middleware';
import { TypeOrmModule } from '@nestjs/typeorm';
import { join } from 'path';
import { ConfigModule } from '@nestjs/config';

// Aplicacion App
import { AppController } from './app.controller';
import { AppService } from './app.service';

// Origen de Datos
import { dataSourceOptions } from "./db/data-source";

// Guards
import { RolesGuard } from './common/guards/roles.guard';

// Modulos
import { AuthModule } from './auth/auth.module';
import { UserModule } from './user/user.module';
import { FavoriteModule } from './favorites/favorite.module';

@Module({
  imports: [
    // ConfigModule global para cargar variables de entorno
    ConfigModule.forRoot({
      isGlobal: true, // Hace que las variables sean accesibles en toda la aplicación
    }),

    // Configuración para servir archivos estáticos (HTML y uploads)
    ServeStaticModule.forRoot(
      {
        rootPath: join(__dirname, 'html'),
        serveRoot: '/html',
      },
      {
        rootPath: join(__dirname, '..', 'uploads'),
        serveRoot: '/uploads' // Ruta del directorio de carga de las imágenes
      },
    ),
    TypeOrmModule.forRoot(dataSourceOptions),
    AuthModule,
    UserModule,
    FavoriteModule,
  ],
  controllers: [AppController],
  providers: [AppService, RolesGuard,],
  exports: [TypeOrmModule]
})

export class AppModule implements NestModule {
  configure(consumer: MiddlewareConsumer) {
    consumer
      .apply(RedirectMiddleware)
      .forRoutes({ path: '/', method: RequestMethod.ALL }); // Aplica el middleware a todas las rutas
  }
}
