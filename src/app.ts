import {Application} from "express";
import express from "express";
import moment from "moment";

import cluster from "cluster";
import os from "os";
import nodemailer from "nodemailer";
import fs from "fs";
import * as _ from "lodash";
import {RegisterRoutes} from "./routers/routes";
import swaggerUi from "swagger-ui-express";


// All APIs that need to be included must be imported in app.ts
import {ControllerDummy} from "./controllers/ControllerDummy";
import {ControllerUsers} from "./controllers/ControllerUsers";
import {ControllerDatabase} from "./controllers/ControllerDatabase";


const PORT = 8000;
const app: Application = express();
const IS_PRODUCTION = process.env.IS_PRODUCTION;


if (cluster.isPrimary && IS_PRODUCTION) {
    let cpuCount = os.cpus().length;
    for (let i = 0; i < cpuCount; i++) {
        cluster.fork();
    }
} else {
    app.use(express.json());
    app.use(express.static("public")); // from this directory you can load files directly

    ControllerDatabase.instance.connect();

    RegisterRoutes(app);

    app.use(
        "/docs",
        swaggerUi.serve,
        swaggerUi.setup(undefined, {
            swaggerOptions: {
                url: "/swagger.json",
            },
        }),
    );

    app.listen(PORT, () => {
        console.log(`server running http://localhost:${PORT}`);
    })
}