import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Favorite } from './entities/favorite.entity';
import { User } from '../user/entities/user.entity';
import { FavoriteService } from './favorite.service';
import { FavoriteController } from './favorite.controller';

@Module({
  imports: [TypeOrmModule.forFeature([Favorite, User])],
  controllers: [FavoriteController],
  providers: [FavoriteService],
  exports: [TypeOrmModule]
})
export class FavoriteModule {}
