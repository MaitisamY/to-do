import express from "express";
import bcrypt from "bcrypt";
import db from '../util/db.js';

const router = express.Router();

// Root route i.e http://localhost:3000/ OR http://localhost:3000/login
router.get("/", async (req, res) => {
    res.render("login");
});

router.get("/login", async (req, res) => {
    res.render("login");
});

// Register route i.e http://localhost:3000/ OR http://localhost:3000/login

router.post("/register", async (req, res) => {
    const { name, email, password } = req.body;
    const hashedPassword = await bcrypt.hash(password, 10);
    try {
      const response = await db.query('SELECT * FROM users WHERE email = $1', [email]);
      if (response.rows.length > 0) {
        res.render('login', { message: 'Email already exists' });
      }
      else {
        await db.query('INSERT INTO users (name, email, password) VALUES ($1, $2, $3)', [name, email, hashedPassword]);
        res.render('login', { message: 'Account created successfully' });
      }
    }
    catch (error) {
      console.error('Error hashing password:', error);
      res.status(500).render('login', { message: 'Internal Server Error' });
    }
})

// Login route i.e http://localhost:3000/ OR http://localhost:3000/login

router.post("/login", async (req, res) => {
    const { email, password } = req.body;
    try {
      const response = await db.query("SELECT * FROM users WHERE email = $1", [email]);
      if (response.rows.length > 0) {
        const user = response.rows[0];
        const isMatch = await bcrypt.compare(password, user.password);
        console.log('Password matched');
        if (isMatch) {
          // check if it already exists in db?
          const validateSession = await db.query("SELECT * FROM sessions WHERE user_id = $1", [user.id]);
          if (validateSession.rows.length > 0) {
            // Set user information in the session
            req.session.user = { ...user };  // Create a new object and copy properties
            res.redirect('/home')
          } else {
            const expiry = new Date(Date.now() + 30 * 24 * 60 * 60 * 1000); // 30 days
            const created_at = new Date(Date.now());
            await db.query("INSERT INTO sessions (session_id, user_id, expiry, created_at) VALUES ($1, $2, $3, $4)", [req.sessionID, user.id, expiry, created_at]);
            req.session.user = { ...user }; // Create a new object and copy properties
            res.redirect('/home')
          }
        } else {
          res.render('login', { message: 'Invalid password' });
        }
      } else {
        res.render('login', { message: 'Invalid email address' });
      }
    } catch (error) {
      console.error('Error hashing password:', error);
      res.render('login', { message: 'Internal Server Error' });
    }
});

export default router;