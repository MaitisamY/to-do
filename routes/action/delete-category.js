import express from "express";
import db from "../../util/db.js";
import { getTasksFromDB, getCategories } from "../../util/get-data.js";

const router = express.Router();

router.get("/home/delete/category/:id", async (req, res) => {
    const { id: deleteTask } = req.params;
    const newCategoryId = 1;
    const user = req.session.user;
    try {
        // Parameterized query
        const updateQuery = 'UPDATE to_do_list SET category_id = $1 WHERE category_id = $2 AND userid = $3';
        const updateValue = [newCategoryId, deleteTask, user.id];
        await db.query(updateQuery, updateValue) ? console.log('Category updated successfully.') : console.log('Category not updated.');
        
        // Parameterized query
        const deleteQuery = 'DELETE FROM categories WHERE id = $1 AND user_id = $2';
        const deleteValue = [deleteTask, user.id];
        await db.query(deleteQuery, deleteValue) ? console.log('Category deleted successfully.') : console.log('Category not deleted.');
        

        const tasks = await getTasksFromDB();
        const filteredTasks = tasks.filter((task) => task.userid === user.id);

        const categories = await getCategories();

        // Parameterized query
        const customCategoryQuery = await db.query(`SELECT * FROM categories WHERE user_id = $1`, [user.id]);
        const customCategory = customCategoryQuery.rows;
  
        // Parameterized query
        const selectQuery = `SELECT categories.id, categories.category_name, categories.color, to_do_list.category_id from 
        to_do_list JOIN categories ON to_do_list.category_id = categories.id WHERE to_do_list.userid = $1`;
        const selectValue = [user.id];
        const query = await db.query(selectQuery, selectValue);
        const cats = query.rows;

        res.render("home", {
          taskList: filteredTasks,
          categories: categories,
          userCategory: customCategory,
          relatedCategory: cats,
          message : "Category has been removed."
        });
    }
    catch (err) {
        console.log(err);
    }
});

router.get("/previous-tasks/delete/category/:id", async (req, res) => {
    const { id: deleteTask } = req.params;
    const newCategoryId = 1;
    const user = req.session.user;
    try {
        // Parameterized query
        const updateQuery = 'UPDATE to_do_list SET category_id = $1 WHERE category_id = $2 AND userid = $3';
        const updateValue = [newCategoryId, deleteTask, user.id];
        await db.query(updateQuery, updateValue) ? console.log('Category updated successfully.') : console.log('Category not updated.');
        
        // Parameterized query
        const deleteQuery = 'DELETE FROM categories WHERE id = $1 AND user_id = $2';
        const deleteValue = [deleteTask, user.id];
        await db.query(deleteQuery, deleteValue) ? console.log('Category deleted successfully.') : console.log('Category not deleted.');
        

        const tasks = await getTasksFromDB();
        const filteredTasks = tasks.filter((task) => task.userid === user.id);

        const categories = await getCategories();

        // Parameterized query
        const customCategoryQuery = await db.query(`SELECT * FROM categories WHERE user_id = $1`, [user.id]);
        const customCategory = customCategoryQuery.rows;

        res.render("previous-tasks", {
          taskList: filteredTasks,
          categories: categories,
          userCategory: customCategory,
          message : "Category has been removed."
        });
    }
    catch (err) {
        console.log(err);
    }
});

router.get("/calendar/delete/category/:id", async (req, res) => {
    const { id: deleteTask } = req.params;
    const newCategoryId = 1;
    const user = req.session.user;
    try {
        // Parameterized query
        const updateQuery = 'UPDATE to_do_list SET category_id = $1 WHERE category_id = $2 AND userid = $3';
        const updateValue = [newCategoryId, deleteTask, user.id];
        await db.query(updateQuery, updateValue) ? console.log('Category updated successfully.') : console.log('Category not updated.');
        
        // Parameterized query
        const deleteQuery = 'DELETE FROM categories WHERE id = $1 AND user_id = $2';
        const deleteValue = [deleteTask, user.id];
        await db.query(deleteQuery, deleteValue) ? console.log('Category deleted successfully.') : console.log('Category not deleted.');
        

        const tasks = await getTasksFromDB();
        const filteredTasks = tasks.filter((task) => task.userid === user.id);

        const categories = await getCategories();

        // Parameterized query
        const customCategoryQuery = await db.query(`SELECT * FROM categories WHERE user_id = $1`, [user.id]);
        const customCategory = customCategoryQuery.rows;

        res.render("calendar", {
            taskList: filteredTasks,
            categories: categories,
            userCategory: customCategory,
            message : "Category has been removed."
        });
    }
    catch (err) {
        console.log(err);
    }
});

router.get("/profile/delete/category/:id", async (req, res) => {
    const { id: deleteTask } = req.params;
    const newCategoryId = 1;
    const user = req.session.user;
    try {
        // Parameterized query
        const updateQuery = 'UPDATE to_do_list SET category_id = $1 WHERE category_id = $2 AND userid = $3';
        const updateValue = [newCategoryId, deleteTask, user.id];
        await db.query(updateQuery, updateValue) ? console.log('Category updated successfully.') : console.log('Category not updated.');
        
        // Parameterized query
        const deleteQuery = 'DELETE FROM categories WHERE id = $1 AND user_id = $2';
        const deleteValue = [deleteTask, user.id];
        await db.query(deleteQuery, deleteValue) ? console.log('Category deleted successfully.') : console.log('Category not deleted.');
        

        const tasks = await getTasksFromDB();
        const filteredTasks = tasks.filter((task) => task.userid === user.id);

        const categories = await getCategories();

        // Parameterized query
        const customCategoryQuery = await db.query(`SELECT * FROM categories WHERE user_id = $1`, [user.id]);
        const customCategory = customCategoryQuery.rows;

        res.render("profile", {
            user: user,
            categories: categories,
            userCategory: customCategory,
            message : "Category has been removed."
        });
    }
    catch (err) {
        console.log(err);
    }
});

export default router;