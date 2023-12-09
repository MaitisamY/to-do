import express from "express";
import db from "../../util/db.js";
import { getTasksFromDB, getCategories } from "../../util/get-data.js";

const router = express.Router();

router.post("/previous-tasks/done", async (req, res) => {
    const { taskId, taskStatus } = req.body;
    const user = req.session.user;
    try {
        const status = taskStatus === 'TRUE';

        // Parameterized query
        const updateQuery = 'UPDATE to_do_list SET status = $1 WHERE id = $2 RETURNING *';
        const updateValue = [status, taskId];
        await db.query(updateQuery, updateValue);

        console.log('Status updated successfully.');

        const categories = await getCategories();

        // Parameterized query
        const customCategoryQuery = await db.query(`SELECT * FROM categories WHERE user_id = $1`, [user.id]);
        const customCategory = customCategoryQuery.rows;

        const tasks = await getTasksFromDB();
        const filteredTasks = tasks.filter((task) => task.userid === user.id);

        res.render("previous-tasks", {
            taskList : filteredTasks,
            categories: categories,
            userCategory: customCategory,
            message : "Task status updated successfully."
        });
    }
    catch (err) {
        console.log(err);
    }
});

router.post("/previous-tasks/delete", async (req, res) => {
    const deleteTask = req.body.deleteTask;
    const user = req.session.user;
    try {
        // Parameterized query
        const deleteQuery = 'DELETE FROM to_do_list WHERE id = $1';
        const deleteValue = [deleteTask];
        await db.query(deleteQuery, deleteValue);
        console.log(deleteTask);

        const tasks = await getTasksFromDB();
        const filteredTasks = tasks.filter((task) => task.userid === user.id);

        const categories = await getCategories();

        res.render("previous-tasks", {
            taskList : filteredTasks,
            categories: categories,
            message : "Task has been removed."
        });
    }
    catch (err) {
        console.log(err);
    }
});

export default router;