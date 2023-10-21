import { Types } from "mongoose";

export interface IUser extends Document {
    _id: string; //GXXX for google
    name: string;
    email: string;
    picture?: string;
  }

export interface IClas extends Document {
    _id: string;
    name: string;
    topics: TopicData[];
    settings: string;
    owner: IUser;
  }

//no model
export interface AssignedNoteData {
    courseUrl: string;
    lessonUrl: string;
    markbookUrl: string;
    assignedDate: Date;
    lessonId: string;
}

//no model
export interface LessonData {
    rows: RowData[];
    name: string;
    assignedNotes: AssignedNoteData[];
}

//no model
export interface TopicData {
    lessons: LessonData[];
    name: string;
}


export interface RowData extends Document {
    _id: string;
    comment: string;
    title: string;
    purpose: string;
    leftRight: string[];
}

  