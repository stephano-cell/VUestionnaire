const express = require("express");
const sqlite3 = require("sqlite3").verbose();
const bodyParser = require("body-parser");
const cors = require("cors");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const { v4: uuidv4 } = require("uuid");
const app = express();
const port = 3000;
const crypto = require("crypto");
const secretKey = crypto.randomBytes(64).toString("hex");

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
  allowLogin INTEGER
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
  const { username, fullName, email, companyName, password, role, allowLogin } =
    req.body;

  const hashedPassword = bcrypt.hashSync(password, 10);
  const userId = uuidv4();
  db.run(
    `INSERT INTO users(id, username, fullName, email, companyName, password, role, allowLogin) VALUES(?, ?, ?, ?, ?, ?, ?, ?)`,
    [
      userId,
      username,
      fullName,
      email,
      companyName,
      hashedPassword,
      role,
      allowLogin,
    ],
    function (err) {
      if (err) {
        return res.status(400).json({ error: err.message });
      }
      return res.status(201).json({ id: userId }); //
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
  const { username, fullName, email, companyName, password, role, allowLogin } =
    req.body;

  let hashedPassword = null;
  if (password) {
    hashedPassword = bcrypt.hashSync(password, 10);
  }

  db.run(
    `UPDATE users SET username = ?, fullName = ?, email = ?, companyName = ?, password = COALESCE(?, password), role = ?, allowLogin = ? WHERE id = ?`,
    [
      username,
      fullName,
      email,
      companyName,
      hashedPassword,
      role,
      allowLogin,
      req.params.id, // Include the request parameter in the array of values
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
    const token = jwt.sign({ id: user.id }, secretKey, {
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

//Projects

// Create the projects table
db.run(
  `CREATE TABLE IF NOT EXISTS projects (
    id TEXT PRIMARY KEY,
    projectName TEXT,
    company TEXT,
    comment TEXT,
    groups TEXT
  )`,
  (err) => {
    if (err) {
      return console.log(err.message);
    }
    console.log("Projects table created");
  }
);

// Get all users for a project
app.get("/projects/:id/users", (req, res) => {
  const projectId = req.params.id;

  db.all(
    `SELECT users.* FROM users JOIN user_projects ON users.id = user_projects.user_id WHERE user_projects.project_id = ?`,
    [projectId],
    (err, rows) => {
      if (err) {
        return res.status(400).json({ error: err.message });
      }
      return res.status(200).json(rows);
    }
  );
});

// Create a new project
// Create a new project
// Create a new project
app.post("/projects", (req, res) => {
  const { projectName, company, comment, groups } = req.body;

  db.run(
    `INSERT INTO projects(id, projectName, company, comment, groups) VALUES(?, ?, ?, ?, ?)`,
    [uuidv4(), projectName, company, comment, JSON.stringify(groups)],
    function (err) {
      if (err) {
        return res.status(400).json({ error: err.message });
      }
      return res.status(201).json({ id: this.lastID });
    }
  );
});

// Update a project
app.put("/projects/:id", (req, res) => {
  const { projectName, company, comment, groups } = req.body;

  db.run(
    `UPDATE projects SET projectName = ?, company = ?, comment = ?, groups = ? WHERE id = ?`,
    [projectName, company, comment, JSON.stringify(groups), req.params.id],
    function (err) {
      if (err) {
        return res.status(400).json({ error: err.message });
      }
      return res.status(200).json({ id: req.params.id });
    }
  );
});

// Get all projects
app.get("/projects", (req, res) => {
  db.all(`SELECT * FROM projects`, [], (err, rows) => {
    if (err) {
      return res.status(400).json({ error: err.message });
    }

    // Parse the 'groups' column from string to JSON
    const projects = rows.map((row) => ({
      ...row,
      groups: JSON.parse(row.groups),
    }));

    return res.status(200).json(projects);
  });
});

// Create the user_projects table
db.run(
  `CREATE TABLE IF NOT EXISTS user_projects (
    user_id TEXT,
    project_id TEXT,
    PRIMARY KEY(user_id, project_id),
    FOREIGN KEY(user_id) REFERENCES users(id),
    FOREIGN KEY(project_id) REFERENCES projects(id)
  )`,
  (err) => {
    if (err) {
      return console.log(err.message);
    }
    console.log("User_Projects table created");
  }
);
// Assign a user to a project// Assign a user to a project
app.post("/assign", (req, res) => {
  const { userId, projectId } = req.body;

  db.run(
    `INSERT INTO user_projects(user_id, project_id) VALUES(?, ?)`,
    [userId, projectId],
    function (err) {
      if (err) {
        return res.status(400).json({ error: err.message });
      }
      return res.status(201).json({ userId, projectId });
    }
  );
});

// Get all projects for a user
app.get("/users/:id/projects", (req, res) => {
  const userId = req.params.id;

  db.all(
    `SELECT projects.* FROM projects JOIN user_projects ON projects.id = user_projects.project_id WHERE user_projects.user_id = ?`,
    [userId],
    (err, rows) => {
      if (err) {
        return res.status(400).json({ error: err.message });
      }
      return res.status(200).json(rows);
    }
  );
});
// Update user's projects
app.put("/users/:userId/projects", (req, res) => {
  console.log(req.body); // Log the entire request body
  const userId = req.params.userId;
  const { projects } = req.body; // This should be an array of project IDs
  console.log(projects); // Log the projects array

  // First, remove all existing projects for the user
  db.run(
    `DELETE FROM user_projects WHERE user_id = ?`,
    [userId],
    function (err) {
      if (err) {
        console.error("Error deleting user projects:", err);
        return res.status(400).json({ error: err.message });
      }

      // Then, add the new projects
      const placeholders = projects.map(() => "(?, ?)").join(", ");
      const values = projects.flatMap((projectId) => [userId, projectId]);

      db.run(
        `INSERT INTO user_projects(user_id, project_id) VALUES ${placeholders}`,
        values,
        function (err) {
          if (err) {
            return res.status(400).json({ error: err.message });
          }
          return res.status(200).json({ userId, projects });
        }
      );
    }
  );
});

app.listen(port, () => {
  console.log(`App listening at http://localhost:${port}`);
});
