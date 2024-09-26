import { CommonEntity } from "../../common/entities/common.entity";
import { Column, Entity, ManyToOne } from "typeorm";
import { User } from "../../user/entities/user.entity";

@Entity('favorites')
export class Favorite extends CommonEntity {
    @Column({ nullable: false })
    idFilm: string;

    @Column({ nullable: true })
    observations?: string;
    
    @ManyToOne(() => User, (user) => user.favorites)
    user: User;
}
