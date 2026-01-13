import express from "express";
import connectToDb from "./database/db.js";
import session from 'express-session';
import user from "./routes/user.js";
import admin from "./routes/admin.js";
import dotenv from "dotenv";

dotenv.config();
const app = express();

app.set('view engine', 'ejs');
app.use(express.static('public'));
app.use(express.urlencoded({ extended: false }));

app.use(session({
    secret: process.env.SESSION_SECRET || 'Secret-Key',
    resave: false,
    saveUninitialized: true,
    cookie: {
        secure: false,
        maxAge: 1000 * 60 * 30
    }
}));


connectToDb();

app.use('/user', (req, res, next) => {
    res.locals.user = req.session.user || null;
    next();
});

app.use('/admin', (req, res, next) => {
    res.locals.admin = req.session.admin || null;
    next();
});


app.use((req, res, next) => {
    res.set('Cache-Control', 'no-store, no-cache, must-revalidate, private');
    next();
});

app.use('/user', user);
app.use('/admin', admin);

const PORT = process.env.PORT || 3000;

app.listen(PORT, () => {
    console.log("server is running on port 3000");
});