const sqlite3 = require('sqlite3').verbose();
const db = new sqlite3.Database('./task.db',sqlite3.OPEN_READWRITE, (err)=>{
    if(err) return console.error(err.message);
});

const sql= `CREATE TABLE task(id INTEGER PRIMARY KEY, Task, Status)`;
db.run(sql);