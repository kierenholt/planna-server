import { Schema, model, Document, Types, Mongoose } from 'mongoose';
import { AssignedNoteData, IClas, IUser, LessonData, RowData, TopicData } from './interfaces';

export const rowDataSchema = new Schema<RowData>({
    title: { type: String, required: true },
    leftRight: { type: [String], required: true },
    comment: { type: String, required: false },
    purpose: { type: String, required: true },
});

export const RowDataModel = model<RowData>('RowData', rowDataSchema);

const assignedNoteDataSchema = new Schema<AssignedNoteData>({
    courseUrl: { type: String, required: true },
    lessonUrl: { type: String, required: true },
    markbookUrl: { type: String, required: true },
    assignedDate: { type: Date, required: true },
    lessonId: { type: String, required: true },
});

const lessonDataSchema = new Schema<LessonData>({
    rows: { type: [rowDataSchema], required: true },
    name: { type: String, required: true },
    assignedNotes: { type: [assignedNoteDataSchema], required: false },
});

const topicDataSchema = new Schema<TopicData>({
    lessons: { type: [lessonDataSchema], required: true },
    name: { type: String, required: true },
});

const clasSchema = new Schema<IClas>({
    name: { type: String, required: true },
    topics: { type: [topicDataSchema], required: true },
    settings: { type: String, default: '' },
    owner: { type: String, required: true }, //owner id is a string
});

export const ClasModel = model<IClas>('Clas', clasSchema);

const userSchema = new Schema<IUser>({
    name: { type: String, required: true },
    email: { type: String, required: true },
    _id: { type: String, required: true },
    picture: { type: String, required: false } 
});

export const UserModel = model<IUser>('User', userSchema);
