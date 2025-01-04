// src/models/orm/OrmHabit.ts

import { Entity, PrimaryGeneratedColumn, Column, ManyToOne, JoinColumn } from "typeorm";
import { OrmUser } from "./OrmUser";

@Entity({
    name: "habits"
})
export class OrmHabit {
    @PrimaryGeneratedColumn()
    habit_id: number;

    @Column()
    habit_uuid: string;

    @Column()
    user_id: number;

    @Column()
    label: string;

    @Column({ default: false })
    is_deleted: boolean;

    @Column()
    created: Date;

    @ManyToOne(type => OrmUser)
    @JoinColumn({
        name: "user_id",
    })
    user: OrmUser;
}
