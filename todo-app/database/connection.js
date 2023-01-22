import sqlite3 from 'sqlite3';
import path from 'path';

const db = new sqlite3.Database(path.join(process.cwd(), 'db.sqlite3'));

db.serialize(() => {
    db.run(`CREATE TABLE IF NOT EXISTS User (user_id INTEGER PRIMARY KEY AUTOINCREMENT,
                               username VARCHAR(30) NOT NULL,
                               password VARCHAR(20) NOT NULL)`);

    db.run(`CREATE TABLE IF NOT EXISTS Todo (todo_id INTEGER PRIMARY KEY AUTOINCREMENT,
                               title TEXT NOT NULL,
                               description TEXT NOT NULL,
                               timestamp DATETIME DEFAULT CURRENT_TIMESTAMP,
                               author INTEGER,
                               FOREIGN KEY(author) REFERENCES User(user_id))`);
});

export default db;
