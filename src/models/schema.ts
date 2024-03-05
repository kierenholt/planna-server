import { Schema, Types } from 'mongoose';
import { User } from '../user';
import { Clas as IClas } from '../clas';
import { Topic as ITopic } from '../topic';
import { Lesson as ILesson } from '../lesson';
import { Task as ITask } from '../task';
import { IRow } from '../row';


export const userSchema = new Schema<User>({
    _id: { type: String, required: true, path: 'id' },
    name: { type: String, required: true },
    email: { type: String, required: true },
    picture: { type: String, required: false },
}, { autoCreate: false });

//parent = user
export const clasSchema = new Schema<IClas>({
    name: { type: String, required: true },
    settings: { type: String, default: '' },
    owner: { type: String, required: true }, //owner id is a string
}, { autoCreate: false });    

//parent = clas
export const topicSchema = new Schema<ITopic>({
    name: { type: String, required: true },
    clas: { type: Types.ObjectId, required: true }, //0 for library
    isPublicShared: { type: Boolean, required: true, default: false },
    sequence: { type: Number, required: true, default: 0 }
}, { autoCreate: false });        

//parent = topic
export const lessonSchema = new Schema<ILesson>({
    name: { type: String, required: true },
    topic: { type: Types.ObjectId, required: true }, //0 for library
//    rows: [{ type: Types.ObjectId, default: []}], //https://stackoverflow.com/questions/16514912/mongoose-schema-for-hierarchical-data-like-a-folder-subfolder-file
    rows: [{ type: Types.ObjectId, ref: 'Row', default: []}], //https://stackoverflow.com/questions/16514912/mongoose-schema-for-hierarchical-data-like-a-folder-subfolder-file
}, { autoCreate: false });  
//refs are separate top level documents https://mongoosejs.com/docs/subdocs.html

//parent = topic
export const taskSchema = new Schema<ITask>({
    name: { type: String, required: true },
    topic: { type: Types.ObjectId, required: true }, //0 for library
}, { autoCreate: false });    

//parent = lesson
export const rowSchema = new Schema<IRow>({
    title: { type: String, required: false },
    leftRight: { type: [String], required: true },
    comment: { type: String, required: false },
    purpose: { type: String, required: true }
}, { autoCreate: false });
