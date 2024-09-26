import { ApiProperty } from "@nestjs/swagger";
import { Transform } from "class-transformer";
import { IsNumber, IsString, MinLength } from "class-validator";

export class LoginDto {
    @ApiProperty({ description: 'Nombre de Usuario', example: 'pepito' })
    @IsString()
    @MinLength(6)
    @Transform(({ value }) => value.trim())
    username: string;
    
    @ApiProperty({ description: 'Contraseña del Usuario', example: 'Noseamosobvios1#' })
    @IsString()
    @MinLength(6)
    @Transform(({ value }) => value.trim())
    password: string;
}