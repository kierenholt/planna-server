import { Schema, Types, model } from 'mongoose';
import { AssignedNote, Clas, User, Lesson, Row, Topic } from './interfaces';

export const rowSchema = new Schema<Row>({
    title: { type: String, required: false },
    leftRight: { type: [String], required: true },
    comment: { type: String, required: false },
    purpose: { type: String, required: true },
});

export const RowModel = model<Row>('Row', rowSchema);

const assignedNoteSchema = new Schema<AssignedNote>({
    courseUrl: { type: String, required: true },
    lessonUrl: { type: String, required: true },
    markbookUrl: { type: String, required: true },
    assignedDate: { type: Date, required: true },
    lessonId: { type: String, required: true },
});

const lessonSchema = new Schema<Lesson>({
    rows: { type: [rowSchema], required: true },
    name: { type: String, required: true },
    assignedNotes: { type: [assignedNoteSchema], required: false },
});

const topicSchema = new Schema<Topic>({
    lessons: { type: [lessonSchema], required: true },
    name: { type: String, required: true },
    clas: { type: Types.ObjectId, required: true }, //0 for library
    isPublicShared: { type: Boolean, required: true, default: false },
});

export const TopicModel = model<Topic>('Topic', topicSchema);

const clasSchema = new Schema<Clas>({
    name: { type: String, required: true },
    settings: { type: String, default: '' },
    owner: { type: String, required: true }, //owner id is a string
});

export const ClasModel = model<Clas>('Clas', clasSchema);

const userSchema = new Schema<User>({
    name: { type: String, required: true },
    email: { type: String, required: true },
    _id: { type: String, required: true },
    picture: { type: String, required: false },
});

export const UserModel = model<User>('User', userSchema);
