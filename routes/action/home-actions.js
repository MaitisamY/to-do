import express from "express";
import db from "../../util/db.js";
import { getTasksFromDB, getCategories } from "../../util/get-data.js";

const router = express.Router();

const newDate = new Date();
const today = new Intl.DateTimeFormat('en-GB', { dateStyle: 'full' }).format(newDate);

router.post("/home/done", async (req, res) => {
    const { taskId, taskStatus } = req.body;
    const user = req.session.user;
    try {
        const status = taskStatus === 'TRUE';

        // Parameterized query
        const updateQuery = "UPDATE to_do_list SET status = $1 WHERE id = $2 RETURNING *";
        const updateValue = [status, taskId];
        await db.query(updateQuery, updateValue);

        console.log('Status updated successfully.');

        const categories = await getCategories();

        // Parameterized query
        const customCategoryQuery = await db.query(`SELECT * FROM categories WHERE user_id = $1`, [user.id]);
        const customCategory = customCategoryQuery.rows;

        const tasks = await getTasksFromDB();
        const filteredTasks = tasks.filter((task) => task.userid === user.id);
  
        // Parameterized query
        const selectQuery = `SELECT categories.id, categories.category_name, categories.color, to_do_list.category_id 
        from to_do_list JOIN categories ON to_do_list.category_id = categories.id WHERE to_do_list.userid = $1`;
        const selectValue = [user.id];
        const query = await db.query(selectQuery, selectValue);
        const cats = query.rows;

        res.render("home", {
          taskList: filteredTasks,
          categories: categories,
          userCategory: customCategory,
          relatedCategory: cats,
          message : "Task status updated successfully."
        });
    }
    catch (err) {
        console.log(err);
    }
});

router.post("/home/delete", async (req, res) => {
    const deleteTask = req.body.deleteTask;
    const user = req.session.user;
    try {
        // Parameterized query
        const deleteQuery = 'DELETE FROM to_do_list WHERE id = $1';
        const deleteValue = [deleteTask];
        await db.query(deleteQuery, deleteValue);
        console.log('Task deleted successfully.');

        const tasks = await getTasksFromDB();
        const filteredTasks = tasks.filter((task) => task.userid === user.id);

        const categories = await getCategories();
  
        // Parameterized query
        const selectQuery = `SELECT categories.id, categories.category_name, categories.color, to_do_list.category_id from 
        to_do_list JOIN categories ON to_do_list.category_id = categories.id WHERE to_do_list.userid = $1`;
        const selectValue = [user.id];
        const query = await db.query(selectQuery, selectValue);
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

router.post("/home/update", async (req, res) => {
    const id = req.body.id;
    const task = req.body.modified.trim();
    const user = req.session.user;
    try {
        // Parameterized query
        const updateQuery = 'UPDATE to_do_list SET task_list = $1, updated = $2 WHERE id = $3 RETURNING *';
        const updateValue = [task, today, id];
        await db.query(updateQuery, updateValue);
        console.log('Task updated successfully.');

        const tasks = await getTasksFromDB();
        const filteredTasks = tasks.filter((task) => task.userid === user.id);

        const categories = await getCategories();
  
        // Parameterized query
        const selectQuery = `SELECT categories.id, categories.category_name, categories.color, to_do_list.category_id 
        from to_do_list JOIN categories ON to_do_list.category_id = categories.id WHERE to_do_list.userid = $1`;
        const selectValue = [user.id];
        const query = await db.query(selectQuery, selectValue);
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

export default router;

