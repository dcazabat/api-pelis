import { BadRequestException, HttpException, HttpStatus, Injectable, InternalServerErrorException, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { FindOptionsWhere, Repository } from 'typeorm';
import { plainToInstance } from 'class-transformer';
import { IPaginationOptions, paginate, Pagination } from 'nestjs-typeorm-paginate';
import { User } from '../user/entities/user.entity';
import { Favorite } from './entities/favorite.entity';
import { CreateFavoriteDto } from './dto/create-favorite.dto';
import { FavoriteDto } from './dto/favorite.dto';
import { UpdateFavoriteDto } from './dto/update-favorite.dto';

@Injectable()
export class FavoriteService {
  constructor(
    @InjectRepository(Favorite)
    private readonly favoriteRepository: Repository<Favorite>,
    @InjectRepository(User)
    private readonly userRepository: Repository<User>,
  ) { }

  async create(createFavoriteDto: CreateFavoriteDto) {
    try {
      const favorite = new Favorite();

      // Asignar valores simples
      favorite.idFilm = createFavoriteDto.idFilm;
      if ("observations" in createFavoriteDto) 
        favorite.observations = createFavoriteDto.observations;

      // Transformar los IDs en entidades
      favorite.user = await this.userRepository.findOneByOrFail({ id: createFavoriteDto.user });

      await this.favoriteRepository.save(favorite);
      return plainToInstance(FavoriteDto, favorite);
    } catch (error) {
      throw new HttpException('Favorite no guardado', HttpStatus.INTERNAL_SERVER_ERROR);
    }
  }

  async findActives(options: IPaginationOptions): Promise<Pagination<FavoriteDto>> {
    try {
      const queryBuilder = this.favoriteRepository.createQueryBuilder('favorites');
      queryBuilder
        .leftJoinAndSelect('favorites.user', 'favoritesuser') // Se contemplan las realciones planteadas en la Entity
        .orderBy('favorites.createAt', 'ASC');

      const paginatedFavorite = await paginate<Favorite>(queryBuilder, options);
      return new Pagination<FavoriteDto>(
        plainToInstance(FavoriteDto, paginatedFavorite.items),
        paginatedFavorite.meta, paginatedFavorite.links
      );
    } catch (error) {
      throw new BadRequestException(error.message, 'Favorite no encontrados')
    }
  }

  async findAll(options: IPaginationOptions): Promise<Pagination<FavoriteDto>> {
    try {
      const queryBuilder = this.favoriteRepository.createQueryBuilder('favorites');
      queryBuilder
        .withDeleted()
        .leftJoinAndSelect('favorites.user', 'favoritesuser') // Se contemplan las realciones planteadas en la Entity
        .orderBy('favorites.createAt', 'ASC');

      const paginatedFavorite = await paginate<Favorite>(queryBuilder, options);
      return new Pagination<FavoriteDto>(
        plainToInstance(FavoriteDto, paginatedFavorite.items),
        paginatedFavorite.meta, paginatedFavorite.links
      );
    } catch (error) {
      throw new BadRequestException(error.message, 'Favorite no encontrados')
    }
  }

  async findOne(id: number): Promise<FavoriteDto> {
    const favorite = await this.favoriteRepository.findOne({
      where: {
        id
      } as FindOptionsWhere<Favorite>
    })
    try {
      if (!favorite) throw new Error
      return plainToInstance(FavoriteDto, favorite);
    } catch (error) {
      throw new NotFoundException(error.message, 'Favorite no encontrado')
    }
  }

  async update(id: number, updateFavoriteDto: UpdateFavoriteDto) {
    try {
      const updateData: Partial<Favorite> = {};

      // Asigna valores simples
      if (updateFavoriteDto.idFilm !== undefined) updateData.idFilm = updateFavoriteDto.idFilm;
      if (updateFavoriteDto.observations !== undefined) updateData.observations = updateFavoriteDto.observations;

      // Transforma IDs en entidades
      if (updateFavoriteDto.user !== undefined) {
        updateData.user = await this.userRepository.findOneByOrFail({
          id: updateFavoriteDto.user,
        });
      }

      await this.favoriteRepository.update(id, updateData);
      return await this.favoriteRepository.findOneByOrFail({ id });
    } catch (error) {
      throw new NotFoundException(error.message, 'Favorite no encontrado');
    }
  }

  async remove(id: number) {
    try {
      const favoriteToDelete = await this.favoriteRepository.softDelete(id)
      if (favoriteToDelete.affected === 0) {
        throw new NotFoundException('Favorite no encontrado');
      } else {
        return favoriteToDelete
      }
    } catch (error) {
      throw new InternalServerErrorException(error.message, 'Favorite no eliminado');
    }
  }

  async restore(id: number): Promise<Favorite> {
    try {

      const result = await this.favoriteRepository.restore(id);
      if (result.affected === 0) {
        throw new NotFoundException('Favorite no encontrado');
      }

      return this.favoriteRepository.findOne({ where: { id: id } });
    } catch (error) {
      throw new InternalServerErrorException(error.message, 'Favorite no Restaurado');
    }
  }
}
