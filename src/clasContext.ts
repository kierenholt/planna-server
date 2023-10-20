import mongoose, { Types } from "mongoose";
import { ClasModel } from "./models/clas";
import { UserModel } from "./models/user";

export class ClasContext {
    static async renameClass(classId: Types.ObjectId,  name: string) {
        let mongoClient = await mongoose.connect(process.env.DB_URI as string);
        let updated = await ClasModel.findByIdAndUpdate(classId, { name: name }).exec();
        return updated;
    }

    static async deleteClass(classId: Types.ObjectId,  ownerId: string) {
        let mongoClient = await mongoose.connect(process.env.DB_URI as string);
        let updateResult = await UserModel
            .findByIdAndUpdate(ownerId, {$pull: { classes: classId }} )
            .exec();
        let deleted = await ClasModel.findByIdAndDelete(classId).exec();
        return deleted;
    }

    static async createClass(name: string, ownerId: string) {
        let mongoClient = await mongoose.connect(process.env.DB_URI as string);
        let newClas = await ClasModel.create({ name: name });
        let updated = await UserModel
            .findByIdAndUpdate(ownerId, {$addToSet: { classes: newClas._id }} )
            .exec();
        return updated;
    }
}