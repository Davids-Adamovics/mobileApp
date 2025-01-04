import { Body, Controller, Post, Get, Route, Query } from "tsoa";
import { AddHabitRequest } from "../models/messages/AddHabitRequest";
import { AddHabitResponse } from "../models/messages/AddHabitResponse";
import { ListHabitsResponse } from "../models/messages/ListHabitsResponse";
import { ControllerDatabase } from "./ControllerDatabase";

@Route("habits")
export class ControllerHabits {

    // Add Habit
    @Post("add")
    public async addHabit(@Body() request: AddHabitRequest): Promise<AddHabitResponse> {
        let response: AddHabitResponse = {
            is_success: false,
            habit_uuid: ""
        };

        try {
            const habit = await ControllerDatabase.instance.addHabit(request.habit_label, request.session_token);
            if (habit) {
                response.is_success = true;
                response.habit_uuid = habit.habit_uuid;  // Make sure habit_uuid is returned after creation
            } else {
                response.error_message = "Invalid session or failed to add habit.";
            }
        } catch (error) {
            console.error("Error", error);
            response.error_message = error.message;
        }

        return response;
    }

    // List Habits
    @Get("list")
    public async listHabits(@Query() session_token: string): Promise<ListHabitsResponse> {
        let response: ListHabitsResponse = {
            habits: []
        };

        try {
            const habits = await ControllerDatabase.instance.getHabits(session_token);
            response.habits = habits;
        } catch (error) {
            console.error("Error", error);
            response.habits = [];
        }

        return response;
    }
}
