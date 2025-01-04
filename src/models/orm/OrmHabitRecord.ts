import {Entity, PrimaryGeneratedColumn, Column, ManyToOne, JoinColumn} from "typeorm"
import {OrmHabit} from "./OrmHabit";

@Entity({
    name: "habit_records"
})
export class OrmHabitRecord {
    @PrimaryGeneratedColumn()
    habit_record_id: number;

    @Column()
    habit_record_uuid: string;

    @Column()
    habit_id: number;
    
    @Column()
    created: Date;

    @ManyToOne(type => OrmHabit) @JoinColumn({
        name: "habit_id",
    })
    habit: OrmHabit;
}
