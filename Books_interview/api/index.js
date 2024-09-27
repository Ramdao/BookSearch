const sqlite3 = require('sqlite3').verbose();
let sql;
var express = require('express');
var cors = require('cors');
var app = express();
app.use(cors());
app.use(express.json());
const fs = require('fs');
const PORT = 5000;

//sql stuff
const db = new sqlite3.Database("C:\\Users\\radin\\OneDrive\\Desktop\\githubprojects\\BookSearch\\Books_interview\\api\\inventory.db", sqlite3.OPEN_READWRITE, (err) => {
    if (err) return console.error(err.message);
});
sql = 'CREATE TABLE inventory(id INTEGER PRIMARY KEY,title TEXT,author TEXT,genre TEXT,publication_date DATE,ISBN TEXT)';
db.run(sql, [], (err) => {
    if (err) return console.error(err.message);
});

/*
sql = 'INSERT INTO inventory (title,author,genre,publication_date,ISBN) VALUES (?,?,?,?,?)';
db.run(sql, ["Harry Potter", "Jk", "fantasy", "2008-11-11", "123-123-123-123"], (err) => {
    if (err) return console.error(err.message);
});
*/
sql = 'SELECT * FROM inventory';
db.all(sql, [], (err, rows) => {
    if (err) return console.error(err.message);
    rows.forEach((row) => {

        console.log(row);
    });
});

app.listen(PORT, () => console.log("http://localhost:5000"));

app.get('/book', (req, res) => {
    const sql = "SELECT * FROM inventory";
    db.all(sql, [], (err, rows) => {
        if (err) {
            return res.status(500).json({ error: err.message });
        }
        res.status(200).json(rows);
    });
});

app.post('/addbook', (req, res) => {
    const data = req.body;
    const title = data.title
    const author = data.author; 
    const genre = data.genre;
    const publication_date= data.publication_date;
    const ISBN = data.ISBN;
    sql = 'INSERT INTO inventory (title,author,genre,publication_date,ISBN) VALUES (?,?,?,?,?)';
    db.run(sql, [title,author,genre,publication_date,ISBN], (err) => {
    if (err) return console.error(err.message);
    });

});

app.get('/JSON', (req, res) => {
    const sql = "SELECT * FROM inventory";

    db.all(sql, [], (err, rows) => {
        if (err) {
            return res.status(500).json({ error: err.message });
        }
        res.status(200).json(rows);

        const JsonData = JSON.stringify(rows, null, 2); 
        try {
            fs.writeFileSync('export.json', JsonData);
            console.log("Data successfully written to 'export.json'");
        } catch (error) {
            console.error("Error writing to file:", error);
        }
    });
});

app.post('/filter', (req, res) => {
    const filter = req.body.filter; 
    const value = req.body.value; 

    
    const search = `SELECT * FROM inventory WHERE ${filter} = ?`; 

    db.all(search, [value], (err, rows) => {
        if (err) {
            return res.status(500).json({ error: err.message });
        }

        if (rows.length > 0) {
            res.status(200).json(rows);  
        } else {
            res.status(200).json([]);  
        }
    });
});