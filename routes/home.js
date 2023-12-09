import express from "express";
import checkSession from "../middleware/check-session.js";
import db from "../util/db.js";
import { getTasksFromDB, getCategories } from "../util/get-data.js";

const router = express.Router();

router.get("/home", checkSession, async (req, res) => {
    const user = req.session.user;
  
    const tasks = await getTasksFromDB();
    const filteredTasks = tasks.filter((task) => task.userid === user.id);

    const categories = await getCategories();

    // Parameterized query
    const customCategoryQuery = await db.query(`SELECT * FROM categories WHERE user_id = $1`, [user.id]);
    const customCategory = customCategoryQuery.rows;
  
    const query = await db.query(`SELECT categories.id, categories.category_name, categories.color, to_do_list.category_id 
    from to_do_list JOIN categories ON to_do_list.category_id = categories.id WHERE to_do_list.userid = $1`, [user.id]);
    const cats = query.rows;

    res.render("home", {
      taskList: filteredTasks,
      categories: categories,
      userCategory: customCategory,
      relatedCategory: cats
    });
});

export default router;