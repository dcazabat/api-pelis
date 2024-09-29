import { CommonEntity } from '../../common/entities/common.entity';
import { Entity, Column, OneToOne, OneToMany } from 'typeorm';
import { UserRole } from '../../common/decorators/user-role.enum';
import { Favorite } from '../../favorites/entities/favorite.entity';

@Entity('users')
export class User extends CommonEntity {
    @Column({ nullable: false, unique: true })
    username: string;

    @Column({ nullable: false })
    password: string;

    @Column({ default: true })
    updatePassword: boolean;

    @Column({ nullable: true })
    avatarUrl: string;

    @Column({ nullable: true })
    profileUrl: string;

    @Column({ nullable: false })
    firstName: string;

    @Column({ nullable: false })
    lastName: string;

    @Column({ nullable: true })
    address: string;

    @Column({ nullable: true })
    city: string;

    @Column({ nullable: true })
    birthday: Date;

    @Column({ nullable: true })
    zipCode: number;

    @Column({ nullable: true })
    phoneNumber: string;

    @Column({ nullable: true })
    email: string;

    @Column({ nullable: true })
    observations: string;

    @Column({ nullable: true })
    refreshToken: string;

    // Nueva columna para almacenar roles
    @Column({
        type: 'enum',
        enum: UserRole,
        array: true,
        default: [UserRole.USER]  // Por defecto, los usuarios tienen el rol 'USER'
    })
    roles: UserRole[];

    // Relación OneToOne inversa con Favoritos
    @OneToMany(() => Favorite, (favorites) => favorites.user)
    favorites: Favorite[];
}
