import { ApiProperty } from "@nestjs/swagger"
import { Exclude, Expose } from "class-transformer"
import { IsBoolean, IsNumber } from "class-validator"

export abstract class CommonDto {
    @ApiProperty()
    @Expose()
    @IsNumber()
    id: number

    @Exclude()
    @IsBoolean()
    state?: boolean

    @Exclude()
    createAt?: Date

    @Exclude()
    updateAt?: Date

    @Exclude()
    deleteAt?: Date
}