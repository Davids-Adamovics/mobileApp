import { DataSource } from "typeorm";
//import sha1
import * as sha1 from "js-sha1";
import {v4 as uuidv4} from 'uuid';
import {OrmUser} from "../models/orm/OrmUser";
import {OrmSession} from "../models/orm/OrmSession";
import {OrmHabit} from "../models/orm/OrmHabit";
import { OrmHabitRecord } from "../models/orm/OrmHabitRecord";
import moment from "moment";

import * as crypto from "node:crypto";

export class ControllerDatabase {
    //singleton
    private static _instance: ControllerDatabase;
    private constructor() {
        //init litesql datasource
        this.dataSource = new DataSource({
            type: "sqlite",
            database: "./database.sqlite",
            //driver: SQLite,
            logging: false,
            synchronize: false,
            entities: [
                OrmUser,
                OrmSession
            ]
        })
    }


    public static get instance(): ControllerDatabase {
        if (!ControllerDatabase._instance) {
            ControllerDatabase._instance = new ControllerDatabase();
        }
        return ControllerDatabase._instance;
    }

    //datasource
    private dataSource: DataSource;

    public async connect(): Promise<void> {
        await this.dataSource.initialize();
    }

    public async getUsers(): Promise<OrmUser[]> {
        let users = await this.dataSource.manager.find(OrmUser, {
            where: {
                is_deleted: false
            }
        });
        return users;
    }

    public async getSessionToken(session_token: string): Promise<OrmSession> {
        let session = await this.dataSource.manager.findOne(OrmSession, {
            where: {
                session_token: session_token,
                is_valid: true
            }
        });
        return session;
    }

    public async getUserBySessionToken(session_token: string): Promise<OrmUser> {
        let session = await this.getSessionToken(session_token);
        return session.user;
    }

    public async addHabit(habitLabel: string, session_token: string): Promise<OrmHabit> {
        let user = await this.getUserBySessionToken(session_token);
        if (user) {
            let habit = new OrmHabit();
            habit.label = habitLabel;
            habit.user = user;
            habit.habit_uuid = uuidv4(); // Add UUID for tracking
            await this.dataSource.manager.save(habit);
            return habit;
        }
        return null;
    }


    public async getHabits(session_token: string) : Promise<OrmHabit[]> {
        let user = await this.getUserBySessionToken(session_token);
        let habits: OrmHabit[] = [];
        if (user) {
            habits = await this.dataSource.manager.find(OrmHabit, {
                where: {
                    user: user,
                    is_deleted: false
                }
            });
        }
        return habits;
    }

    public async addHabitRecord(habit_uuid: string, session_token: string) : Promise<OrmHabitRecord> {
        let user = await this.getUserBySessionToken(session_token);
        let habit = await this.dataSource.manager.findOne(OrmHabit, {
            where: {
                habit_uuid: habit_uuid
            }
        });
        let habitRecord = new OrmHabitRecord();
        habitRecord.habit = habit;
        habitRecord.created = moment().toDate();
        await this.dataSource.manager.save(habitRecord);
        return habitRecord;
    }

    public async getHabitRecords(habit_uuid: string): Promise<OrmHabitRecord[]> {
        let habit = await this.dataSource.manager.findOne(OrmHabit, {
            where: {
                habit_uuid: habit_uuid,
                is_deleted: false
            }
        });
        let habitRecords = [];
        if (habit) {
            habitRecords = await this.dataSource.manager.find(OrmHabitRecord, {
                where: {
                    habit: habit
                }
            });
        }
        return habitRecords;
    }


    public async login(email: string, password: string): Promise<OrmSession> {

        let hasher = crypto.createHash("sha1");
        hasher.update(password)
        let sha1Password = hasher.digest("hex");

        let user = await this.dataSource.manager.findOne(OrmUser, {
            where: {
                email: email,
                password: sha1Password
            }
        });
        if(!user) {
            return null;
        }
        let sessionToken = uuidv4();

        let session:OrmSession = new OrmSession();
        session.user_id = user.user_id;
        session.session_token = sessionToken;
        session.is_valid = true;
        session.created = new Date();
        //session.user = user;

        //Insert session in database
        await this.dataSource.manager.save(session);

        //load session with user
        let sessionWithUser = await this.dataSource.manager.findOne(OrmSession, {
            where: {
                session_id: session.session_id
            },
            relations: {
                user: true
            }
        });

        return sessionWithUser;
    }

    public async logout(session_token: string) : Promise<void> {
        let session = await this.dataSource.manager.findOne(OrmSession, {
            where: {
                session_token: session_token
            }
        });
        if (session) {
            session.is_valid = false;
            await this.dataSource.manager.save(session);
        }
    }

    public async createUser(email: string, password: string): Promise<OrmUser> {
        let user = new OrmUser();
        user.email = email;
        user.password = password; // TODO hash password

        await this.dataSource.manager.save(user);
        return user;
    }

    public async confirmUser(uuid: string): Promise<OrmUser | null> {
        let user = await this.dataSource.manager.findOne(OrmUser, {
            where: {
                confirmation_token: uuid // This is assuming 'confirmation_token' is a valid field on the OrmUser entity
            }
        });

        if (user) {
            // Confirm the user (you can update a "confirmed" field, for example)
            user.is_confirmed = true;
            user.confirmation_token = null; // Clear the confirmation token
            await this.dataSource.manager.save(user);
        }

        return user;  // Return the user if confirmed, or null if not found
    }


}
