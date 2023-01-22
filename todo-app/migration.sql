PRAGMA foreign_keys=OFF;
BEGIN TRANSACTION;
CREATE TABLE User (user_id INTEGER PRIMARY KEY AUTOINCREMENT,
                               username VARCHAR(30) NOT NULL,
                               password VARCHAR(20) NOT NULL);
INSERT INTO User VALUES(1,'psera1','123456789');
CREATE TABLE Todo (todo_id INTEGER PRIMARY KEY AUTOINCREMENT,
                               title TEXT NOT NULL,
                               description TEXT NOT NULL,
                               timestamp DATETIME DEFAULT CURRENT_TIMESTAMP,
                               author INTEGER,
                               FOREIGN KEY(author) REFERENCES User(user_id));
INSERT INTO Todo VALUES(1,'my first todo','this is my first todo','2023-01-22 06:37:45',1);
INSERT INTO Todo VALUES(2,'my second todo','this is my second todo','2023-01-22 06:38:07',1);
DELETE FROM sqlite_sequence;
INSERT INTO sqlite_sequence VALUES('User',1);
INSERT INTO sqlite_sequence VALUES('Todo',2);
COMMIT;
