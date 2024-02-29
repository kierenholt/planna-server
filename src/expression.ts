import { Helpers, KRandom } from "./helpers";

interface TemplateExpressionResult {
    s: string,
    i: number
}

export interface IExpression {
    value: string;
}

export class QuestionExpression implements IExpression {
    value: string;
    index: number;
    constructor(value: string, index: number) {
        this.value = value;
        this.index = index;
    }

    static fromComment(comment: string) {
        let spl = comment.split("\n");
        let expressions: QuestionExpression[] = [];
        expressions.push(...spl.map((s,i) => new QuestionExpression(s,i)));
        return expressions;
    }
}

export class TemplateExpression implements IExpression {
    _value: string = "";
    str: string;
    index: number;
    expressions: TemplateExpression[];
    random: KRandom;
    constructor(str: string, index: number, expressions: TemplateExpression[], seed: number = 0) {
        this.str = str;
        this.index = index;
        this.expressions = expressions;
        this.random = new KRandom(seed);
    }

    static fromComment(comment: string, seed: number = 0) {
        let spl = comment.split("\n");
        let expressions: TemplateExpression[] = [];
        expressions.push(...spl.map((s,i) => new TemplateExpression(s,i,expressions, seed)));
        return expressions;
    }

    calculate(i: number = 0, pending: string = "", insideFunction: boolean = false): TemplateExpressionResult {
        if (i >= this.str.length) {
            return {i: i, s: eval(pending)};
        }
        if (this.str[i] == `"`) {
            return this.insideQuote(i+1); //start with a char, not a quote
        }
        if (this.str[i] == ",") {
            if (insideFunction) return {i: i, s: eval(pending)}; //do not change to i+1
            return this.insideChooseRandom(i, [eval(pending)]);
        }
        if (this.str[i] == ")") {
            if (insideFunction) return {i: i, s: eval(pending)}; //do not change to i+1
            return {i: i, s: eval(pending)}; //do not change to i+1
        }
        if (Helpers.isLowerAlpha(this.str[i])) {
            //two letters i.e. function
            if (i + 1 < this.str.length && Helpers.isLowerAlpha(this.str[i+1])) {
                let result: TemplateExpressionResult = this.insideFunction1(i);
                return this.calculate(result.i, pending+result.s, insideFunction);
            }
            //one letter i.e variable
            return this.calculate(i+1, pending+this.expressions[Helpers.alphaIndex(this.str[i])].value, insideFunction);
        }
        if (i + 1 < this.str.length && this.str[i] == "." && this.str[i+1] == ".") {
            return this.insideRange(i+2, eval(pending));
        }
        return this.calculate(i+1, pending+this.str[i], insideFunction);
    }

    insideRange(i: number, min: number, pending2: string = ""): TemplateExpressionResult {
        if (i >= this.str.length || !isDigitOrDot(this.str[i])) {
            let max = Number.parseInt(pending2);
            return {i: i+1, s: this.random.getRandomInt(min, max).toString()};
        }
        return this.insideRange(i+1, min, pending2 + this.str[i]);
    }

    insideFunction1(i: number, pending: string = ""): TemplateExpressionResult {
        if (i >= this.str.length) throw ("function syntax error");
        if (this.str[i] == "(") {
            return this.insideFunction2(i, pending);
        }
        return this.insideFunction1(i+1, pending+this.str[i]);
    }
    
    insideFunction2(i: number, name: string, arguments2: string[] = [], pending: string = ""): TemplateExpressionResult {
        if (i >= this.str.length) throw (`function syntax error at line ${this.index} char ${i}`);
        if (this.str[i] == ")") {
            let result = this.callFunction(name,[...arguments2]);
            return { i: i+1, s: result };
        }
        if (this.str[i] == "(" || this.str[i] == ",") {
            let result: TemplateExpressionResult = this.calculate(i+1, "", true);
            return this.insideFunction2(result.i, name, [...arguments2, result.s]);
        }
        throw("should not happen");
    }

    insideChooseRandom(i: number, arguments2: string[] = []): TemplateExpressionResult {
        if (i >= this.str.length || this.str[i] == ")") {
            return { i: i+1, s: this.random.getRandomMember(arguments2) };
        }
        if (this.str[i] == ",") {
            let result: TemplateExpressionResult = this.calculate(i+1, "", false);
            return this.insideChooseRandom(result.i, [...arguments2, result.s]);
        }
        // comma
        throw("should not happen");
    }

    insideQuote(i: number, pending: string = ""): TemplateExpressionResult {
        if (i >= this.str.length) throw (`quote syntax error at line ${this.index} char ${i}`);
        if (this.str[i] == `"`) {
            return {i: i+1, s: pending} 
        }
        return this.insideQuote(i+1, pending + this.str[i]);
    }

    get value(): string {
        if (this._value) return this._value;
        this._value = this.calculate().s;
        return this._value;
    }
    
    callFunction(name: string, args: any[]): any {
        if (name == "add") return Number.parseFloat(args[0]) +  Number.parseFloat(args[1]);
        if (name == "if") return (args: any[]) => (args[0] || args[0] == "true") ? args[1] : args[2];

        if (name ==  "exponent") {
            let asExponent = args[0].toExponential();
            let Eindex = asExponent.indexOf('e');
            return JSON.stringify(asExponent.substr(Eindex + 1));
        }

        if (name ==  "mantissa") {
            let asExponent = args[0].toExponential();
            let Eindex = asExponent.indexOf('e');
            return JSON.stringify(asExponent.substr(0,Eindex));
        }

        if (name == "tostandardform") {
            let ret = args[0];
            return JSON.stringify(ret.toExponential().replace("e"," x 10^").replace("+",""));
        }

        //RETURNS BOOLEAN
        if (name ==  "includes") {
            var ret = args[0].toString().includes(args[1]);
            return JSON.stringify(ret);
        }

        if (name == "maxlength") {
            //if string
            if (args[0][0] == '"') {
                return `"${args[0].substr(1, args[1])}"`;
            } 
            let ret = args[0].toString().substr(0, args[1]);
            return JSON.stringify(ret)
        }
        
        //RETURNS STRING
        if (name == "padleftzeroes") {
            let ret = args[0].toString().padStart(args[1], '0');
            return JSON.stringify(ret)                
        }
        
        //RETURNS STRING
        if (name == "padrightzeroes") {
            let str = args[0].toString();
            if (!str.includes('.'))
                str += '.';
            let ret = str.padEnd(args[1], '0');
            return JSON.stringify(ret);
        }

        if (name == "getdigit") {
            let n = args[0];
            let ret = getDigits(n)[args[1]-1];
            return JSON.stringify(ret);
        }

        if (name == "dayname") {
            let year = args[0];
            let month = args[1];
            let date = args[2];
            let today = new Date(year,month-1,date);
            let ret = ["Sunday","Monday","Tuesday","Wednesday","Thursday","Friday","Saturday"][today.getDay()];
            return JSON.stringify(ret);
        }

        if (name == "dayofyear") {
            let year = args[0];
            let month = args[1];
            let date = args[2];
            let firstOfYear = new Date(year,0,1);
            let today = new Date(year,month-1,date);
            let ret = Math.round((today.valueOf() - firstOfYear.valueOf())/8.64e7+1);
            return JSON.stringify(ret);
        }

        if (name == "abs") {
            let ret = Math.abs(args[0]);
            return JSON.stringify(ret);
        }

        if (name == "mean" || name == "average") {
            let sum = args.reduce(function(acc, val) { return acc + val; });
            let ret =  sum/args.length;
            return JSON.stringify(ret);
        }

        if (name == "median") {
            args.sort();
            let l = args.length;
            let ret = null;
            if (l%2 == 0) {
                ret = 0.5*(args[l/2-1] + args[l/2]);
            }
            else {
                ret = args[(l-1)/2];
            }
            return JSON.stringify(ret);
        }

        if (name == "lowerquartile") {
            args.sort();
            let l = args.length;
            let ret = null;
            if (l%4 == 0) {
                ret = 0.5*(args[l/4-1] + args[l/4]);
            }
            else {
                ret = args[Math.floor(l/4)];
            }
            return JSON.stringify(ret);
        }

        if (name == "upperquartile") {
            args.sort();
            let l = args.length;
            let ret = null;
            if (l%4 == 0) {
                ret = 0.5*(args[3*l/4-1] + args[3*l/4]);
            }
            else {
                ret = args[Math.floor(3*l/4)];
            }
            return JSON.stringify(ret);
        }

        if (name == "mode") {
            let freqs: any = {};
            for (n of args) {
                if (n in freqs) {
                freqs[n] += 1
                }
                else {
                freqs[n] = 1
                }
            }
            let bestF = 0;
            let best = -1;
            let ret = null;
            for (var f in freqs) {
                if (freqs[f] > bestF) {
                bestF = freqs[f];
                ret  = f;
                }
            }
            return JSON.stringify(ret);
        }

        if (name == "max") {
            let best = args[0];
            for (var i = 1; i < args.length; i++) {
                if (args[i] > best) {
                best = args[i]
                }
            }
            return JSON.stringify(best);
        }

        if (name == "min") {
            let best = args[0];
            for (var i = 1; i < args.length; i++) {
                if (args[i] < best) {
                best = args[i]
                }
            }
            return JSON.stringify(best);
        }

        if (name == "hcf") {
            let ret = hcfMulti(args);
            return JSON.stringify(ret);
        }

        if (name == "coprime") {
            let denom = args[0];
            let guess = this.random.next(denom-1) + 1;
            while (HCF(denom, guess) > 1) {
                guess = this.random.next(denom-1) + 1;
            }
            return JSON.stringify(guess);
        }

        if (name == "roundtodp") {
            let mult = Math.pow(10,args[1]);
            let result = Math.round(args[0]*mult)/mult;
            return JSON.stringify(result);
        }

        if (name == "roundtosf") {
            var n = args[0];
            var d = args[1];
            ret = roundToSF(n,d);
            return JSON.stringify(ret);
        }

        if (name == "factorial") {
            let ret = factorial(args[0]);
            return JSON.stringify(ret);
        }

        if (name == "includesign") {
            let sign = args[0] < 0 ? "-" : "+";
            let ret =  `${sign} ${Math.abs(args[0]).toString()}`;
            return JSON.stringify(ret);
        }

        if (name == "includeoppsign") {
            let sign = args[0] < 0 ? "+ " : "- ";
            let ret =`${sign} ${Math.abs(args[0]).toString()}`;
            return JSON.stringify(ret);
        }

        if (name == "sind") {
            let ret = Math.sin(args[0]/180*Math.PI);
            return JSON.stringify(ret);
        }

        if (name == "cosd") {
            let ret =Math.cos(args[0]/180*Math.PI);
            return JSON.stringify(ret);
        }

        if (name == "tand") {
            let ret = Math.tan(args[0]/180*Math.PI);
            return JSON.stringify(ret);
        }

        if (name == "asind") {
            let ret = (180*Math.asin(args[0])/Math.PI);
            return JSON.stringify(ret);
        }

        if (name == "acosd") {
            let ret = (180*Math.acos(args[0])/Math.PI);
            return JSON.stringify(ret);
        }

        if (name == "atand") {
            let ret = 0;
            //if one parameter is specified, return normal arctan
            if (args.length == 1) {
                ret = (180*Math.atan(args[0])/Math.PI);
            }
            //if two parameters x y are specified, return a bearing 0 - 360
            if (args.length == 2) {
                ret = (180*Math.atan(args[0]/args[1])/Math.PI);//-90 to 90
                //x y
                //+ + 0-90
                //+ - 90-180
                //- - 180-270
                //- + 270-360
                let xIsPos = args[0] > 0;
                let yIsPos = args[1] > 0;
                if (xIsPos) { ret += yIsPos ? 0 : 180; }
                else { ret += yIsPos ? 360 : 180 }
            }
            return JSON.stringify(ret);      
        }

        if (name == "choose") {
            var index = args[0];
            let ret = args[index+1];
            return JSON.stringify(ret);
        }

        if (name == "countif") {
            var target = args[0];
            let ret = args.slice(1).filter(e => e == target).length;
            return JSON.stringify(ret);
        }

        if (name == "large") {
            var l = args.length;
            var index2 = l - args[0];
            let ret = args.slice(1).sort()[index2];
            return JSON.stringify(ret);
        }
        
        if (name == "normalcdf") {
            var X = args[0];
            var T=1/(1+.2316419*Math.abs(X));
            var D=.3989423*Math.exp(-X*X/2);
            var Prob=D*T*(.3193815+T*(-.3565638+T*(1.781478+T*(-1.821256+T*1.330274))));
            if (X>0) {
                Prob=1-Prob
            }
            return JSON.stringify(Prob);
        }

        if (name == "binomial") {
            let x = args[0];
            let N = args[1];
            let p = args[2];

            let ret = binomial(x,N,p);
            return JSON.stringify(ret);
        }

        if (name == "binomialcdf") {
            let x = args[0];
            let N = args[1];
            let p = args[2];
            
            let ret = 0;
            for (let i = 0; i <= x; i++) {
                ret += binomial(i,N,p);
            }
            return JSON.stringify(ret);
        }

        if (name == "sgn") {
            let ret = 0;
            if (args[0] < 0) { ret = -1; }
            if (args[0] > 0) { ret = 1; }
            return JSON.stringify(ret);
        }
        
        if (name == "lcm") {
            let ret = lcm(args);
            return JSON.stringify(ret);
        }

        /*
        if (name == "compareobjects") {
            let ret = compareobjects(args[0],args[1]);
            return JSON.stringify(ret);
        }
        
        CALL CUSTOM CODE FUNCTION 
        if (injector.allVariablesAndFunctions[name] instanceof JSFunction) {
            //try to interpret parameters as being inputted as JSON
            let parametersAsJSON = args.map(p => JSON.stringify(p));
            return injector.allVariablesAndFunctions[name].execute(parametersAsJSON); //already in JSON
        }*/
    } 
}



function getDigits(n: number): number[] {
    if (n < 10) {
        return [n];
    }
    return getDigits(Math.floor(n/10)).concat([n%10])
}

function HCF(a: number,b: number): number {
    if (a <= 0 || b <= 0) {
        return 0;
    }
    if (a < b) {
        return HCF(b,a);
    }
    if (a%b == 0) {
        return b;
    }
    return HCF(b, a%b);
}

function hcfMulti(args: any): number {
    var ret = args.splice(-1);
    while (args.length > 0) {
        var arg = args.splice(-1);
        ret = HCF(ret,arg);
    }
    return ret;
}

function lcm(args: any): number {
    var ret = args.splice(-1);
    while (args.length > 0) {
        var arg = args.splice(-1);
        ret = ret *  arg / HCF(ret,arg);
    }
    return ret;
}

function factorial(n: number): number {
    if (n < 2) {
        return 1;
    }
    return n * factorial(n - 1);
};

function binomial(x: number,N: number,p: number): number {
    return factorial(N)/factorial(N-x)/factorial(x)*Math.pow(p,x)*Math.pow(1-p,N-x);
}

function roundToSF(n: number,d: number): number {
    if (n==0) {return n};
    var biggestTen = Math.floor(Math.log(Math.abs(n))/Math.LN10)+1;
    return Math.round(n*Math.pow(10,d-biggestTen))/Math.pow(10,d-biggestTen);
} 

function isDigitOrDot(s: string) {
    return s == "." || (s.charCodeAt(0) >= 48 && s.charCodeAt(0) <= 57);
}


/*
console.log("test");
let comment = `add(b,4)
1..5`;

    let e: Expression[] = Expression.fromComment(comment, 1);
    console.log(e.map(x => x.value).join(","))*/