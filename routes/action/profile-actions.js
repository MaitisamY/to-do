import express from "express";
import bcrypt from "bcrypt";
import db from "../../util/db.js";
import { getCategories } from "../../util/get-data.js";

const router = express.Router();

router.post("/profile/update-name-email", async (req, res) => {
    const { name, email } = req.body;
    const user = req.session.user;
    try {
        // Parameterized query
        const updateQuery = 'UPDATE users SET name = $1, email = $2 WHERE id = $3 RETURNING *';
        const updateValue = [name, email, req.session.user.id];
        const response = await db.query(updateQuery, updateValue);
        const updatedNameEmail = response.rows[0];

        console.log('Name & Email / Name Or Email updated successfully!');
        
        const categories = await getCategories();

        // Parameterized query
        const customCategoryQuery = await db.query(`SELECT * FROM categories WHERE user_id = $1`, [user.id]);
        const customCategory = customCategoryQuery.rows;

        res.render("profile", {
            user : updatedNameEmail,
            categories: categories,
            userCategory: customCategory,
            message : 'Profile updated successfully.'
        });
    }
    catch (err) {
        console.log(err);
    }      
});

router.post("/profile/update-password", async (req, res) => {
    const { currentPassword, newPassword, reTypeNewPassword } = req.body;
    const hashedPassword = await bcrypt.hash(newPassword, 10);
    const user = req.session.user;
    const categories = await getCategories();
    try {
        const isMatch = await bcrypt.compare(currentPassword, user.password);
        if (isMatch) {
          console.log('Old password is correct.');
          
            if (newPassword === reTypeNewPassword) {
                const updateQuery = 'UPDATE users SET password = $1 WHERE id = $2 RETURNING *';
                const updateValue = [hashedPassword, user.id];
                const response = await db.query(updateQuery, updateValue);
                
                console.log('New password matched!');

                const updatedUser = response.rows[0];
                res.render("profile", {
                  user : updatedUser,
                  categories: categories,
                  message : "Password updated successfully."
              });
            }
            else {
                res.render("profile", {
                    user : user,
                    categories: categories,
                    message : "New passwords do not match."
                });
            }
        }
        else {
            res.render("profile", {
                user : user,
                categories: categories,
                message : "Current password is incorrect."
            });
        }      
    }
    catch {

    }
});

export default router;