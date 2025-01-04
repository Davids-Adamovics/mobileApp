import {Entity, PrimaryGeneratedColumn, Column, OneToOne, JoinColumn} from "typeorm"
import {OrmUser} from "./OrmUser";

@Entity({
    name: "sessions"
})
export class OrmSession {
    @PrimaryGeneratedColumn()
    session_id: number;

    @Column()
    session_uuid: string;

    @Column()
    user_id: number;

    @Column()
    session_token: string;

    @Column()
    is_valid: boolean;

    @Column()
    created: Date;

    @OneToOne(type => OrmUser) @JoinColumn({
        name: "user_id",
    })
    user: OrmUser;
}

