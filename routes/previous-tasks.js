import express from "express";
import checkSession from "../middleware/check-session.js";
import db from "../util/db.js";
import { getTasksFromDB, getCategories } from "../util/get-data.js";

const router = express.Router();

router.get("/previous-tasks", checkSession, async (req, res) => {
    const user = req.session.user;
  
    const categories = await getCategories();

    // Parameterized query
    const customCategoryQuery = await db.query(`SELECT * FROM categories WHERE user_id = $1`, [user.id]);
    const customCategory = customCategoryQuery.rows;

    const tasks = await getTasksFromDB();
    const filteredTasks = tasks.filter((task) => task.userid === user.id);

    res.render("previous-tasks", {
        taskList: filteredTasks,
        userCategory: customCategory,
        categories: categories
    });
})

export default router;