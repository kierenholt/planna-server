import mongoose, { Types } from "mongoose";
import { TopicModel as TopicModel } from "./models/schema";
import { Lesson, Topic } from "./models/interfaces";

export class TopicContext {
    static async getTopicsOfClass(id: Types.ObjectId) {
        let mongoClient = await mongoose.connect(process.env.DB_URI as string);
        return await TopicModel
            .find({ clas: id })
            .exec();
    }

    static async getTopics(fields?: string | string[]) {
        let mongoClient = await mongoose.connect(process.env.DB_URI as string);
        if (Array.isArray(fields)) fields = fields.join(" ");
        if (fields) {
            return await TopicModel
                .find({}, fields)
                .exec();
        }
        else {
            return await TopicModel
                .find({})
                .exec();
        }
    }

    static async createTopics(topics: Topic[], isPublicShared?: boolean) {
        let mongoClient = await mongoose.connect(process.env.DB_URI as string);
        return await TopicModel
            .create(topics.map(function (t) {
                return {
                    clas: t.clas?._id ?? "000000000000000000000000",
                    isPublicShared: t.isPublicShared ?? isPublicShared,
                    lessons: t.lessons,
                    name: t.name,
                }
            }));
    }

    static async updateLessonsOfTopic(TopicId: Types.ObjectId, lessons: Lesson[]) {
        let mongoClient = await mongoose.connect(process.env.DB_URI as string);
        return await TopicModel
            .findByIdAndUpdate(TopicId, {
                lessons: lessons
            });
    }

    static async deleteTopic(TopicId: Types.ObjectId) {
        let mongoClient = await mongoose.connect(process.env.DB_URI as string);
        return await TopicModel
            .findByIdAndDelete(TopicId);
    }

    static async createNewTopicInClas(name: string, clasId: Types.ObjectId) {
        let mongoClient = await mongoose.connect(process.env.DB_URI as string);
        return await TopicModel
            .create({
                clas: clasId,
                isPublicShared: false,
                lessons: [],
                name: name,
            });
    }
}