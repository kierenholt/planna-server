import { UserContext } from './userContext';
import express, { NextFunction, Request, Response } from "express";
import { config } from 'dotenv';
import { ClasContext } from './clasContext';
import { Types } from 'mongoose';
import { TopicContext } from './topicContext';
var cors =  require('cors');

config();
let app = express();
app.use(cors());
app.use(express.json({ limit: '50mb' }));


//GET to read, POST to create, PUT to update, DELETE to delete
//https://nordicapis.com/10-best-practices-for-naming-api-endpoints/
//https://www.scaler.com/topics/expressjs-tutorial/express-query-params/

//1 create user
app.post('/v1/users', async (req: Request, res: Response, next: NextFunction) => {
    try {
        let createdUser = await UserContext.createUserIfNotExists(req.body.email, req.body.picture, req.body.name, req.body.id);
        res.json(createdUser);
    }
    catch (e) {
        next(e);
    }
});

//2 create class
app.post('/v1/classes', async (req: Request, res: Response, next: NextFunction) => {
    try {
        let createdClasId = await ClasContext.createClass(req.body.name, req.body.ownerId);
        res.json(createdClasId);
    }
    catch (e) {
        next(e);
    }
});

//3 get classes of user
app.get('/v1/users/:id/classes', async (req: Request, res: Response, next: NextFunction) => {
    try {
        let classes = await ClasContext.getClassesOfUser(req.params.id, req.query.fields as string | string[] | undefined);
        res.json(classes);
    }
    catch (e) {
        next(e);
    }
});


//4 delete class
app.delete('/v1/classes/:id', async (req: Request, res: Response, next: NextFunction) => {
    try {
        let classes = await ClasContext.deleteClass(new Types.ObjectId(req.params.id), req.body.ownerId);
        res.json(classes);
    }
    catch (e) {
        next(e);
    }
});

//5 rename class
app.put('/v1/classes/:id', async (req: Request, res: Response, next: NextFunction) => {
    try {
        let classes = await ClasContext.renameClass(new Types.ObjectId(req.params.id), req.body.name);
        res.json(classes);
    }
    catch (e) {
        next(e);
    }
});

//6 get topics of class // 0 for library
app.get('/v1/classes/:id/topics', async (req: Request, res: Response, next: NextFunction) => {
    try {
        let classes = await TopicContext.getTopicsOfClass(new Types.ObjectId(req.params.id));
        res.json(classes);
    }
    catch (e) {
        next(e);
    }
});


//7 create library topics 
app.post('/v1/topics', async (req: Request, res: Response, next: NextFunction) => {
    try {
        if (req.body[0]?.isPublicShared == undefined && req.query.isPublicShared == undefined) throw("please specify isPublicShared in body or params");
        let classes = await TopicContext.createTopics(req.body, req.query.isPublicShared ? JSON.parse(req.query.isPublicShared as string) as boolean : undefined);
        res.json(classes);
    }
    catch (e) {
        next(e);
    }
});

//8 create new topic in class
app.post('/v1/classes/:id/topics', async (req: Request, res: Response, next: NextFunction) => {
    try {
        let classes = await TopicContext.createNewTopicInClas(req.body.name, new Types.ObjectId(req.params.id));
        res.json(classes);
    }
    catch (e) {
        next(e);
    }
});


app.listen(process.env.PORT, () => {console.log("listening on port  " + process.env.PORT)});
app.on("close",() => console.log("closing"))