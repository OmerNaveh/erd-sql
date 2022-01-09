const express = require("express");
const mysql = require("mysql2");
const { nanoid } = require("nanoid");

// Should be kept as environment variable
const mysqlConfig = {
  host: process.env.MYSQL_HOST || "mysql_server",
  user: process.env.MYSQL_USER || "student",
  password: process.env.MYSQL_PASSWORD || "secret",
  database: process.env.MYSQL_DATABASE || "test_db",
  multipleStatements: true,
};

const port = process.env.PORT || 3000;

// Connecting to mysql container
const con = mysql.createConnection(mysqlConfig);
con.connect(function (err) {
  if (err) throw err;
  console.log("connected");
});

const app = express();
app.use(express.json());
// testing server
app.get("/", function (req, res) {
  res.send("Testing my server");
});

//  Creating tables
app.get("/create-tables", function (req, res) {
  const sql = `
-- Table subjects
-- -----------------------------------------------------
CREATE TABLE IF NOT EXISTS subjects (
  name VARCHAR(45) NOT NULL,
  PRIMARY KEY (name))
ENGINE = InnoDB;
-- -----------------------------------------------------
-- Table teachers
-- -----------------------------------------------------
CREATE TABLE IF NOT EXISTS teachers (
  teacher_id VARCHAR(45),
  name VARCHAR(45) NOT NULL,
  age INT NULL,
  subjects_name VARCHAR(45),
  PRIMARY KEY (teacher_id),
    FOREIGN KEY (subjects_name)
    REFERENCES subjects (name)
  )
ENGINE = InnoDB;
-- -----------------------------------------------------
-- Table classes
-- -----------------------------------------------------
CREATE TABLE IF NOT EXISTS classes (
  class_id VARCHAR(45),
  name VARCHAR(45) NULL,
  PRIMARY KEY (class_id))
ENGINE = InnoDB;
-- -----------------------------------------------------
-- Table pupils
-- -----------------------------------------------------
CREATE TABLE IF NOT EXISTS pupils (
  pupil_id VARCHAR(45),
  name VARCHAR(45) NOT NULL,
  age INT NULL,
  subjects_name VARCHAR(45),
  class_id VARCHAR(45),
  PRIMARY KEY (pupil_id),
    FOREIGN KEY (subjects_name)
    REFERENCES subjects (name),
    FOREIGN KEY (class_id)
    REFERENCES classes (class_id)
  )
ENGINE = InnoDB;
  `;
  con.query(sql, function (err, result) {
    if (err) throw err;
    res.send("all tables created");
  });
});
// get by requests
app.get("/pupil/:id", (req, res) => {
  const { id } = req.params;
  const sql = `SELECT * FROM pupils WHERE pupil_id = "${id}"`;
  con.query(sql, function (err, result, fields) {
    console.log(result);
    if (err) throw err;
    res.send(JSON.stringify(result));
  });
});
app.get("/teacher/:id", (req, res) => {
  const { id } = req.params;
  const sql = `SELECT * FROM teachers WHERE teacher_id = "${id}"`;
  con.query(sql, function (err, result, fields) {
    console.log(result);
    if (err) throw err;
    res.send(JSON.stringify(result));
  });
});
app.get("/subject/:name", (req, res) => {
  const { name } = req.params;
  const sql = `SELECT * FROM subjects WHERE name = "${name}"`;
  con.query(sql, function (err, result, fields) {
    console.log(result);
    if (err) throw err;
    res.send(JSON.stringify(result));
  });
});
app.get("/class/:id", (req, res) => {
  const { id } = req.params;
  const sql = `SELECT * FROM classes WHERE class_id = "${id}"`;
  con.query(sql, function (err, result, fields) {
    console.log(result);
    if (err) throw err;
    res.send(JSON.stringify(result));
  });
});
// creation requests
app.post("/new/pupil", (req, res) => {
  const { name, subjects_Name, age, class_id } = req.body;
  const id = nanoid();
  con.query(
    `INSERT INTO pupils(pupil_id,name,age,subjects_name,class_id) VALUES("${id}", "${name}", ${age}, "${subjects_Name}", "${class_id}")`,
    (err, result) => {
      if (err) throw err;
      res.send(JSON.stringify(result));
    }
  );
});
app.post("/new/subject", (req, res) => {
  const { name } = req.body;
  con.query(`INSERT INTO subjects VALUES("${name}")`, (err, result) => {
    if (err) throw err;
    res.send(JSON.stringify(result));
  });
});
app.post("/new/class", (req, res) => {
  const { name } = req.body;
  const id = nanoid();
  con.query(
    `INSERT INTO classes(class_id,name) VALUES("${id}","${name}")`,
    (err, result) => {
      if (err) throw err;
      res.send(JSON.stringify(result));
    }
  );
});
app.post("/new/teacher", (req, res) => {
  const { name, subject_name, age } = req.body;
  const id = nanoid();
  con.query(
    `INSERT INTO teachers(teacher_id,name ,age,subjects_name) VALUES("${id}","${name}",${age},"${subject_name}")`,
    (err, result) => {
      if (err) throw err;
      res.send(JSON.stringify(result));
    }
  );
});
// update requests
app.put("/update/pupil/:pupilId", (req, res) => {
  const { pupilId } = req.params;
  const { subjects_Name, age, class_id } = req.body;
  con.query(
    `UPDATE pupils SET age=${age}, class_id="${class_id}", subjects_name = "${subjects_Name}" 
    WHERE pupil_id = "${pupilId}"`,
    (err, result) => {
      if (err) throw err;
      res.send(`Updated ${pupilId} Successfully!`);
    }
  );
});
app.put("/update/teacher/:teacherId", (req, res) => {
  const { teacherId } = req.params;
  const { age, subjects_name } = req.body;
  con.query(
    `UPDATE teachers SET age=${age}, subjects_name = "${subjects_name}" 
      WHERE teacher_id = "${teacherId}"`,
    (err, result) => {
      if (err) throw err;
      res.send(`Updated ${teacherId} Successfully!`);
    }
  );
});
app.put("/update/class/:classId", (req, res) => {
  const { classId } = req.params;
  const { name } = req.body;
  con.query(
    `UPDATE classes SET name="${name}" 
        WHERE class_id = "${classId}"`,
    (err, result) => {
      if (err) throw err;
      res.send(`Updated ${classId} Successfully!`);
    }
  );
});

//delete requests
app.delete("/remove/pupil/:pupilId", (req, res) => {
  const { pupilId } = req.params;
  con.query(
    `DELETE FROM pupils WHERE pupil_id = "${pupilId}"`,
    (err, result) => {
      if (err) throw err;
      res.send(`Deleted ${pupilId} Successfully!`);
    }
  );
});
app.delete("/remove/teacher/:teacherId", (req, res) => {
  const { teacherId } = req.params;
  con.query(
    `DELETE FROM teachers WHERE teacher_id = "${teacherId}"`,
    (err, result) => {
      if (err) throw err;
      res.send(`Deleted ${teacherId} Successfully!`);
    }
  );
});
app.delete("/remove/class/:classId", (req, res) => {
  const { classId } = req.params;
  con.query(
    `DELETE FROM classes WHERE class_id = "${classId}"`,
    (err, result) => {
      if (err) throw err;
      res.send(`Deleted ${classId} Successfully!`);
    }
  );
});
app.delete("/remove/subject/:subjectName", (req, res) => {
  const { subjectName } = req.params;
  con.query(
    `DELETE FROM subjects WHERE name = "${subjectName}"`,
    (err, result) => {
      if (err) throw err;
      res.send(`Deleted ${subjectName} Successfully!`);
    }
  );
});
// Fetching all
app.get("/fetch", function (req, res) {
  const sql = `SELECT * FROM subjects; SELECT * FROM pupils; SELECT * FROM teachers; SELECT * FROM classes;`;
  con.query(sql, function (err, result, fields) {
    console.log(result);
    if (err) throw err;
    res.send(JSON.stringify(result));
  });
});
app.listen(port, () => {
  console.log(`running on ${port}`);
});
