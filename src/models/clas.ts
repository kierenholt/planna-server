import { Schema, model, Document } from 'mongoose';
import { TopicData, topicDataSchema } from './sow';

// Document interface
export interface IClas extends Document {
  name: string;
  topics: TopicData[];
  settings: string;
}

// Schema
const clasSchema = new Schema<IClas>({
  name: { type: String, required: true },
  topics: { type: [topicDataSchema], required: true },
  settings: { type: String, required: true },
});

export const ClasModel = model<IClas>('Clas',clasSchema);