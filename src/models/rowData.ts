import { Schema, model, Document } from 'mongoose';

// Document interface
export interface RowData extends Document {
    comment: string;
    title: string;
    purpose: string;
    leftRight: string[];
}

//populate
//https://stackoverflow.com/questions/16514912/mongoose-schema-for-hierarchical-data-like-a-folder-subfolder-file
// Schema
export const rowDataSchema = new Schema<RowData>({
  title: { type: String, required: true },
  leftRight: { type: [String], required: true },
  comment: { type: String, required: false },
  purpose: { type: String, required: true },
});

export const RowDataModel = model<RowData>('RowData', rowDataSchema);
