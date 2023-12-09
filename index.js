import express from "express";
import setSession from "./middleware/set-session.js";
import checkSession from "./middleware/check-session.js";
import bodyParser from "body-parser";
import dotenv from 'dotenv';
import login from "./routes/login.js";
import logout from "./routes/logout.js";
import home from "./routes/home.js";
import profile from "./routes/profile.js";
import previousTasks from "./routes/previous-tasks.js";
import calendar from "./routes/calendar.js";
import createTask from "./routes/action/create-task.js";
import homeActions from "./routes/action/home-actions.js";
import previousTaskActions from "./routes/action/previous-tasks-actions.js";
import profileActions from "./routes/action/profile-actions.js";
import createCategory from "./routes/action/create-category.js";
import deleteCategory from "./routes/action/delete-category.js";


const app = express();
const port = 3000;
dotenv.config();

// const newTime = new Intl.DateTimeFormat('en-GB', { timeStyle: 'short', hour12: true }).format(newDate);
// const date = newTime + " - " + today;

app.use(express.static("public"));
app.use(bodyParser.urlencoded({ extended: true }));
app.set("view engine", "ejs");

app.use(setSession);

app.use(checkSession);

// Root route
app.use('/', login);


// Logout route
app.use('/', logout);


// Home route
app.use('/', home);


// Profile route
app.use('/', profile);


// Previous tasks route
app.use('/', previousTasks);


// Calendar route
app.use('/', calendar);

// Action routes below 

// Create category route
app.use('/', createCategory);


// Delete category route
app.use('/', deleteCategory);

// Create new task route````````````````
app.use('/', createTask);


// Home actions route (CRUD operations)
app.use('/', homeActions);


// Previous tasks actions route (CRUD operations)
app.use('/', previousTaskActions);


// Profile actions route (CRUD operations)
app.use('/', profileActions);


app.listen(port, () => {
    console.log(`Listening at: ${port}`);
});
