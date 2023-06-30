const express = require("express");
const sqlite3 = require("sqlite3").verbose();
const bodyParser = require("body-parser");
const cors = require("cors");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const { v4: uuidv4 } = require("uuid");
const app = express();
const port = 3000;

app.use(cors());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

// Open a database handle
let db = new sqlite3.Database("./database.db", (err) => {
  if (err) {
    return console.error(err.message);
  }
  console.log("Connected to the SQLite database.");
});

// Create the users table
db.run(
  `CREATE TABLE IF NOT EXISTS users(
  id TEXT PRIMARY KEY,
  username TEXT,
  fullName TEXT,
  email TEXT UNIQUE,
  companyName TEXT,
  password TEXT,
  role TEXT,
  allowLogin INTEGER,
  projectUUIDs TEXT
)`,
  (err) => {
    if (err) {
      return console.log(err.message);
    }
    console.log("Users table created");
  }
);

// Register route
app.post("/register", (req, res) => {
  const {
    username,
    fullName,
    email,
    companyName,
    password,
    role,
    allowLogin,
    projectUUIDs,
  } = req.body;

  const hashedPassword = bcrypt.hashSync(password, 10);

  db.run(
    `INSERT INTO users(id, username, fullName, email, companyName, password, role, allowLogin, projectUUIDs) VALUES(?, ?, ?, ?, ?, ?, ?, ?, ?)`,
    [
      uuidv4(),
      username,
      fullName,
      email,
      companyName,
      hashedPassword,
      role,
      allowLogin,
      projectUUIDs,
    ],
    function (err) {
      if (err) {
        return res.status(400).json({ error: err.message });
      }
      return res.status(201).json({ id: this.lastID });
    }
  );
});

// Get all users
app.get("/users", (req, res) => {
  db.all(`SELECT * FROM users`, [], (err, rows) => {
    if (err) {
      return res.status(400).json({ error: err.message });
    }
    return res.status(200).json(rows);
  });
});

// Update user route
app.put("/users/:id", (req, res) => {
  const {
    username,
    fullName,
    email,
    companyName,
    password,
    role,
    allowLogin,
    projectUUIDs,
  } = req.body;

  const hashedPassword = bcrypt.hashSync(password, 10);

  db.run(
    `UPDATE users SET username = ?, fullName = ?, email = ?, companyName = ?, password = ?, role = ?, allowLogin = ?, projectUUIDs = ? WHERE id = ?`,
    [
      username,
      fullName,
      email,
      companyName,
      hashedPassword,
      role,
      allowLogin,
      projectUUIDs,
      req.params.id,
    ],
    function (err) {
      if (err) {
        return res.status(400).json({ error: err.message });
      }
      return res.status(200).json({ id: req.params.id });
    }
  );
});
// Login route
app.post("/login", (req, res) => {
  const { username, password } = req.body;

  // Fetch the user data from the database
  db.get("SELECT * FROM users WHERE username = ?", [username], (err, user) => {
    if (err) {
      return res.status(400).json({ error: err.message });
    }

    // If the user doesn't exist or the password is incorrect, return a 401 Unauthorized status
    if (!user || !bcrypt.compareSync(password, user.password)) {
      return res.status(401).json({ error: "Invalid username or password" });
    }

    // If the login is successful, generate a token for the session
    const token = jwt.sign({ id: user.id }, "your_jwt_secret", {
      expiresIn: "1h",
    });

    // Return the user's data and the token
    return res.status(200).json({ ...user, token });
  });
});
// Create the groups table
db.run(
  `CREATE TABLE IF NOT EXISTS groups(
  id TEXT PRIMARY KEY,
  label TEXT,
  children TEXT
)`,
  (err) => {
    if (err) {
      return console.log(err.message);
    }
    console.log("Groups table created");
  }
);

// Create a new group
app.post("/groups", (req, res) => {
  const { id, label, children } = req.body;
  db.run(
    `INSERT INTO groups(id, label, children) VALUES(?, ?, ?)`,
    [id, label, JSON.stringify(children)],
    function (err) {
      if (err) {
        return res.status(400).json({ error: err.message });
      }
      return res.status(201).json({ id: this.lastID });
    }
  );
});
// Get all groups
// Get all groups
app.get("/groups", (req, res) => {
  db.all(`SELECT * FROM groups`, [], (err, rows) => {
    if (err) {
      return res.status(400).json({ error: err.message });
    }

    // Parse the 'children' column from string to JSON
    const groups = rows.map((row) => ({
      ...row,
      children: JSON.parse(row.children),
    }));

    return res.status(200).json(groups);
  });
});

// Update a group
app.put("/groups/:id", (req, res) => {
  const { label, children } = req.body;
  db.run(
    `UPDATE groups SET label = ?, children = ? WHERE id = ?`,
    [label, JSON.stringify(children), req.params.id],
    function (err) {
      if (err) {
        return res.status(400).json({ error: err.message });
      }
      return res.status(200).json({ id: req.params.id });
    }
  );
});

// Delete a group
app.delete("/groups/:id", (req, res) => {
  db.run(`DELETE FROM groups WHERE id = ?`, req.params.id, function (err) {
    if (err) {
      return res.status(400).json({ error: err.message });
    }
    return res.status(200).json({ id: req.params.id });
  });
});

app.listen(port, () => {
  console.log(`App listening at http://localhost:${port}`);
});
