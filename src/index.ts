import { UserContext } from './userContext';
import express, { NextFunction, Request, Response } from "express";
import { config } from 'dotenv';
import { ClasContext } from './clasContext';
import { Types } from 'mongoose';
var cors =  require('cors');

config();
let app = express();
app.use(cors());
app.use(express.json())

//GET to read, POST to create, PUT to update, DELETE to delete
//https://nordicapis.com/10-best-practices-for-naming-api-endpoints/
//https://www.scaler.com/topics/expressjs-tutorial/express-query-params/

//get or create user
app.post('/v1/users', async (req: Request, res: Response, next: NextFunction) => {
    try {
        let createdUser = await UserContext.createUserIfNotExists(req.body.email, req.body.picture, req.body.name, req.body.id);
        res.json(createdUser);
    }
    catch (e) {
        next(e);
    }
});

//create class
app.post('/v1/classes', async (req: Request, res: Response, next: NextFunction) => {
    try {
        let createdClasId = await ClasContext.createClass(req.body.name, req.body.ownerId);
        res.json(createdClasId);
    }
    catch (e) {
        next(e);
    }
});

//get classes of user
app.get('/v1/users/:id/classes', async (req: Request, res: Response, next: NextFunction) => {
    try {
        let classes = await ClasContext.getClassNamesOfUser(req.params.id);
        res.json(classes);
    }
    catch (e) {
        next(e);
    }
});


//delete class
app.delete('/v1/classes/:id', async (req: Request, res: Response, next: NextFunction) => {
    try {
        let classes = await ClasContext.deleteClass(new Types.ObjectId(req.params.id), req.body.ownerId);
        res.json(classes);
    }
    catch (e) {
        next(e);
    }
});

//rename class
app.put('/v1/classes/:id', async (req: Request, res: Response, next: NextFunction) => {
    try {
        let classes = await ClasContext.renameClass(new Types.ObjectId(req.params.id), req.body.name);
        res.json(classes);
    }
    catch (e) {
        next(e);
    }
});

//topics of class
app.get('/v1/classes/:id/topics', async (req: Request, res: Response, next: NextFunction) => {
    try {
        let topics = await ClasContext.getTopicsOfClass(new Types.ObjectId(req.params.id));
        res.json(topics);
    }
    catch (e) {
        next(e);
    }
});

app.listen(process.env.PORT, () => {console.log("listening on port  " + process.env.PORT)});
app.on("close",() => console.log("closing"))
