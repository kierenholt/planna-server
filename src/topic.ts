import mongoose, { Model } from "mongoose";
import { app } from ".";
import { NextFunction, Request, Response } from "express";
import { topicSchema } from "./models/schema";
import { Clas } from "./clas";
import { LessonColl } from "./lesson";
import { TaskColl } from "./task";
import { ObjectId } from "mongodb";

export interface Topic extends Document {
    name?: string;
    clas?: Clas;
    isPublicShared?: boolean;
}

export class TopicColl {
    static model: Model<any> = mongoose.model("Topic", topicSchema);

    static initAPI() {
        //1 get topic names of class
        app.get('/v1/topics/class/:classId/name', async (req: Request, res: Response, next: NextFunction) => {
            try {
                let classes = await this.model.find({clas: req.params.classId}, "name");
                res.json(classes);
            }
            catch (e) {
                next(e);
            }
        });

        //2 create default topic
        app.post('/v1/topics', async (req: Request, res: Response, next: NextFunction) => {
            try {
                let found = await this.createDefaultTopic(req.body.clasId);
                res.json(found);
            }
            catch (e) {
                next(e);
            }
        });
        
        //3 delete topic 
        app.delete('/v1/topics/:id', async (req: Request, res: Response, next: NextFunction) => {
            try {
                let deleted = await this.cascadeDelete(req.params.id);
                res.json(deleted);
            }
            catch (e) {
                next(e);
            }
        });
        

        //4 rename topic
        app.patch('/v1/topics/:id', async (req: Request, res: Response, next: NextFunction) => {
            try {
                let topic = await this.model.findByIdAndUpdate(req.params.id, {name: req.body.name}, {new: true}).exec();
                res.json(topic);
            }
            catch (e) {
                next(e);
            }
        });
    }

    static async createDefaultTopic(clasId: string): Promise<any> {
        let newTopic = {
            name: "Sample Topic",
            clas: clasId,
            isPublicShared: false
        };
        //topic may already exist!
        let createdTopic = await this.model.create(newTopic);
        await LessonColl.createDefaultLesson(createdTopic._id);
        return createdTopic;
    }

    static async cascadeDelete(topicId: string): Promise<Topic | null> {
        //delete lessons and tasks
        await LessonColl.model.deleteMany({ topic: topicId }).exec();
        await TaskColl.model.deleteMany({ topic: topicId }).exec();
        //delete topic
        return this.model.findByIdAndDelete(topicId).exec();
    }
}