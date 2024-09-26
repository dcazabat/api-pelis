import { ApiProperty } from "@nestjs/swagger";
import { Type } from "class-transformer";
import { IsBoolean, IsDate, IsEmail, IsNumber, IsOptional, IsString, Length } from "class-validator";


export class CreateUserDto {
    @ApiProperty({
        description: 'Nombre de usuario único para el registro. Debe contener entre 6 y 15 caracteres.',
        example: 'john_doe',
    })
    @IsString()
    @Length(6, 15)
    username: string;

    @ApiProperty({
        description: 'Contraseña del usuario. Se recomienda que sea segura y encriptada.',
        example: 'StrongP@ssw0rd!',
    })
    @IsString()
    password: string;

    @ApiProperty({
        description: 'Indica si el usuario está activo o inactivo.',
        example: true,
        required: false,
    })
    @IsBoolean()
    @IsOptional()
    userState?: boolean;

    @ApiProperty({
        description: 'Indica si el usuario debe actualizar su contraseña al iniciar sesión.',
        example: false,
    })
    @IsBoolean()
    updatePassword?: boolean;

    @ApiProperty({
        description: 'URL del avatar del usuario. Campo opcional.',
        example: 'https://example.com/avatar.jpg',
        nullable: true,
        required: false,
    })
    @IsString()
    @IsOptional()
    avatarUrl?: string;

    @ApiProperty({
        description: 'URL del perfil del usuario.',
        example: 'https://example.com/profile/johndoe',
    })
    @IsString()
    profileUrl?: string;

    @ApiProperty({
        description: 'Nombre de pila del usuario.',
        example: 'John',
    })
    @IsString()
    firstName: string;

    @ApiProperty({
        description: 'Apellido del usuario.',
        example: 'Doe',
    })
    @IsString()
    lastName: string;

    @ApiProperty({
        description: 'Dirección física del usuario. Campo opcional.',
        example: '123 Main St',
        required: false,
    })
    @IsString()
    @IsOptional()
    address?: string;

    @ApiProperty({
        description: 'Ciudad de residencia del usuario. Campo opcional.',
        example: 'New York',
        required: false,
    })
    @IsString()
    @IsOptional()
    city?: string;

    @ApiProperty({
        description: 'Fecha de nacimiento del usuario. Formato ISO.',
        example: '1969-12-31',
        required: false,
    })
    @IsDate()
    @Type(() => Date)
    @IsOptional()
    birthday?: Date;

    @ApiProperty({
        description: 'Código postal del lugar de residencia del usuario. Campo opcional.',
        example: 10001,
        required: false,
    })
    @IsNumber()
    @IsOptional()
    zipCode?: number;

    @ApiProperty({
        description: 'Número de teléfono del usuario. Campo opcional.',
        example: '+1234567890',
        required: false,
    })
    @IsString()
    @IsOptional()
    phoneNumber?: string;

    @ApiProperty({
        description: 'Correo electrónico del usuario. Campo opcional.',
        example: 'user@email.com',
        required: false,
    })
    @IsEmail()
    @IsOptional()
    email?: string;

    @ApiProperty({
        description: 'Observaciones adicionales sobre el usuario. Campo opcional.',
        example: 'Este usuario es voluntario en el refugio de animales.',
        required: false,
    })
    @IsString()
    @IsOptional()
    observations: string;
}
