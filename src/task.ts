import { app } from ".";
import { NextFunction, Request, Response } from "express";
import { taskSchema } from "./models/schema";
import mongoose, { Model } from "mongoose";
import { Topic } from "./topic";
import { Helpers } from "./helpers";
import { LessonColl } from "./lesson";

export interface Task extends Document {
    name?: string;
    topic?: Topic;
}
 export class TaskColl {
    static model: Model<any> = mongoose.model("Task", taskSchema);

    static initAPI() {

        //TASKS
        //get task names of topic
        app.get('/v1/tasks/topic/:topicId/name', async (req: Request, res: Response, next: NextFunction) => {
            try {
                let classes = await this.model.find({topic: req.params.topicId}, "name").exec();
                res.json(classes);
            }
            catch (e) {
                next(e);
            }
        });


        //create default task
        app.post('/v1/tasks', async (req: Request, res: Response, next: NextFunction) => {
            try {
                let classes = await this.createDefaultTask(req.body.topicId);
                res.json(classes);
            }
            catch (e) {
                next(e);
            }
        });
        
        //delete task 
        app.delete('/v1/tasks/:id', async (req: Request, res: Response, next: NextFunction) => {
            try {
                let ret = await this.model.findByIdAndDelete(req.params.id).exec();
                res.json(ret);
            }
            catch (e) {
                next(e);
            }
        });
        
        //5 rename task
        app.patch('/v1/tasks/:id', async (req: Request, res: Response, next: NextFunction) => {
            try {
                let task = await this.model.findByIdAndUpdate(req.params.id, {name: req.body.name}, {new: true}).exec();
                res.json(task);
            }
            catch (e) {
                next(e);
            }
        });
    }

    static async createDefaultTask(topicId: string): Promise<any> {
        let newTopic = await this.model.create({
            name: "New Task",
            topic: topicId
        });
        return newTopic;
    }

 }