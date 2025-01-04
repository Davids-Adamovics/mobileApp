import { Entity, PrimaryGeneratedColumn, Column } from "typeorm";

@Entity()
export class OrmUser {
    @PrimaryGeneratedColumn()
    user_id: number;

    @Column()
    email: string;

    @Column()
    password: string;

    @Column({ nullable: true })
    confirmation_token: string | null;

    @Column({ default: false })
    is_confirmed: boolean;

    @Column({ default: false })
    is_deleted: boolean;
}
