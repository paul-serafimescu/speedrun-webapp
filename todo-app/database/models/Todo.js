import db from '../connection';
import User from './User';

export default class Todo {
    static tableName = "Todo";

    /**
     * construct a new todo object (this is not immediately saved in db)
     * @param {string} title
     * @param {string} description 
     * @param {import('./User').default} author 
     */
    constructor(title, description, author, todo_id = undefined, timestamp = null) {
        this.todo_id = todo_id;
        this.title = title;
        this.description = description;
        this.timestamp = timestamp;
        this.author = author;
    }

    /**
     * creates a new TODO
     * @returns {Promise<void>}
     */
    async create() {
        return new Promise((resolve, reject) => {
            const that = this;
            const timestamp = new Date();
            db.run(`INSERT INTO ${Todo.tableName}
                (title, description, timestamp, author) 
                VALUES (?, ?, ?, ?)`, [this.title, this.description, timestamp.toISOString(), this.author.user_id],
                function (err) {
                    if (err) {
                        reject(err);
                    } else {
                        that.todo_id = this.lastID;
                        that.timestamp = timestamp;
                        resolve();
                    }
                }
            );
        });
    }

    /**
     * fetch a todo by its id
     * @param {number} todo_id 
     * @returns {Promise<Todo>}
     */
    static async get(todo_id) {
        return new Promise((resolve, reject) => {
            db.get(`SELECT * FROM ${Todo.tableName} WHERE todo_id = ?`, [todo_id], async function (err, row) {
                if (err) {
                    reject(err);
                } else {
                    resolve(new Todo(
                        row.title,
                        row.description,
                        await User.get(row.author),
                        row.todo_id,
                        new Date(row.timestamp)
                    ));
                }
            });
        });
    }

    /**
     * fetch all todos
     * @returns {Promise<Todo[]>}
     */
    static async all() {
        return new Promise((resolve, reject) => {
            db.all(`SELECT * FROM ${Todo.tableName}`, async function (err, rows) {
                if (err) {
                    reject(err);
                } else {
                    resolve(await Promise.all(rows.map(async row => new Todo(
                        row.title,
                        row.description,
                        await User.get(row.author),
                        row.todo_id,
                        new Date(row.timestamp)
                    ))));
                }
            });
        });
    }

    /**
     * serializes object to json
     * @returns {{ user_id?: number, title: string, description: string, author: { user_id: number, username: string, password: string }, timestamp?: string }}
     */
    as_json = () => ({
        todo_id: this.todo_id,
        title: this.title,
        description: this.description,
        author: this.author?.as_json(),
        timestamp: this.timestamp?.toISOString()
    });
}
