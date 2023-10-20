import mongoose, { Schema, Model, Mongoose, Types } from 'mongoose';
import { IUser, UserModel } from "./models/user";

export class UserContext {
    static async getClassesOfUser(_id: any) {
        let mongoClient = await mongoose.connect(process.env.DB_URI as string);
        let found = await UserModel.findById(_id).populate('classes').exec();
        if (!found) throw(`user with id ${_id} not found`);
        return found.classes;
    }

    static async createUser(email: string, picture: string, name: string, _id: string): Promise<IUser>  {
        let mongoClient = await mongoose.connect(process.env.DB_URI as string);
        let newUser = await UserModel.create({
            picture: picture,
            email: email,
            name: name,
            _id: _id
        });
        return newUser;            
    }
}