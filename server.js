// Dependancies
const express = require('express')

// Express app / Database
const app = express()
const db = require("./database.js")
const md5 = require('md5')

const bodyParser = require('body-parser')
app.use(bodyParser.urlencoded({ extended: false }))
app.use(bodyParser.json())

// Port
const port = process.env.PORT || 8000;

app.listen(port, () => {
    console.log(`📡 Listening on port: ${port}`)
})

// Root endpoint
app.get("/", (req, res, next) => {
    res.json({"message": "OK"})
})

// Create Public folder
app.use(express.static("public"))

// Get List of links endpoint
app.get("/api/links", (req, res, next) => {
    // Setup SQL query
    let sql = "select * from link"
    // Additional SQL parameters
    let params = []
    // Make the query
    db.all(sql, params, (err, rows) => {
        // If there's an error in the query
        if (err) {
            res.status(400).json({"error": err.message})
            return
        }
        // If the query succeeds
        res.json({
            "message": "success",
            "data": rows
        })
    })
})

// Get Single link by ID
app.get("/api/link/:id", (req, res, next) => {
    // Setup SQL query
    let sql = "select * from link where id = ?";
    // Additional SQL parameters
    let params = [req.params.id];
    // Make the query
    db.get(sql, params, (err, row) => {
        // If there's an error in the query
        if (err) {
            res.status(400).json({"error": err.message})
            return
        }
        // If the query succeeds
        res.json({
            "message": "success",
            "data": row
        })
    })
})

// Post Create a New link
app.post("/api/link/", (req, res, next) => {
    // Create an array for errors
    let errors = []
    // If the password is empty
    if (!req.body.password) {
        errors.push("No password specified")
    }
    // If the email is empty
    if (!req.body.email) {
        errors.push("No email specified")
    }
    // If any/all of the errors fire, send the errors to a 400 response
    if (errors.length) {
        res.status(400).json({"error": errors.json(",")})
        return
    }

    // If there are no errors, set data to the returned valules
    let data = {
        name: req.body.name,
        email: req.body.email,
        password: md5(req.body.password)
    }

    // Create the sql query
    let sql = 'INSERT INTO link (name, email, password) VALUES (?,?,?)'
    // Assign the parameters
    let params = [data.name, data.email, data.password]
    // Run the DB query
    db.run(sql, params, function (err, result) {
        // If there are any errors, send them to a 400 response
        if (err) {
            res.status(400).json({"error": err.message})
            return
        }
        // If everything gets this far, send a success message 👍
        res.json({
            "message": "success",
            "data": data,
            "id": this.lastID
        })

    })

})

// Update a link's information
app.patch("/api/link/:id", (req, res, next) => {
    // Set the data variable to the requested values
    let data = {
        date: req.body.date,
        title: req.body.title,
        excerpt: req.body.excerpt,
        image: req.body.image,
        url: req.body.url,
        tags: req.body.tags,
        seen: req.body.seen
    }
    // Run the a DB query
    db.run(
      // SQL query
      `UPDATE link set
          date = COALESCE(?,date),
          title = COALESCE(?,title),
          excerpt = COALESCE(?,excerpt),
          image = COALESCE(?,image),
          url = COALESCE(?,url),
          tags = COALESCE(?,tags),
          seen = COALESCE(?,seen)
          WHERE id = ?`,
      // Variable data to repalce ?s
      [data.date, data.title, data.excerpt, data.image, data.url, data.tags, data.seen, req.params.id],
      // Run error/success function
      function (err, result) {
        // If there are any errors, send them to a 400 response
        if (err) {
          res.status(400).json({ error: err.message });
          return;
        }
        // If everything gets this far, send a success message 👍
        res.json({
          message: "success",
          data: data,
          changes: this.changes,
        });
      }
    );
})

// Delete a link
app.delete("/api/link/:id", (req, res, next) => {
    // SQL query to delete link
    db.run(
        // SQL query
        `DELETE FROM link WHERE id = ?`,
        // Get if from request
        req.params.id,
        // Run function to delete link
        function (err, result) {
            // If there are any errors, send them to a 400 response
            if (err) {
                res.status(400).json({ "error": err.message })
                return
            }
            // If everything gets this far, send a success message 👍
            res.json({
                "message": "deleted",
                "changes": this.changes
            })
        }
    )
})

// Default response for any other request (404)
app.use(function(req, res) {
    res.status(404)
})