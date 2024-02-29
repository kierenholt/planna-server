import { app } from ".";
import { NextFunction, Request, Response } from "express";
import { userSchema } from "./models/schema";
import mongoose from "mongoose";
import { TopicColl } from "./topic";
import { ClassificationType } from "typescript";
import { ClasColl } from "./clas";

export interface User extends Document {
    _id: string; //GXXX for google
    name: string;
    email: string;
    picture?: string;
}

export class UserColl {
    static model = mongoose.model("User", userSchema);
    
    static initAPI() {
        //create user
        app.post('/v1/users', async (req: Request, res: Response, next: NextFunction) => {
            try {
                if (!req.body.id) throw("id field must exist on body");
                let id = req.body.id;
                delete(req.body.id);

                let createdUser = await this.model.findByIdAndUpdate(id, req.body,
                    { upsert: true, new: true, }).exec();
        
                res.json(createdUser);
            }
            catch (e) {
                next(e);
            }
        });

        //delete user 
        app.delete('/v1/users/:id', async (req: Request, res: Response, next: NextFunction) => {
            try {
                //delete classes
                let foundClasses: string[] = await ClasColl.model.find({ owner: req.params.id }, "id").exec();
                for (let clasId of foundClasses) {
                    ClasColl.cascadeDelete(clasId);
                }
                //delete user
                let deletedUser: any = await this.model.findByIdAndDelete(req.params.id).exec();
                res.json(deletedUser);
            }
            catch (e) {
                next(e);
            }
        });
    }

}