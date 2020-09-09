var mysql = require('mysql');
const express=require('express');
var app=express();
const bodyparser=require('body-parser');
const e = require('express');
app.use(bodyparser.json())

var con = mysql.createConnection({ //to create connection.
  host: "localhost",
  user: "root",
  password: "password",
  database:'classplus',
  multipleStatements: true //especially for Insert API
});

con.connect(function(err) { //this is a call-back function.
  if (err) console.log(err);
  else console.log("Connected!");
});

app.listen(process.env.PORT||3000, ()=>console.log('Express server is running on Port 3000'));

//To get all transactions from the database
app.get('/transactions/:id',(req,res)=>{
  con.query('select * from transactions where tranid=?',[req.params.id],(err,rows,fields)=>{
    if(!err){
      res.send(rows)
    }
    else{
      console.log(err)
    }
  })
})

//To delete employee from the database.
app.delete('/transactions/:id',(req,res)=>{
  con.query('delete from transactions where tranid=?',[req.params.id],(err,rows,fields)=>{
    if(!err){
      res.send('Deleted Successfully')
    }
    else{
      console.log(err)
    }
  })
})

//To insert employee into the database.
app.post('/transactions',(req,res)=>{
  let tran=req.body
  var sql="set @tranid=?;set @clname=?;set @mode=?; \
  call TransactionAddOrEdit(@tranid,@clname,@mode);"
  con.query(sql,[tran.tranid,tran.clname,tran.mode],(err,rows,fields)=>{
    if(!err){
      rows.forEach(element=>{
        if(element.constructor==Array){
          res.send("Inserted Transaction ID: "+element[0].tranid)
        }
      })
    }
    else{
      console.log(err)
    }
  })
})

//UPDATE employee into the database.
app.put('/transactions',(req,res)=>{
  let tran=req.body
  var sql="set @tranid=?;set @clname=?;set @mode=?; \
  call TransactionAddOrEdit(@tranid,@clname,@mode);"
  con.query(sql,[tran.tranid,tran.clname,tran.mode],(err,rows,fields)=>{
    if(!err){
      res.send('Updated successfully')
    }
    else{
      console.log(err)
    }
  })
})