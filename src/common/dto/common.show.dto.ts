import { Exclude, Expose } from "class-transformer"
import { IsBoolean, IsNumber } from "class-validator"

export abstract class CommonShowDto {
    @Expose()
    @IsNumber()
    id: number

    @Exclude()
    @IsBoolean()
    state?: boolean

    @Expose()
    createAt?: Date

    @Exclude()
    updateAt?: Date

    @Exclude()
    deleteAt?: Date
}