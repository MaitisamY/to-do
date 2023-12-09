import db from "./db.js";

async function getTasksFromDB() {
    const result = await db.query("SELECT * from to_do_list ORDER BY id DESC");
    const tasks = result.rows;
    return tasks;
}

async function getCategories() {
  const result = await db.query('SELECT * from categories WHERE user_id IS NULL ORDER BY id ASC');
  const category = result.rows;
  return category;
}

export { getTasksFromDB, getCategories };