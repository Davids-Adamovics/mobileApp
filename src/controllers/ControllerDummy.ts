import {Body, Controller, Post, Get, Route, FormField, Query} from "tsoa";

@Route("dummy")
export class ControllerDummy {

    // FormField if using file upload otherwise
    @Post("DummyFunction")
    public async DummyFunction(@Query() input_name: string): Promise<any> {
        let result = "echo: " + input_name;
        return {result: result};
    }
}
