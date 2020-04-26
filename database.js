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
            date text,
            title text,
            excerpt text,
            image text,
            url text,
            tags text,
            seen number
            )`,
        (err) => {
            if (err) {
                // Table already created
            } else {
                // Table NOW created, creating rows
                let insert = 'INSERT INTO user (name, email, password) VALUES (?,?,?)'
                db.run(insert, [
                  '{"year":2020,"month":1,"day":1,"hour":01,"minute":10}',
                  "Welcome",
                  "Hello, this a the default post that is added when you create the SQLite table.",
                  "/static/img/thumb-first-post.jpg",
                  "http://localhost:8000",
                  "c4d, cinema 4d, free, materials, motion graphics, read later, resources, textures",
                  0,
                ]);
            }
        })
    }
})

module.exports = db