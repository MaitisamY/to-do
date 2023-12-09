import express from "express";
import db from "../../util/db.js";
import { getTasksFromDB, getCategories } from "../../util/get-data.js";

const router = express.Router();

router.post("/home/add/category", async (req, res) => {
    const { categoryName, color } = req.body;
    const user = req.session.user;

    const categories = await getCategories();

    const tasks = await getTasksFromDB();
    const filteredTasks = tasks.filter((task) => task.userid === user.id);

    // Parameterized query
    const query = `SELECT categories.id, categories.category_name, categories.color, to_do_list.category_id FROM 
    to_do_list JOIN categories ON to_do_list.category_id = categories.id WHERE to_do_list.userid = $1`;
    const value = [user.id];

    const result = await db.query(query, value);
    const cats = result.rows;

    try {
        const selectQuery = `SELECT * FROM categories WHERE (category_name = $1 OR color = $2) AND user_id = $3`;
        const selectValue = [categoryName, color, user.id];
        const selectResult = await db.query(selectQuery, selectValue);

        if (selectResult.rows.length > 0) {
            console.log(`Status: Category already exists`);
        
            // Getting custom categories (Related to this user)
            const customCategoryQuery = await db.query(`SELECT * FROM categories WHERE user_id = $1`, [user.id]);
            const customCategory = customCategoryQuery.rows;
            
            return res.render("home", {
                taskList: filteredTasks,
                categories: categories,
                userCategory: customCategory,
                relatedCategory: cats,
                message: "Category or Color already exists."
            });
        }
        else {
            // Parameterized query
            const insertQuery = `INSERT INTO categories (category_name, color, user_id) VALUES ($1, $2, $3)`;
            const insertValue = [categoryName, color, user.id];
            await db.query(insertQuery, insertValue);

            // Getting custom categories (Related to this user)
            const customCategoryQuery = await db.query(`SELECT * FROM categories WHERE user_id = $1`, [user.id]);
            const customCategory = customCategoryQuery.rows;

            res.render("home", {
                taskList: filteredTasks,
                categories: categories,
                userCategory: customCategory,
                relatedCategory: cats,
                message: "Category created successfully."
            });
        }
    }
    catch (err) {
        console.log(err);
    }
});

router.post("/previous-tasks/add/category", async (req, res) => {
    const { categoryName, color } = req.body;
    const user = req.session.user;

    const categories = await getCategories();

    const tasks = await getTasksFromDB();
    const filteredTasks = tasks.filter((task) => task.userid === user.id);

    try {
        const selectQuery = `SELECT * FROM categories WHERE (category_name = $1 OR color = $2) AND user_id = $3`;
        const selectValue = [categoryName, color, user.id];
        const selectResult = await db.query(selectQuery, selectValue);

        if (selectResult.rows.length > 0) {
            console.log(`Status: Category already exists`);

            // Getting custom categories (Related to this user)
            const customCategoryQuery = await db.query(`SELECT * FROM categories WHERE user_id = $1`, [user.id]);
            const customCategory = customCategoryQuery.rows;

            res.render("previous-tasks", {
                taskList: filteredTasks,
                categories: categories,
                userCategory: customCategory,
                message: "Category or Color already exists."
            });
        }
        else {
            // Parameterized query
            const insertQuery = `INSERT INTO categories (category_name, color, user_id) 
            VALUES ($1, $2, $3) RETURNING *`;
            const insertValue = [categoryName, color, user.id];
            await db.query(insertQuery, insertValue);
            console.log(`Status: Category added successfully`);

            // Getting custom categories (Related to this user)
            const customCategoryQuery = await db.query(`SELECT * FROM categories WHERE user_id = $1`, [user.id]);
            const customCategory = customCategoryQuery.rows;

            res.render("previous-tasks", {
                taskList: filteredTasks,
                categories: categories,
                userCategory: customCategory,
                message: "Category created successfully."
            });
        }
    }
    catch (err) {
        console.log(err);
    }
});

router.post("/calendar/add/category", async (req, res) => {
    const { categoryName, color } = req.body;
    const user = req.session.user;

    const categories = await getCategories();

    const tasks = await getTasksFromDB();
    const filteredTasks = tasks.filter((task) => task.userid === user.id);

    try {
        const selectQuery = `SELECT * FROM categories WHERE (category_name = $1 OR color = $2) AND user_id = $3`;
        const selectValue = [categoryName, color, user.id];
        const selectResult = await db.query(selectQuery, selectValue);

        if (selectResult.rows.length > 0) {
            console.log(`Status: Category already exists`);

            // Getting custom categories (Related to this user)
            const customCategoryQuery = await db.query(`SELECT * FROM categories WHERE user_id = $1`, [user.id]);
            const customCategory = customCategoryQuery.rows;

            res.render("calendar", {
                taskList: filteredTasks,
                categories: categories,
                userCategory: customCategory,
                message: "Category or Color already exists."
            });
        }
        else {
            // Parameterized query
            const insertQuery = `INSERT INTO categories (category_name, color, user_id) 
            VALUES ($1, $2, $3) RETURNING *`;
            const insertValue = [categoryName, color, user.id];
            await db.query(insertQuery, insertValue);
            console.log(`Status: Category added successfully`);

            // Getting custom categories (Related to this user)
            const customCategoryQuery = await db.query(`SELECT * FROM categories WHERE user_id = $1`, [user.id]);
            const customCategory = customCategoryQuery.rows;

            res.render("calendar", {
                taskList: filteredTasks,
                categories: categories,
                userCategory: customCategory,
                message: "Category created successfully."
            });
        }
    }
    catch (err) {
        console.log(err);
    }
});

router.post("/profile/add/category", async (req, res) => {
    const { categoryName, color } = req.body;
    const user = req.session.user;

    const categories = await getCategories();

    try {
        const selectQuery = `SELECT * FROM categories WHERE (category_name = $1 OR color = $2) AND user_id = $3`;
        const selectValue = [categoryName, color, user.id];
        const selectResult = await db.query(selectQuery, selectValue);

        if (selectResult.rows.length > 0) {
            console.log(`Status: Category already exists`);

            // Getting custom categories (Related to this user)
            const customCategoryQuery = await db.query(`SELECT * FROM categories WHERE user_id = $1`, [user.id]);
            const customCategory = customCategoryQuery.rows;

            res.render("profile", {
                user : user,    
                categories: categories,
                userCategory: customCategory,
                message: "Category or Color already exists."
            });
        }
        else {
            // Parameterized query
            const insertQuery = `INSERT INTO categories (category_name, color, user_id) 
            VALUES ($1, $2, $3) RETURNING *`;
            const insertValue = [categoryName, color, user.id];
            await db.query(insertQuery, insertValue);
            console.log(`Status: Category added successfully`);

            // Getting custom categories (Related to this user)
            const customCategoryQuery = await db.query(`SELECT * FROM categories WHERE user_id = $1`, [user.id]);
            const customCategory = customCategoryQuery.rows;

            res.render("profile", {
                user : user,    
                categories: categories,
                userCategory: customCategory,
                message: "Category created successfully."
            });
        }
    }
    catch (err) {
        console.log(err);
    }
});

export default router;