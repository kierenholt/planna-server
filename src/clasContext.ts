import mongoose, { Types } from "mongoose";
import { ClasModel } from "./models/schema";

export class ClasContext {
    static async getClassesOfUser(_id: string, fields?: string | string[]) {
        let mongoClient = await mongoose.connect(process.env.DB_URI as string);
        if (Array.isArray(fields)) fields = fields.join(" ");
        if (fields) {
            return await ClasModel
                .find( { owner: _id }, fields)
                .exec();
        }
        else {
            return await ClasModel
                .find( { owner: _id })
                .exec();
        }
    }

    static async renameClass(classId: Types.ObjectId,  name: string) {
        let mongoClient = await mongoose.connect(process.env.DB_URI as string);
        let updated = await ClasModel
            .findByIdAndUpdate(classId, { name: name })
            .exec();
        return updated;
    }

    static async deleteClass(classId: Types.ObjectId,  ownerId: string) {
        let mongoClient = await mongoose.connect(process.env.DB_URI as string);
        let deleted = await ClasModel.findByIdAndDelete(classId).exec();
        return deleted;
    }

    static async createClass(name: string, ownerId: string) {
        let mongoClient = await mongoose.connect(process.env.DB_URI as string);
        let newClas = await ClasModel.create(
            { 
                name: name, 
                owner: ownerId
            });
        return newClas;
    }
}