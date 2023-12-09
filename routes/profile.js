import express from "express";
import checkSession from "../middleware/check-session.js";
import db from "../util/db.js";
import { getCategories } from "../util/get-data.js";

const router = express.Router();

router.get("/profile", checkSession, async (req, res) => {
    const user = req.session.user;

    const categories = await getCategories();

    // Parameterized query
    const customCategoryQuery = await db.query(`SELECT * FROM categories WHERE user_id = $1`, [user.id]);
    const customCategory = customCategoryQuery.rows;

    res.render("profile", {
      user: user,
      userCategory: customCategory,
      categories: categories
    });
});

export default router;