const express = require ('express');
const bodyParser= require('body-parser');
const app= express();
const sqlite3 = require('sqlite3').verbose();
let sql;
const url = require('url');
app.use(express.json());

const db = new sqlite3.Database('./task.db',sqlite3.OPEN_READWRITE, (err)=>{
    if(err) return console.error(err.message);
});


app.post('/task', (req, res) => {
    
    const requestBody = req?.body;
    if (!requestBody){
        return res.status(400).json({
        status: 400,
        success: false,
        error: "Request body is undefined"
      });
    }
  const { Task, Status } = requestBody;
  if (!Task || !Status){
        return res.status(400).json({
        status: 400,
        success: false,
        error: "Task or Status is not correctly sent"
      });
    }
  sql = `INSERT INTO task(Task, Status) VALUES (?,?)`;
  

db.run(sql, [Task, Status], function (err) {
    if (err) {
      console.error("DB Error:", err);
      return res.status(400).json({
        status: 400, //bad request
        success: false,
        error: err.message
      });
    }
    console.log("Successful input", Task, Status);
    return res.status(201).json({
      status: 201,
      success: true,
    });
  });
});
app.get('/task',(req,res)=>{
    sql=`SELECT * FROM task`;
    try {
        db.all(sql,[],(err,rows)=>{
            if (err) return res.json({ status:500, success:false, error:err});

            if(rows.length<1) return res.json({ status:200, data:rows, success:true});

            return res.json({status:200, data:rows, success:true});
        })
    } catch (error) {
        return res.json({
            status:500,
            success:false,
            message: "server error"
        });
    }
})
app.put('/task/:id',(req,res)=>{   //put only overrides the existing resource, post will create a new resource. we can send multiple request in put and it'll count as a single request but post will create a new resource each time.
    sql=`UPDATE task SET Task=?, Status=? WHERE id= ?`;
    const requestBody = req?.body;
    if (!requestBody){
        return res.status(400).json({
        status: 400,
        success: false,
        error: "Request body is undefined"
      });
    }
  const { Task, Status } = requestBody;
  if (!Task || !Status){
        return res.status(400).json({
        status: 400,
        success: false,
        error: "Task or Status is not correctly sent"
      });
    }
    const id =req.params.id;
    if (!id){
        return res.status(404).json({
            status:404,
            success:false,
            message:"id not found"
        });
    }
    db.run(sql,[Task,Status,id], function (err){
        if (err) {
            console.error("DB Error:", err);
            return res.status(500).json({
                status: 500, //internal server error
                success: false,
                error: "internal server error"
            });
        }
        console.log("updated successfully");
        return res.status(200).json({
            status: 200,
            success: true,
        });

    });
})
app.delete('/task/:id',(req,res)=>{
    sql=`DELETE FROM task WHERE id=?`;
    id=req.params.id;
    if(!id){
        return res.status(404).json({
            status:404,
            success:false,
            message:"id not found"
        });
    }
db.run(sql,[id],function(err){
    if(err){
        console.error("DB Error:", err);
        return res.status(500).json({
            status: 500, //internal server error
            success: false,
            error: err.message
        });

    }

    console.log("Deleted successfully");
    return res.status(200).json({
        status: 200,
        success: true,
    });
})
})
app.listen(3000);