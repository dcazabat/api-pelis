import { IsNotEmpty, IsOptional, IsString, IsNumber, IsEnum } from 'class-validator';
import { Type } from 'class-transformer';
import { ApiProperty } from '@nestjs/swagger';
import { CommonDto } from '../../common/dto/common.dto';

export class CreateFavoriteDto extends CommonDto {
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
    observations?: string;

    @ApiProperty({
        description: 'ID del usuario que realiza la adopción', 
        example: 202
    })
    @IsNotEmpty()
    @IsNumber()
    @Type(() => Number)
    user: number;
}
