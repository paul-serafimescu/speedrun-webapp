import db from '../connection';

export default class User {
    static tableName = "User";

    /**
     * create a user instance (not saved to db)
     * @param {string} username at most 30 characters
     * @param {string} password at most 20 characters
     * @param {number|undefined} user_id 
     */
    constructor(username, password, user_id = undefined) {
        this.username = username;
        this.password = password;
        this.user_id = user_id;
    }

    /**
     * save an instance of User to db, adds a user_id
     * @returns {Promise<void>}
     */
    async create() {
        const that = this;
        return new Promise((resolve, reject) => {
            db.run(`INSERT INTO ${User.tableName} (username, password) VALUES (?, ?)`, [this.username, this.password],
            function (err) {
                if (err) {
                    reject(err);
                } else {
                    that.user_id = this.lastID;
                    resolve()
                }
            });
        });
    }

    /**
     * fetch a user instance from db by id
     * @param {number} user_id 
     * @returns {Promise<User>}
     */
    static async get(user_id) {
        return new Promise((resolve, reject) => {
            db.get(`SELECT * FROM ${User.tableName} WHERE user_id = ?`, [user_id], function (err, row) {
                if (err) {
                    reject(err);
                } else {
                    resolve(new User(row.username, row.password, row.user_id));
                }
            });
        });
    }

    /**
     * fetch all user instances from db
     * @returns {Promise<User[]>}
     */
    static async all() {
        return new Promise((resolve, reject) => {
            db.all(`SELECT * FROM ${User.tableName}`, async function (err, rows) {
                if (err) {
                    reject(err);
                } else {
                    resolve(await Promise.all(rows.map(row => new User(row.username, row.password, row.user_id))));
                }
            });
        });
    }

    /**
     * serializes user to json
     * @returns {{ user_id?: number, username: string, password: string }}
     */
    as_json = () => ({
        user_id: this.user_id,
        username: this.username,
        password: this.password
    });
}
