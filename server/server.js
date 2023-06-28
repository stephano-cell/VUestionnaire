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

app.listen(port, () => {
  console.log(`App listening at http://localhost:${port}`);
});
