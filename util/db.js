import pg from "pg";

const db = new pg.Client({
    user : "postgres",
    host : "localhost",
    database : "to-do-list",
    password : "my@postgres",
    port : 5432,
});

db.connect();

export default db