const sqlite3 = require('sqlite3').verbose()
const md5 = require('md5')

const DBSOURCE = "db.sqlite"

let db = new sqlite3.Database(DBSOURCE, (err) => {
    if (err) {
        // Can't open DB
        console.log(err.message)
        throw err
    } else {
        console.log(`🎉 Connected to SQLite Database`)
        db.run(`CREATE TABLE user (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            name text,
            email text UNIQUE,
            password text,
            CONSTRAINT email_unique UNIQUE (email)
            )`,
        (err) => {
            if (err) {
                // Table already created
            } else {
                // Table NOW created, creating rows
                let insert = 'INSERT INTO user (name, email, password) VALUES (?,?,?)'
                db.run(insert, ["admin", 'adam@adamfarnsworth.com', md5('1stericks')])
                db.run(insert, ["user", 'me@farns.me', md5('1stericks')])
            }
        })
    }
})

module.exports = db