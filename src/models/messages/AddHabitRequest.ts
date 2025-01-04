export interface AddHabitRequest {
    habit_label: string;
    session_token: string;
}

export interface AddHabitResponse {
    habit_uuid: string;
    is_success: boolean;
    error_message?: string;
}
