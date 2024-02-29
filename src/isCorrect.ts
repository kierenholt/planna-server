import { Helpers } from "./helpers";

const ALLOWABLE_ERROR_FOR_CORRECT_ANSWER = 0.05;

export class CheckResponse {
    //values come from JSONToViewable as *strings*
    static isCorrect(response: string, correctAnswer: string) {
        //numbers
        if (Helpers.isNumeric(correctAnswer)) {

            let responseAsNum = Number(response);
            let correctAnswerAsNum = Number(correctAnswer);
            //integers
            if (correctAnswerAsNum%1 == 0 && Math.abs(correctAnswerAsNum) < 1000 && correctAnswer.indexOf(".") == -1) {
                return this.isCorrectExact(responseAsNum,correctAnswerAsNum);
            }
            else {
                return this.isCorrectWithin5Percent(responseAsNum, correctAnswerAsNum);
            }
        }
        //strings
        else {
            return this.isCorrectString(response, correctAnswer);
        }
    }

    static isCorrectWithin5Percent(value: number, correctAnswer: number) {
        return Math.abs(value-correctAnswer) <= Math.abs(ALLOWABLE_ERROR_FOR_CORRECT_ANSWER*correctAnswer);
    }

    static isCorrectString(value: string, correctAnswer: string) {
        let stripped1 = correctAnswer.toLowerCase();
        let stripped2 = value.toLowerCase();
        return stripped1 == stripped2;
    }

    //numerics only
    static isCorrectExact(value: number, correctAnswer: number) {
        return value == correctAnswer;
    }
}
