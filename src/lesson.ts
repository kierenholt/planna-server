import { app } from ".";
import { NextFunction, Request, Response } from "express";
import { lessonSchema } from "./models/schema";
import mongoose, { Model, ObjectId } from "mongoose";
import { Topic } from "./topic";
import { IRow, RowColl } from "./row";


export interface Lesson extends Document {
    name: string;
    topic?: Topic;
    rows: IRow[];
}

export class LessonColl {
    static model: Model<any> = mongoose.model("Lesson", lessonSchema);
    
    static initAPI() {
        //1 get lesson including rows
        app.get('/v1/lessons/:lessonId', async (req: Request, res: Response, next: NextFunction) => {
            try {
                let found = await this.model.findById(req.params.lessonId).populate("rows");
                res.json(found);
            }
            catch (e) {
                next(e);
            }
        });

        //2 get lesson names of topic
        app.get('/v1/lessons/topic/:topicId/name', async (req: Request, res: Response, next: NextFunction) => {
            try {
                let found = await this.model.find({topic: req.params.topicId}, "name").exec();
                res.json(found);
            }
            catch (e) {
                next(e);
            }
        });

        //3 create default lesson
        app.post('/v1/lessons', async (req: Request, res: Response, next: NextFunction) => {
            try {
                let found = await this.createDefaultLesson(req.body.topicId);
                res.json(found);
            }
            catch (e) {
                next(e);
            }
        });
        
        //4 delete lesson 
        app.delete('/v1/lessons/:id', async (req: Request, res: Response, next: NextFunction) => {
            try {
                let lesson = await this.model.findByIdAndDelete(req.params.id).exec();
                res.json(lesson);
            }
            catch (e) {
                next(e);
            }
        });
        
        //5 rename lesson
        app.patch('/v1/lessons/:id', async (req: Request, res: Response, next: NextFunction) => {
            try {
                let lesson = await this.model.findByIdAndUpdate(req.params.id, {name: req.body.name}, {new: true}).exec();
                res.json(lesson);
            }
            catch (e) {
                next(e);
            }
        });
    }

    static createDefaultLesson(topicId: string): Promise<Lesson> {
        return this.model.create({
            name: "Sample Lesson", 
            topic: topicId,
            rows: [RowColl.DEFAULT_ROW_ID]
        });
    }
}