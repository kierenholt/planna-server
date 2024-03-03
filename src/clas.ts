import { app } from ".";
import { NextFunction, Request, Response } from "express";
import { clasSchema } from "./models/schema";
import mongoose, { Model } from "mongoose";
import { User } from "./user";
import { TopicColl } from "./topic";
import { LessonColl } from "./lesson";
import { ObjectId } from "mongodb";


export interface Clas extends Document {
    name: string;
    settings: string;
    owner: User;
}

export class ClasColl {
    static model: Model<any> = mongoose.model("Clas", clasSchema);
    
    static initAPI() {
        //1 get class names of owner 
        app.get('/v1/classes/owner/:ownerId/name', async (req: Request, res: Response, next: NextFunction) => {
            try {
                let classes = await this.model.find({owner: req.params.ownerId}, "name"); //owner does not need cast
                res.json(classes);
            }
            catch (e) {
                next(e);
            }
        });

        //2 delete class 
        app.delete('/v1/classes/:id', async (req: Request, res: Response, next: NextFunction) => {
            try {
                let deleted = await this.cascadeDelete(req.params.id);
                res.json(deleted);
            }
            catch (e) {
                next(e);
            }
        });

        //3 rename class
        app.patch('/v1/classes/:id', async (req: Request, res: Response, next: NextFunction) => {
            try {
                let classes = await this.model.findByIdAndUpdate(req.params.id, {name: req.body.name}, {new: true}).exec();
                res.json(classes);
            }
            catch (e) {
                next(e);
            }
        });

        //4 create default class
        app.post('/v1/classes', async (req: Request, res: Response, next: NextFunction) => {
            try {
                let found = await this.createDefaultClas(req.body.ownerId);
                res.json(found);
            }
            catch (e) {
                next(e);
            }
        });
    }

    static async createDefaultClas(ownerId: string): Promise<any> {
        let newClas = {
            name: "Sample Class",
            owner: ownerId,
            settings: ""
        };
        //class may already exist!
        let createdClas = await this.model.create(newClas);
        let newTopic = await TopicColl.createDefaultTopic(createdClas._id);
        await LessonColl.createDefaultLesson(newTopic.id);
        return createdClas;
    }    

    static async cascadeDelete(clasId: string): Promise<Clas | null> {
        //delete topics
        let foundTopics: string[] = await TopicColl.model.find({ clas: clasId }, "id");
        for (let topicId of foundTopics) {
            await TopicColl.cascadeDelete(topicId);
        }
        //delete class
        return this.model.findByIdAndDelete(clasId);
    }
}