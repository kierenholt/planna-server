import { Schema, model, Document } from 'mongoose';
import { RowData, rowDataSchema } from './rowData';


interface AssignedNoteData {
    courseUrl: string;
    lessonUrl: string;
    markbookUrl: string;
    assignedDate: Date;
    lessonId: string;
}

const assignedNoteDataSchema = new Schema<AssignedNoteData>({
    courseUrl: { type: String, required: true },
    lessonUrl: { type: String, required: true },
    markbookUrl: { type: String, required: true },
    assignedDate: { type: Date, required: true },
    lessonId: { type: String, required: true },
});

interface LessonData {
    rows: RowData[];
    name: string;
    assignedNotes: AssignedNoteData[];
}

const lessonDataSchema = new Schema<LessonData>({
    rows: { type: [rowDataSchema], required: true },
    name: { type: String, required: true },
    assignedNotes: { type: [assignedNoteDataSchema], required: false },
});
  
export interface TopicData {
    lessons: LessonData[];
    name: string;
}

export const topicDataSchema = new Schema<TopicData>({
    lessons: { type: [lessonDataSchema], required: true },
    name: { type: String, required: true },
});

//NO MODEL SINCE STORED INSIDE CLAS