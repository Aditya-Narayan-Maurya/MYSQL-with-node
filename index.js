const { faker } = require('@faker-js/faker');
const mysql = require('mysql2');
const express=require("express");
const app=express();
const path =require("path");
const methodOverride=require("method-override");
const { v4: uuidv4 } = require('uuid');

app.use(methodOverride("_method"));
app.use(express.urlencoded({extended:true}));
// app.use(express.json());
app.set("view engine","ejs");
app.set("views", path.join(__dirname,"/views"));
const connection = mysql.createConnection({
    host: 'localhost',
    user: 'root',
    database: 'aditya_app',
    password:'mysql@9569150'
  });
  let getRandomUser=()=> {
      return [
        faker.string.uuid(),
        faker.internet.userName(),
        faker.internet.email(),
        faker.internet.password(),
      ];
    };

//Home route
app.get("/",(req,res)=>{
    let q=`SELECT count(*) FROM user`;
    try{
        connection.query(q,(err,result)=>{
            if (err) throw err;
                  let count= result[0]["count(*)"];
                  res.render("home.ejs",{count});
                  
              })
        }catch(err){
            console.log(err);
            res.send("Some error occured");
        }
})

//show user route
app.get("/user",(req,res)=>{
    let q=`SELECT * FROM user`;
    try {
        connection.query(q,(err,users)=>{
            if (err) throw err;
            // console.log(result);
            res.render("showuser.ejs",{users});
        })
    } catch (err) {
        console.log(err);
        res.send("some error occured");      
    }
})

//edit route
app.get("/user/:id/edit",(req,res)=>{
    let {id}=req.params;
    let q=`SELECT * FROM user WHERE id= '${id}'`
    try {
        connection.query(q,(err,result)=>{
            if (err) throw err;
            let user=result[0];
            res.render("edit.ejs",{user});
        })
    } catch (err) {
        console.log(err);
        res.send("some error occured");      
    }
    
})

//update(db) route
app.patch("/user/:id",(req,res)=>{
    let {id}=req.params;
    let {username:newUsername, password :formPassword}=req.body;
    let q=`SELECT * FROM user WHERE id= '${id}'`
    try {
        connection.query(q,(err,result)=>{
            if (err) throw err;
            let user=result[0];
            if (formPassword !=user.password){
               res.send("Wrong pasword");
            }else{
              let q2=`UPDATE user SET username= '${newUsername}' WHERE id='${id}'`;
               connection.query(q2,(err,result)=>{
                 if (err) throw err;
                 res.redirect("/user");
               })
            }
        })
        
    } catch (err) {
        console.log(err);
        res.send("Some error occurred");
    }
})

//new route
app.get("/user/new",(req,res)=>{
    res.render("new.ejs");
})

//Add new user(DB)
app.post("/user/new",(req,res)=>{
    let {username,email,password}=req.body;
    let id=uuidv4();
    let q=`INSERT INTO user (id, username, email, password) VALUES ('${id}','${username}','${email}','${password}')`;
    try {
        connection.query(q,(err,result)=>{
            if (err) throw err;
            console.log(username,email,password);
            console.log("added new user");
            res.redirect("/user");
        })
        
    } catch (err) {
        console.log(err);
        res.send("some error Found");
    }
    // console.log(username,email,password);

})
app.delete("/user/:id/delete",(req,res)=>{

    let q=`DELETE FROM user WHERE id= '${id}'`  
    try {
        
        
    } catch (err) {
        console.log(err);
        res.send("some error occured");        
    }
})

//delete route
app.get("/user/:id/delete",(req,res)=>{
    let {id}= req.params;
    let q=`SELECT * FROM user WHERE id= '${id}'`;
    try {
        connection.query(q,(err,result)=>{
            if (err) throw err;
            let user=result[0];
            res.render("delete.ejs",{user});
        })
        
    } catch (err) {
        console.log(err);
        res.send("some error Found");
    }
})

app.delete("/user/:id",(req,res)=>{
    let {id}= req.params;
    let {password}=req.body;
    let q=`SELECT * FROM user WHERE id= '${id}'`;
    try {
        connection.query(q,(err,result)=>{
            if (err) throw err;
            let user=result[0];
            if (user.password != password) {
                console.log(password);
                res.send("Your password is incorrect");
            } else {
                let q2=`DELETE FROM user WHERE id='${id}'`;
                connection.query(q2,(err,result)=>{
                    if (err) throw err;
                    else{
                        res.redirect("/user");
                        console.log(result);
                    }
                })
            }
        })
    } catch (err) {
        console.log(err);
        res.send("some error Found");
    }
})



app.listen("8080",()=>{
    console.log("app is listening on port 8080");
})

//   let q="INSERT INTO user (id,username,email,password) VALUES ?";
// //   let users= [["123b","123_newuserb","abc@gmail,comb","abdb"], ["123c","123_newuserc","abc@gmail,comc","abdc"]];
// let data=[];
// for (let i = 0; i < 100; i++) {
//     data.push(getRandomUser());
// }
//   try{
//       connection.query(q,[data],(err,result)=>{
//           if (err) throw err;
//           console.log(result);
//       })
//   }catch(err){
//     console.log(err);
//   }
// connection.end();
