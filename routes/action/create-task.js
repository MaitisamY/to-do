import express from "express";
import db from "../../util/db.js";
import { getTasksFromDB, getCategories } from "../../util/get-data.js";

const router = express.Router();

const newDate = new Date();
const today = new Intl.DateTimeFormat('en-GB', { dateStyle: 'full' }).format(newDate);

router.post("/home/add/task", async (req, res) => {
    const { task, category } = req.body;
    const item = task.trim();
    const status = 'FALSE';
    const user = req.session.user;
    const categories = await getCategories();
    try {
        // Parameterized query
        const insertQuery = `INSERT INTO to_do_list (task_list, date, status, userid, category_id) 
        VALUES ($1, $2, $3, $4, $5) RETURNING *`
        const insertValue = [item, today, status, user.id, category];
        await db.query(insertQuery, insertValue);

        console.log(`Status: Task Inserted successfully`);

        // Parameterized query
        const customCategoryQuery = await db.query(`SELECT * FROM categories WHERE user_id = $1`, [user.id]);
        const customCategory = customCategoryQuery.rows;

        const tasks = await getTasksFromDB();
        const filteredTasks = tasks.filter((task) => task.userid === user.id);
  
        // Parameterized query
        const query = `SELECT categories.id, categories.category_name, categories.color, to_do_list.category_id from 
        to_do_list JOIN categories ON to_do_list.category_id = categories.id WHERE to_do_list.userid = $1`;
        const value = [user.id];

        const result = await db.query(query, value);
        const cats = result.rows;

        res.render("home", {
          taskList: filteredTasks,
          categories: categories,
          userCategory: customCategory,
          relatedCategory: cats,
          message: "Task added successfully."
        });
    }
    catch (err) {
        console.log(err);
    }
   
});

router.post("/previous-tasks/add/task", async (req, res) => {
    const { task, category } = req.body;
    const item = task.trim();
    const status = 'FALSE';
    const user = req.session.user;
    const categories = await getCategories();
    try {
        // Parameterized query
        const insertQuery = `INSERT INTO to_do_list (task_list, date, status, userid, category_id) 
        VALUES ($1, $2, $3, $4, $5) RETURNING *`
        const insertValue = [item, today, status, user.id, category];
        await db.query(insertQuery, insertValue);

        console.log(`Status: Task Inserted successfully`);

        // Parameterized query
        const customCategoryQuery = await db.query(`SELECT * FROM categories WHERE user_id = $1`, [user.id]);
        const customCategory = customCategoryQuery.rows;

        const tasks = await getTasksFromDB();
        const filteredTasks = tasks.filter((task) => task.userid === user.id);
  
        // Parameterized query
        const query = `SELECT categories.id, categories.category_name, categories.color, to_do_list.category_id from 
        to_do_list JOIN categories ON to_do_list.category_id = categories.id WHERE to_do_list.userid = $1`;
        const value = [user.id];

        const result = await db.query(query, value);
        const cats = result.rows;

        res.render("previous-tasks", {
          taskList: filteredTasks,
          categories: categories,
          userCategory: customCategory,
          message: "Task added successfully."
        });
    }
    catch (err) {
        console.log(err);
    }
   
});

router.post("/calendar/add/task", async (req, res) => {
    const { task, category } = req.body;
    const item = task.trim();
    const status = 'FALSE';
    const user = req.session.user;
    const categories = await getCategories();
    try {
        // Parameterized query
        const insertQuery = `INSERT INTO to_do_list (task_list, date, status, userid, category_id) 
        VALUES ($1, $2, $3, $4, $5) RETURNING *`
        const insertValue = [item, today, status, user.id, category];
        await db.query(insertQuery, insertValue);

        console.log(`Status: Task Inserted successfully`);

        // Parameterized query
        const customCategoryQuery = await db.query(`SELECT * FROM categories WHERE user_id = $1`, [user.id]);
        const customCategory = customCategoryQuery.rows;

        const tasks = await getTasksFromDB();
        const filteredTasks = tasks.filter((task) => task.userid === user.id);
  
        // Parameterized query
        const query = `SELECT categories.id, categories.category_name, categories.color, to_do_list.category_id from 
        to_do_list JOIN categories ON to_do_list.category_id = categories.id WHERE to_do_list.userid = $1`;
        const value = [user.id];

        const result = await db.query(query, value);
        const cats = result.rows;

        res.render("calendar", {
          taskList: filteredTasks,
          categories: categories,
          userCategory: customCategory,
          message: "Task added successfully."
        });
    }
    catch (err) {
        console.log(err);
    }
   
});

router.post("/profile/add/task", async (req, res) => {
    const { task, category } = req.body;
    const item = task.trim();
    const status = 'FALSE';
    const user = req.session.user;
    const categories = await getCategories();
    try {
        // Parameterized query
        const insertQuery = `INSERT INTO to_do_list (task_list, date, status, userid, category_id) 
        VALUES ($1, $2, $3, $4, $5) RETURNING *`
        const insertValue = [item, today, status, user.id, category];
        await db.query(insertQuery, insertValue);

        console.log(`Status: Task Inserted successfully`);

        // Parameterized query
        const customCategoryQuery = await db.query(`SELECT * FROM categories WHERE user_id = $1`, [user.id]);
        const customCategory = customCategoryQuery.rows;
  
        // Parameterized query
        const query = `SELECT categories.id, categories.category_name, categories.color, to_do_list.category_id from 
        to_do_list JOIN categories ON to_do_list.category_id = categories.id WHERE to_do_list.userid = $1`;
        const value = [user.id];

        const result = await db.query(query, value);
        const cats = result.rows;

        res.render("profile", {
          user: user,
          categories: categories,
          userCategory: customCategory,
          message: "Task added successfully."
        });
    }
    catch (err) {
        console.log(err);
    }
   
});

export default router;