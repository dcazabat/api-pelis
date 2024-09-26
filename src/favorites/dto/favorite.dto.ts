import { IsNotEmpty, IsOptional, IsString, IsNumber, IsEnum } from 'class-validator';
import { Type } from 'class-transformer';
import { ApiProperty } from '@nestjs/swagger';
import { User } from '../../user/entities/user.entity';
import { CommonDto } from '../../common/dto/common.dto';

export class FavoriteDto extends CommonDto {
    @ApiProperty({
        description: 'Id de la Pelicula o Serie Favorita', 
        example: '1251'
    })
    @IsNotEmpty()
    @IsString()
    idFilm: string;

    @ApiProperty({
        description: 'Observaciones sobre la Pelicula o Serie Favorita', 
        example: 'Me gustaron las escenas de accion con autos'
    })
    @IsOptional()
    @IsString()
    observations: string;

    @ApiProperty({
        description: 'Detalles del Usuario', 
        type: User, 
        example: { id: 202, name: 'Juan Pérez', email: 'juanperez@example.com' }
    })
    @IsNotEmpty()
    @IsNumber()
    @Type(() => User)
    idUser: User;
}
