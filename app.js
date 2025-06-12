const express = require ('express');
const bodyParser= require('body-parser');
const app= express();
const sqlite3 = require('sqlite3').verbose();
let sql;
const url = require('url');
const db = new sqlite3.Database('./task.db',sqlite3.OPEN_READWRITE, (err)=>{
    if(err) return console.error(err.message);
});

app.use(bodyParser.json());
app.post('/task', (req, res) => {
  const { Task, Status } = req.body;
  sql = `INSERT INTO task(Task, Status) VALUES (?,?)`;

db.run(sql, [Task, Status], function (err) {
    if (err) {
      console.error("DB Error:", err);
      return res.status(500).json({
        status: 300,
        success: false,
        error: err.message
      });
    }

    console.log("Successful input", Task, Status);
    return res.status(201).json({
      status: 200,
      success: true,
    });
  });
});
app.get('/task',(req,res)=>{
    sql=`SELECT * FROM task`;
    try {
        /* const queryObject = url.parse(req.url, true ).query;
        if (queryObject.field && queryObject.type)
            sql +=  `WHERE ${queryObject.field} LIKE '%${queryObject.type}%'`; */
        db.all(sql,[],(err,rows)=>{
            if (err) return res.json({ status:300, success:false, error:err});

            if(rows.length<1) return res.json({ status:300, success:false, error:"no match"});

            return res.json({status:200, data:rows, success:true});
        })
    } catch (error) {
        return res.json({
            status:400,
            success:false,
        });
    }
})
app.put('/task/:id',(req,res)=>{
    sql=`UPDATE task SET Task=?, Status=? WHERE id= ?`;
    const {Task, Status}=req.body;
    const id =req.params.id;
    db.run(sql,[Task,Status,id], function (err){
        if (err) {
            console.error("DB Error:", err);
            return res.status(500).json({
                status: 300,
                success: false,
                error: err.message
            });
        }
        console.log("updated successfully");
        return res.status(201).json({
            status: 200,
            success: true,
        });

    });
})
app.delete('/task/:id',(req,res)=>{
    sql=`DELETE FROM task WHERE id=?`;
db.run(sql,req.params.id, function(err){
    if(err){
        console.error("DB Error:", err);
        return res.status(500).json({
            status: 300,
            success: false,
            error: err.message
        });

    }
    console.log("Deleted successfully");
    return res.status(201).json({
        status: 200,
        success: true,
    });
})
})
app.listen(3000);