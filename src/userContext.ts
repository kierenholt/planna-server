import mongoose, { Schema, Model, Mongoose, Types } from 'mongoose';
import { UserModel } from './models/schema';

export class UserContext {
    static async createUserIfNotExists(email: string, picture: string, name: string, _id: string)  {
        let mongoClient = await mongoose.connect(process.env.DB_URI as string);
        let newUser = await UserModel.findByIdAndUpdate(_id, 
        {
            picture: picture,
            email: email,
            name: name,
        },
        { upsert: true, new: true, });
        return newUser;
    }
}