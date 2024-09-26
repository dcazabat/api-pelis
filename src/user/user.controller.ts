import { Controller, Get, Post, Body, Param, Delete, NotFoundException, Query, UseGuards, Patch } from '@nestjs/common';
import { UserService } from './user.service';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { UserDto } from './dto/user-dto';
import { ApiBadRequestResponse, ApiBearerAuth, ApiBody, ApiCreatedResponse, ApiForbiddenResponse, ApiNotFoundResponse, ApiOkResponse, ApiQuery, ApiTags } from '@nestjs/swagger';
import { AuthGuard } from '@nestjs/passport';
import { Pagination } from 'nestjs-typeorm-paginate';
import { UserRole } from './user-role.enum';
import { Roles } from '../common/decorators/roles.decorator';

const entityName = 'Usuario';
const itemxpega = 10;

@ApiTags('Users')
@Controller('users')
@ApiForbiddenResponse({ description: `${entityName} no autorizado` })
@ApiBadRequestResponse({ description: 'Los datos enviados son incorrectos' })
@UseGuards(AuthGuard('jwt'))
@ApiBearerAuth('access-token')
export class UserController {
    constructor(private readonly userService: UserService) { }

    @Post()
    @Roles(UserRole.ADMIN)
    @ApiBody({ type: CreateUserDto })
    @ApiCreatedResponse({ description: 'Usuario creado exitosamente', type: UserDto })
    @ApiBadRequestResponse({ description: 'Error en la creación del usuario' })
    async create(@Body() createUserDto: CreateUserDto) {
        return this.userService.create(createUserDto);
    }

    @Post('restore/:id')
    @Roles(UserRole.ADMIN)
    @ApiOkResponse({ description: 'Usuario restaurado exitosamente', type: UserDto })
    @ApiNotFoundResponse({ description: 'Usuario no encontrado' })
    async restore(@Param('id') id: number): Promise<UserDto> {
        return this.userService.restore(id);
    }

    @Get()
    @ApiQuery({ name: "page", description: 'Número de la página a devolver, por defecto es la página 1', type: 'number', required: false })
    @ApiQuery({ name: "limit", description: `Cantidad de registros por página, por defecto ${itemxpega}`, type: 'number', required: false })
    @ApiOkResponse({ description: 'Lista de usuarios activos', type: [UserDto] })
    @ApiNotFoundResponse({ description: 'Usuarios no encontrados' })
    async findActives(
        @Query('page') page: number = 1,
        @Query('limit') limit: number = itemxpega,
    ): Promise<Pagination<UserDto>> {
        try {
            const options = { page, limit, route: '/users' };
            const users = await this.userService.findActives(options);

            if (users.items.length > 0) {
                return users;
            } else {
                throw new Error();
            }
        } catch (error) {
            throw new NotFoundException('Usuarios no encontrados', error.message);
        }
    }

    @Get('/pendingacceptance')
    @Roles(UserRole.ADMIN)
    @ApiQuery({ name: "page", description: 'Número de la página a devolver, por defecto es la página 1', type: 'number', required: false })
    @ApiQuery({ name: "limit", description: `Cantidad de registros por página, por defecto ${itemxpega}`, type: 'number', required: false })
    @ApiOkResponse({ description: 'Lista de usuarios pendientes de aceptación', type: [UserDto] })
    @ApiNotFoundResponse({ description: 'Usuarios no encontrados' })
    async findPendingAcceptance(
        @Query('page') page: number = 1,
        @Query('limit') limit: number = itemxpega,
    ): Promise<Pagination<UserDto>> {
        try {
            const options = { page, limit, route: '/users' };
            const users = await this.userService.findPendingAcceptance(options);

            if (users.items.length > 0) {
                return users;
            } else {
                throw new Error();
            }
        } catch (error) {
            throw new NotFoundException('Usuarios no encontrados', error.message);
        }
    }

    @Get('/all')
    @ApiQuery({ name: "page", description: 'Número de la página a devolver, por defecto es la página 1', type: 'number', required: false })
    @ApiQuery({ name: "limit", description: `Cantidad de registros por página, por defecto ${itemxpega}`, type: 'number', required: false })
    @ApiOkResponse({ description: 'Lista de todos los usuarios', type: [UserDto] })
    @ApiNotFoundResponse({ description: 'Usuarios no encontrados' })
    async findAll(
        @Query('page') page: number = 1,
        @Query('limit') limit: number = itemxpega,
    ): Promise<Pagination<UserDto>> {
        try {
            const options = { page, limit, route: '/users/all' };
            const users = await this.userService.findAll(options);

            if (users.items.length > 0) {
                return users;
            } else {
                throw new Error();
            }
        } catch (error) {
            throw new NotFoundException('Usuarios no encontrados', error.message);
        }
    }

    @Get(':id')
    @ApiOkResponse({ description: 'Detalles del usuario', type: UserDto })
    @ApiNotFoundResponse({ description: 'Usuario no encontrado' })
    async findOne(@Param('id') id: number) {
        return this.userService.findOne(id);
    }

    @Get('/name/:username')
    @ApiOkResponse({ description: 'Detalles del usuario por username', type: UserDto })
    @ApiNotFoundResponse({ description: 'Usuario no encontrado' })
    findOneByUsername(@Param('username') username: string) {
        return this.userService.findOneByUsername(username);
    }

    @Patch(':id')
    @ApiBody({ type: UpdateUserDto })
    @ApiOkResponse({ description: 'Usuario actualizado exitosamente', type: UserDto })
    @ApiBadRequestResponse({ description: 'Error en la actualización del usuario' })
    async update(@Param('id') id: number, @Body() updateUserDto: UpdateUserDto) {
        return this.userService.update(id, updateUserDto);
    }

    @Delete(':id')
    @Roles(UserRole.ADMIN)
    @ApiOkResponse({ description: 'Usuario eliminado exitosamente' })
    @ApiNotFoundResponse({ description: 'Usuario no encontrado' })
    async remove(@Param('id') id: number) {
        return this.userService.remove(id);
    }
}
