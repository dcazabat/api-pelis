import { Controller, Get, Post, Body, Patch, Param, Delete, UseGuards, Query, NotFoundException } from '@nestjs/common';
import { FavoriteService } from './favorite.service';
import { CreateFavoriteDto } from './dto/create-favorite.dto';
import { UpdateFavoriteDto } from './dto/update-favorite.dto';
import { FavoriteDto } from './dto/favorite.dto';
import { ApiBadRequestResponse, ApiBearerAuth, ApiBody, ApiCreatedResponse, ApiForbiddenResponse, ApiNotFoundResponse, ApiOkResponse, ApiQuery, ApiTags } from '@nestjs/swagger';
import { AuthGuard } from '@nestjs/passport';
import { Pagination } from 'nestjs-typeorm-paginate';

const entityName = 'Favorite';
const itemxpega = 10;

@ApiTags('Favoritas')
@Controller('favorite')
@ApiForbiddenResponse({ description: `${entityName} no autorizado` })
@ApiBadRequestResponse({ description: 'Los datos enviados son incorrectos' })
export class FavoriteController {
  constructor(private readonly favoriteService: FavoriteService) {}

  @Post()
  @UseGuards(AuthGuard('jwt'))
  @ApiBearerAuth('access-token')
  @ApiBody({ type: CreateFavoriteDto, description: 'Datos necesarios para crear una adopción' })
  @ApiCreatedResponse({ description: `El ${entityName} ha sido agregado`, type: FavoriteDto })
  @ApiBadRequestResponse({ description: 'Error al crear la adopción' })
  create(@Body() createFavoriteDto: CreateFavoriteDto) {
    return this.favoriteService.create(createFavoriteDto);
  }

  @Post('restore/:id')
  @UseGuards(AuthGuard('jwt'))
  @ApiBearerAuth('access-token')
  @ApiOkResponse({ description: `El ${entityName} ha sido restaurado`, type: FavoriteDto })
  @ApiNotFoundResponse({ description: `El ${entityName} con el id proporcionado no fue encontrado` })
  restore(@Param('id') id: number) {
    return this.favoriteService.restore(id);
  }

  @Get()
  @ApiQuery({ name: "page", description: 'Número de página a devolver, por defecto es 1', type: 'number', required: false })
  @ApiQuery({ name: "limit", description: `Cantidad de registros por página, por defecto ${itemxpega}`, type: 'number', required: false })
  @ApiOkResponse({ description: `Lista de adopciones activas`, type: Pagination<FavoriteDto> })
  @ApiNotFoundResponse({ description: 'No se encontraron adopciones activas' })
  async findActives(
    @Query('page') page: number = 1,
    @Query('limit') limit: number = itemxpega,
  ): Promise<Pagination<FavoriteDto>> {
    try {
      const options = {
        page,
        limit,
        route: '/favorite',
      };
      const favorite = await this.favoriteService.findActives(options);

      if (favorite.items.length > 0) {
        return favorite;
      } else {
        throw new Error();
      }
    } catch (error) {
      throw new NotFoundException('Adopciones no encontradas', error.message);
    }
  }

  @Get('/all')
  @ApiQuery({ name: "page", description: 'Número de página a devolver, por defecto es 1', type: 'number', required: false })
  @ApiQuery({ name: "limit", description: `Cantidad de registros por página, por defecto ${itemxpega}`, type: 'number', required: false })
  @ApiOkResponse({ description: `Lista de todas las adopciones`, type: Pagination<FavoriteDto> })
  @ApiNotFoundResponse({ description: 'No se encontraron adopciones' })
  async findAll(
    @Query('page') page: number = 1,
    @Query('limit') limit: number = itemxpega,
  ): Promise<Pagination<FavoriteDto>> {
    try {
      const options = {
        page,
        limit,
        route: '/favorite/all',
      };
      const favorite = await this.favoriteService.findAll(options);

      if (favorite.items.length > 0) {
        return favorite;
      } else {
        throw new Error();
      }
    } catch (error) {
      throw new NotFoundException('Adopciones no encontradas', error.message);
    }
  }

  @Get(':id')
  @ApiOkResponse({ description: `Detalles de la adopción con ID proporcionado`, type: FavoriteDto })
  @ApiNotFoundResponse({ description: `No se encontró la adopción con el ID proporcionado` })
  findOne(@Param('id') id: number) {
    return this.favoriteService.findOne(id);
  }

  @Patch(':id')
  @UseGuards(AuthGuard('jwt'))
  @ApiBearerAuth('access-token')
  @ApiBody({ type: UpdateFavoriteDto, description: 'Datos necesarios para modificar una adopción' })
  @ApiOkResponse({ description: `El ${entityName} ha sido modificado`, type: FavoriteDto })
  @ApiBadRequestResponse({ description: 'Error al modificar la adopción' })
  update(@Param('id') id: string, @Body() updateFavoriteDto: UpdateFavoriteDto) {
    return this.favoriteService.update(+id, updateFavoriteDto);
  }

  @Delete(':id')
  @UseGuards(AuthGuard('jwt'))
  @ApiBearerAuth('access-token')
  @ApiOkResponse({ description: `El ${entityName} ha sido eliminado` })
  @ApiNotFoundResponse({ description: `No se encontró el ${entityName} con el ID proporcionado` })
  remove(@Param('id') id: string) {
    return this.favoriteService.remove(+id);
  }
}
