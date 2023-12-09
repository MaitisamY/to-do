import express from "express";
import session from "express-session";
import keygen from "../util/keygen.js";

const router = express.Router();
const SECRET = keygen; // Randomly generated secret key

router.use(session({
    secret: SECRET, 
    resave: false,
    saveUninitialized: true,
    cookie: {
        maxAge: 30 * 24 * 60 * 60 * 1000, // 30 days in milliseconds
    },
}));

router.use((req, res, next) => {
    res.header("Cache-Control", "no-cache, private, no-store, must-revalidate, max-age=0");
    res.header("Pragma", "no-cache");
    res.header("Expires", "0");
    next();
});

export default router;