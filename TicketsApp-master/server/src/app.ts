import express from "express";
import morgan from "morgan";
import mongoose from "mongoose";
import bodyParser from "body-parser";
import path from "path";
import cors from "cors";
// @ts-ignore
import helmet from "helmet";
import session from "express-session";
import passport from "passport";
import {addLocalStrategy} from "./passport-config/passport";

mongoose.Promise = global.Promise;
const app = express()
const url = process.env.MONGODB_URI || "mongodb://127.0.0.1:27017"

app.use(cors());
app.use(morgan('combined'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended : false}));
app.use(helmet());
app.use(express.static(path.join(__dirname, 'public')));
app.use(session({secret: 'my-secret-word', cookie: {maxAge: 60000}, resave:false, saveUninitialized: false}));
app.use(passport.initialize());
addLocalStrategy();


/** connect to MongoDB datastore */
try {
    // mongoose.set('debug', true)
    mongoose.connect(url, {
        useNewUrlParser: true,
        useUnifiedTopology: true,
        //useMongoClient: true
    });
} catch (error) {
    console.log("error with connecting to database")
}

/** authentication */
// require('./repository/Users')
// require('./passport-config/passport');
// app.use(require('./controller'));
app.use(require('./controller'));

let port = 5000 || process.env.PORT

/** set up controller {API Endpoints} */
//controller(router) //////////////////////

/** set up middlewares */
// app.use(cors());
// app.use(morgan('combined'));
// app.use(bodyParser.json());
// app.use(bodyParser.urlencoded({extended : false}));
// app.use(helmet());
// app.use(express.static(path.join(__dirname, 'public')));
// app.use(session({secret: 'my-secret-word', cookie: {maxAge: 60000}, resave:false, saveUninitialized: false}));

app.use('/static', express.static('uploads'))

//app.use('/', router) /////////////

/** start server */
app.listen(port, () => {
    console.log(`Server started at port: ${port}`);
});
