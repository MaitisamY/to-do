import express from "express";
import session from "express-session";
import bodyParser from "body-parser";
import bcrypt from "bcrypt";
import keygen from "./keygen.js";
import dotenv from 'dotenv';
import db from './db.js';

const app = express();
const port = 3000;
dotenv.config();
const newDate = new Date();
const today = new Intl.DateTimeFormat('en-GB', { dateStyle: 'full' }).format(newDate);
const sessionSecret = keygen();
// const newTime = new Intl.DateTimeFormat('en-GB', { timeStyle: 'short', hour12: true }).format(newDate);
// const date = newTime + " - " + today;

const checkSession = (req, res, next) => {
    if (!req.session.user) {
      // Redirect to login if there is no active session
      res.redirect('/');
    } else {
      next(); // Continue to the next middleware or route handler
    }
};

app.use(express.static("public"));
app.use(bodyParser.urlencoded({ extended: true }));
app.set("view engine", "ejs");

app.use(session({
    secret: sessionSecret, 
    resave: false,
    saveUninitialized: true,
    cookie: {
      maxAge: 30 * 24 * 60 * 60 * 1000, // 30 days in milliseconds
    },
}));

app.use((req, res, next) => {
    res.header("Cache-Control", "no-cache, private, no-store, must-revalidate, max-age=0");
    res.header("Pragma", "no-cache");
    res.header("Expires", "0");
    next();
});

async function getTasksFromDB() {
    const result = await db.query("SELECT * from to_do_list ORDER BY id DESC");
    const tasks = result.rows;
    return tasks;
}

async function getCategories() {
    const result = await db.query("SELECT * from categories ORDER BY id ASC");
    const category = result.rows;
    return category;
}

// Login Page

app.get("/", async (req, res) => {
    res.render("login");
});

// Logout route

app.get('/logout', async (req, res) => {
    try {
      await db.query("DELETE FROM sessions WHERE session_id = $1", [req.sessionID]);

      // Destroying the session
      req.session.destroy((err) => {
        if (err) {
          console.error("Error destroying session:", err);
        } else {
          console.log('User logged out successfully');
        }
        res.redirect('/');
      });
    } catch(err) {
      console.error("Error during logout:", err);
      res.redirect('/');
    }
});

app.get("/", async (req, res) => {
    res.render("login");
});

app.get("/home", checkSession, async (req, res) => {
    const user = req.session.user;
  
    const tasks = await getTasksFromDB();
    const filteredTasks = tasks.filter((task) => task.userid === user.id);

    const categories = await getCategories();
  
    const query = await db.query("SELECT categories.id, categories.category_name, categories.color, to_do_list.category_id from to_do_list JOIN categories ON to_do_list.category_id = categories.id WHERE to_do_list.userid = $1", [user.id]);
    const cats = query.rows;

    res.render("home", {
      taskList: filteredTasks,
      categories: categories,
      relatedCategory: cats
    });
});

app.get("/profile", checkSession, async (req, res) => {
    const user = req.session.user;

    const categories = await getCategories();

    res.render("profile", {
      user: user,
      categories: categories
    });
});

app.get("/previous-tasks", checkSession, async (req, res) => {
    const user = req.session.user;
  
    const categories = await getCategories();

    const tasks = await getTasksFromDB();
    const filteredTasks = tasks.filter((task) => task.userid === user.id);

    res.render("previous-tasks", {
        taskList: filteredTasks,
        categories: categories
    });
});

app.get("/calendar", checkSession, async (req, res) => {
    const user = req.session.user;

    const categories = await getCategories();

    const tasks = await getTasksFromDB();
    const filteredTasks = tasks.filter((task) => task.userid === user.id);

    res.render("calendar", {
        taskList: filteredTasks,
        categories: categories
    });
});

// Login/Signup routes below ---------->

app.post("/register", async (req, res) => {
    const { name, email, password } = req.body;
    const hashedPassword = await bcrypt.hash(password, 10);
    try {
      const response = await db.query('SELECT * FROM users WHERE email = $1', [email]);
      if (response.rows.length > 0) {
        res.render('login', { message: 'Email already exists' });
      }
      else {
        await db.query('INSERT INTO users (name, email, password) VALUES ($1, $2, $3)', [name, email, hashedPassword]);
        res.render('login', { message: 'Account created successfully' });
      }
    }
    catch (error) {
      console.error('Error hashing password:', error);
      res.status(500).render('login', { message: 'Internal Server Error' });
    }
})

app.post("/login", async (req, res) => {
    const { email, password } = req.body;
    try {
      const response = await db.query("SELECT * FROM users WHERE email = $1", [email]);
      if (response.rows.length > 0) {
        const user = response.rows[0];
        const isMatch = await bcrypt.compare(password, user.password);
        console.log('Password matched');
        if (isMatch) {
          // check if it already exists in db?
          const checkSession = await db.query("SELECT * FROM sessions WHERE user_id = $1", [user.id]);
          if (checkSession.rows.length > 0) {
            // Set user information in the session
            req.session.user = { ...user };  // Create a new object and copy properties
            res.redirect('/home')
          } else {
            const expiry = new Date(Date.now() + 30 * 24 * 60 * 60 * 1000); // 30 days
            const created_at = new Date(Date.now());
            await db.query("INSERT INTO sessions (session_id, user_id, expiry, created_at) VALUES ($1, $2, $3, $4)", [req.sessionID, user.id, expiry, created_at]);
            req.session.user = { ...user }; // Create a new object and copy properties
            res.redirect('/home')
          }
        } else {
          res.render('login', { message: 'Invalid password' });
        }
      } else {
        res.render('login', { message: 'Invalid email address' });
      }
    } catch (error) {
      console.error('Error hashing password:', error);
      res.render('login', { message: 'Internal Server Error' });
    }
});

// Login/Signup routes above ---------->

// Action routes below 

app.post("/add/new", async (req, res) => {
    const { task, category } = req.body;
    const status = 'FALSE';
    const user = req.session.user;
    try {
        await db.query("INSERT INTO to_do_list (task_list, date, status, userid, category_id) VALUES ($1, $2, $3, $4, $5) RETURNING *", 
        [task, today, status, user.id, category]);
        console.log(`Task: ${task}, Date: ${today} & Status: ${status}`);
      
        const tasks = await getTasksFromDB();
        const filteredTasks = tasks.filter((task) => task.userid === user.id);

        const categories = await getCategories();
  
        const query = await db.query("SELECT categories.id, categories.category_name, categories.color, to_do_list.category_id from to_do_list JOIN categories ON to_do_list.category_id = categories.id WHERE to_do_list.userid = $1", [user.id]);
        const cats = query.rows;

        res.render("home", {
          taskList: filteredTasks,
          categories: categories,
          relatedCategory: cats,
          message: "Task added successfully."
        });
    }
    catch (err) {
        console.log(err);
    }
   
});

app.post("/home/done", async (req, res) => {
    const { taskId, taskStatus } = req.body;
    const user = req.session.user;
    try {
        const status = taskStatus === 'TRUE';
        await db.query("UPDATE to_do_list SET status = $1 WHERE id = $2 RETURNING *", [status, taskId]);
        console.log(`Id: ${taskId} & Task: ${status}`);

        const tasks = await getTasksFromDB();
        const filteredTasks = tasks.filter((task) => task.userid === user.id);

        const categories = await getCategories();
  
        const query = await db.query("SELECT categories.id, categories.category_name, categories.color, to_do_list.category_id from to_do_list JOIN categories ON to_do_list.category_id = categories.id WHERE to_do_list.userid = $1", [user.id]);
        const cats = query.rows;

        res.render("home", {
          taskList: filteredTasks,
          categories: categories,
          relatedCategory: cats,
          message : "Task status updated successfully."
        });
    }
    catch (err) {
        console.log(err);
    }
});

app.post("/home/delete", async (req, res) => {
    const deleteTask = req.body.deleteTask;
    const user = req.session.user;
    try {
        await db.query("DELETE FROM to_do_list WHERE id = $1", [deleteTask]);
        console.log(deleteTask);

        const tasks = await getTasksFromDB();
        const filteredTasks = tasks.filter((task) => task.userid === user.id);

        const categories = await getCategories();
  
        const query = await db.query("SELECT categories.id, categories.category_name, categories.color, to_do_list.category_id from to_do_list JOIN categories ON to_do_list.category_id = categories.id WHERE to_do_list.userid = $1", [user.id]);
        const cats = query.rows;

        res.render("home", {
          taskList: filteredTasks,
          categories: categories,
          relatedCategory: cats,
          message : "Task has been removed."
        });
    }
    catch (err) {
        console.log(err);
    }
});

app.post("/home/update", async (req, res) => {
    const id = req.body.id;
    const task = req.body.modified.trim();
    const user = req.session.user;
    try {
        await db.query("UPDATE to_do_list SET task_list = $1, updated = $2 WHERE id = $3 RETURNING *", [task, today, id]);
        console.log(`Id: ${id} & Task: ${task}`);

        const tasks = await getTasksFromDB();
        const filteredTasks = tasks.filter((task) => task.userid === user.id);

        const categories = await getCategories();
  
        const query = await db.query("SELECT categories.id, categories.category_name, categories.color, to_do_list.category_id from to_do_list JOIN categories ON to_do_list.category_id = categories.id WHERE to_do_list.userid = $1", [user.id]);
        const cats = query.rows;

        res.render("home", {
          taskList: filteredTasks,
          categories: categories,
          relatedCategory: cats,
          message : "Task updated successfully."
        });
    }
    catch (err) {
        console.log(err);
    }
    
});

app.post("/previous-tasks/done", async (req, res) => {
    const { taskId, taskStatus } = req.body;
    const user = req.session.user;
    try {
        const status = taskStatus === 'TRUE';
        await db.query("UPDATE to_do_list SET status = $1 WHERE id = $2 RETURNING *", [status, taskId]);
        console.log(`Id: ${taskId} & Task: ${status}`);

        const tasks = await getTasksFromDB();
        const filteredTasks = tasks.filter((task) => task.userid === user.id);

        res.render("previous-tasks", {
            taskList : filteredTasks,
            message : "Task status updated successfully."
        });
    }
    catch (err) {
        console.log(err);
    }
});

app.post("/previous-tasks/delete", async (req, res) => {
    const deleteTask = req.body.deleteTask;
    const user = req.session.user;
    try {
        await db.query("DELETE FROM to_do_list WHERE id = $1", [deleteTask]);
        console.log(deleteTask);

        const tasks = await getTasksFromDB();
        const filteredTasks = tasks.filter((task) => task.userid === user.id);

        res.render("previous-tasks", {
            taskList : filteredTasks,
            message : "Task has been removed."
        });
    }
    catch (err) {
        console.log(err);
    }
});

app.post("/profile/update-name-email", async (req, res) => {
    const { name, email } = req.body;
    try {
        const response = await db.query("UPDATE users SET name = $1, email = $2 WHERE id = $3 RETURNING *", [name, email, req.session.user.id]);
        console.log(`Id: ${name} & Task: ${email}`);

        const updatedNameEmail = response.rows[0];
        

        res.render("profile", {
            user : updatedNameEmail,
            message : 'Profile updated successfully.'
        });
    }
    catch (err) {
        console.log(err);
    }      
});

app.post("/profile/update-password", async (req, res) => {
    const { currentPassword, newPassword, reTypeNewPassword } = req.body;
    const hashedPassword = await bcrypt.hash(newPassword, 10);
    const user = req.session.user;
    try {
        const isMatch = await bcrypt.compare(currentPassword, user.password);
        if (isMatch) {
          console.log('Old password is correct.');
            if (newPassword === reTypeNewPassword) {
                const response = await db.query("UPDATE users SET password = $1 WHERE id = $2 RETURNING *", [hashedPassword, user.id]);
                
                console.log('New password matched!');

                const updatedUser = response.rows[0];
                res.render("profile", {
                  user : updatedUser,
                  message : "Password updated successfully."
              });
            }
            else {
                res.render("profile", {
                    user : user,
                    message : "New passwords do not match."
                });
            }
        }
        else {
            res.render("profile", {
                user : user,
                message : "Current password is incorrect."
            });
        }      
    }
    catch {

    }
});

app.listen(port, () => {
    console.log(`Listening at: ${port}`);
});
