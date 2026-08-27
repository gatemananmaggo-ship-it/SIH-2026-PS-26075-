// External module
require("dotenv").config();

const express = require("express");
const cors = require("cors");
const session = require("express-session");
const MongoStore = require("connect-mongo").default;


// core
const path = require('path')

// Local Module
const authrouter = require('./routes/auth.routes')

// Creating app
const app = express();

// Adding request body parser
app.use(express.urlencoded());


// MiddleWare
app.use(express.json());

app.use(
    cors({
        origin: "http://localhost:5173",
        credentials: true
    })
);

// Session configuration
app.use(
    session({
        secret: process.env.SESSION_SECRET,
        resave: false,
        saveUninitialized: false,

        store: MongoStore.create({
            mongoUrl: process.env.MONGO_URI
        }),

        cookie: {
            httpOnly: true,
            secure: false,
            maxAge: 1000 * 60 * 60 * 24
        }
    })
);

app.use("/api/auth", authrouter);

app.get('/',(req,res,next)=>{
    res.send({
        mesage: "capacity connect backend is live"
    })
});

// exporting app 
module.exports = app;