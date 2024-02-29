import { IExpression, QuestionExpression, TemplateExpression } from "./expression";
import { CheckResponse as Check } from "./isCorrect";
import { app } from ".";
import { NextFunction, Request, Response } from "express";
import mongoose, { Model } from "mongoose";
import { rowSchema } from "./models/schema";


export interface IRow extends Document {
    comment: string;
    title: string;
    purpose: string;
    leftRight: string[];
}

export interface ResponseCheckResult {
    isCorrect: Boolean;
    error: boolean,
    errorMessage: string
}

//check response
export class RowColl {
    static model: Model<any> = mongoose.model("Row", rowSchema);
    static DEFAULT_ROW_ID = "65441f653bfbf117153c2316";

    static initAPI() {
        
        // get rows of lesson - already covered in lesson

        //RESPONSES 
        app.post('/v1/responses',  async (req: Request, res: Response, next: NextFunction) => {
            try {
                let result: ResponseCheckResult = await RowColl.responseCheck(req.body.index, req.body.rowId, req.body.response, req.body.seed, req.body.userId);
                res.json(result);
            }
            catch (e) {
                next(e);
            }
        });
    }

    static async responseCheck(index: number, rowId: string, response: string, seed?: number, userId: string = ""): Promise<ResponseCheckResult> {
        //get row
        let row: any = await RowColl.model.findById(rowId);
        
        if (row == null) return {            
            isCorrect: false,
            error: true,
            errorMessage: "row id not found"
        }

        let expressions: IExpression[] = [];
        if (row.purpose == "question") {    
            expressions = QuestionExpression.fromComment(row.comment);
        }
        else if (row.purpose == "template") {
            expressions = TemplateExpression.fromComment(row.comment, seed);
        }
        else return {
            isCorrect: false,
            error: true,
            errorMessage: "unsupported question type (purpose must be queston or template)"
        }
        
        let answer = expressions[index].value;
        return { 
            isCorrect: Check.isCorrect(response, answer.toString()),
            error: false,
            errorMessage: ""
        }
    }
}