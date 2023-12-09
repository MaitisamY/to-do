import express from "express";
import db from '../util/db.js';

const router = express.Router();

router.get('/logout', async (req, res) => {
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
    } catch (error) {
      console.error("Error during logout:", error);
      res.redirect('/');
    }
});

export default router