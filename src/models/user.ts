import { Schema, model, Document } from 'mongoose';
import { IClas } from './clas';

// Document interface
export interface IUser extends Document {
  name: string;
  email: string;
  picture?: string;
  _id: string; //GXXX for google
  classes: IClas[]
}

//populate
//https://stackoverflow.com/questions/16514912/mongoose-schema-for-hierarchical-data-like-a-folder-subfolder-file
// Schema
const userSchema = new Schema<IUser>({
  name: { type: String, required: true },
  email: { type: String, required: true },
  _id: { type: String, required: true },
  picture: String,
  classes: [{
    type: Schema.Types.ObjectId,
    ref: 'Clas'
  }]
});

export const UserModel = model<IUser>('User',userSchema);
