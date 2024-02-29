import express, { NextFunction, Request, Response } from "express";
import { config } from 'dotenv';
import mongoose from "mongoose";
import { UserColl } from "./user";
import { ClasColl } from "./clas";
import { TopicColl } from "./topic";
import { TaskColl } from "./task";
import { LessonColl } from "./lesson";
import { RowColl } from "./row";
var cors =  require('cors');

config();
export const app = express();
const corsOptions = {
    methods: ['POST', ,'PUT', 'GET', 'DELETE'] //make them idempotent
}
app.use(cors(corsOptions));
app.use(express.json({ limit: '50mb' }));

mongoose.connect(process.env.DB_URI as string);

//GET to read, PUT to create, PUT to update, DELETE to delete
//https://nordicapis.com/10-best-practices-for-naming-api-endpoints/
//https://www.scaler.com/topics/expressjs-tutorial/express-query-params/


UserColl.initAPI();
ClasColl.initAPI();
TopicColl.initAPI();
TaskColl.initAPI();
LessonColl.initAPI();
RowColl.initAPI();

app.listen(process.env.PORT, () => {console.log("listening on port  " + process.env.PORT)});
app.on("close",() => console.log("closing"))
