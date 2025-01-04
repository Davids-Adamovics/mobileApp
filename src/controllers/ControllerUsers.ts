import { Body, Controller, Post, Get, Route, Query } from "tsoa";
import { UserLoginRequest } from "../models/messages/UserLoginRequest";
import { UserLoginResponse } from "../models/messages/UserLoginResponse";
import { RegisterUserRequest } from "../models/messages/RegisterUserRequest"; // Import the interface
import { RegisterUserResponse } from "../models/messages/RegisterUserResponse"; // Import the interface
import { ControllerDatabase } from "./ControllerDatabase";
import { UserLogoutRequest } from "../models/messages/UserLogoutRequest";
import { v4 as uuidv4 } from "uuid"; // Import uuid for generating tokens
import { ConfirmationResponse } from "../models/messages/ConfirmationResponse"; // Import the interface

@Route("users")
export class ControllerUsers {
    @Post("login")
    public async login(@Body() request: UserLoginRequest): Promise<UserLoginResponse> {
        let response: UserLoginResponse = {
            is_success: false
        };

        try {
            let session = await ControllerDatabase.instance.login(
                request.email,
                request.password
            );
            if (session) {
                response.session_token = session.session_token;
                response.is_success = true;
            } else {
                response.error_message = "email_or_password_wrong";
            }
        } catch (exc) {
            console.error("Error", exc);
            response.error_message = exc.message;
        }

        return response;
    }

    @Post("logout")
    public async logout(@Body() request: UserLogoutRequest): Promise<UserLoginResponse> {
        let response: UserLoginResponse = {
            is_success: false
        };

        try {
            let session = await ControllerDatabase.instance.getSessionToken(request.session_token);
            // TODO: Set session invalid or any other logout logic
        } catch (exc) {
            console.error("Error", exc);
            response.error_message = exc.message;
        }

        return response;
    }

    @Post("register")
    public async register(@Body() request: RegisterUserRequest): Promise<RegisterUserResponse> {
        let response: RegisterUserResponse = {
            is_success: false
        };

        try {
            const user = await ControllerDatabase.instance.createUser(request.email, request.password);
            const confirmationToken = uuidv4(); // Generate the confirmation token
            await sendConfirmationEmail(request.email, confirmationToken); // Send confirmation email
            response.is_success = true;
        } catch (error) {
            console.error("Error", error);
            response.error_message = error.message;
        }

        return response;
    }

    @Get("confirmation/:uuid")
    public async confirmUser(@Query() uuid: string): Promise<ConfirmationResponse> {
        let response: ConfirmationResponse = {
            is_success: false
        };

        try {
            const user = await ControllerDatabase.instance.confirmUser(uuid);
            if (user) {
                response.is_success = true;
            } else {
                response.error_message = "Invalid or expired token.";
            }
        } catch (error) {
            console.error("Error", error);
            response.error_message = error.message;
        }

        return response;
    }
}
function sendConfirmationEmail(email: string, confirmationToken: any) {
    throw new Error("Function not implemented.");
}

