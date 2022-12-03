// Initializing
// Express.js
const express = require("express");
const app = express();

// express-fileupload
const fileUpload =require('express-fileupload');
app.use(fileUpload());

// express-session
const session = require('express-session');
app.use(session({
    secret: 'example',
    resave: false,
    saveUninitialized: true
}));

// 'images' folder
app.use(express.static(__dirname + '/images'))

// body-parser
app.use(express.urlencoded({extended:true}));

// EJS
app.engine(".ejs", require("ejs").__express);
app.set("view engine", "ejs");

// database
const DATABASE ="userdata.db";
const db = require("better-sqlite3")(DATABASE);


const fs = require('fs')



//start server
app.listen(3000, function(){
    console.log("listening on 3000")
});



// get requests
app.get("/frontpage", function(req, res){
    res.sendFile(__dirname + "/views/frontpage.html");
});

app.get("/start", function(req, res){
    res.sendFile(__dirname + "/views/start.html");
});

app.get("/invite", function(req, res){
    res.sendFile(__dirname + "/views/invite.html");
});

app.get("/register", function(req, res){
    res.sendFile(__dirname + "/views/register.html");
});

app.get("/signout", function(req, res){
    delete req.session['sessionValue'];
    res.redirect("/frontpage");
});

app.get('/style.css', function(req, res) {
    res.sendFile(__dirname + "/views/" + "styles.css");
  });

app.get("/draw", function(req, res){
    res.sendFile(__dirname + "/views/draw.html");
});



//post requests
app.post("/login", function(req, res){
    const username = req.body.username;
    const password = req.body.password;
    const param_sessionValue = req.body.username;
   
    if (Acc.checkUsername(username) == false){
        if (Acc.checkLogin(username,password) == false){
            res.render("loginError");
        }
    } else { 
        (Acc.checkLogin(username,password) == true)
        res.render("loginSuccess", {"username": username, "password": password});
        req.session.username = param_sessionValue
    } 
});

app.post("/setLobby", function(req, res){
    console.log(req.body);
});


  // processing the upload action
app.post('/onupload', function(req, res) {
    // from http://zhangwenli.com/blog/2015/12/27/upload-canvas-snapshot-to-nodejs/
const dataURL = req.body.img;
var matches = dataURL.match(/^data:.+\/(.+);base64,(.*)$/);
var buffer = new Buffer.from(matches[2], 'base64');
  
    // save canvas to 'images' folder
const testFilename = "Testbild.png" // TODO: der Name muss angepasst und in Datenbank gespeichert werden
fs.writeFile(__dirname + "/images/" + testFilename, buffer, function (err) {
    console.log("done");
    });
});


app.post("/newaccount", function(req, res){
    const username = req.body.username;
    const password = req.body.password;
    const param_sessionValue = req.body.username;

    if (Acc.checkUsername(username) == true){
        res.render("registerError", {"username": username});
    } else {
   Acc.addUser(username, password)
        res.render("registerSuccess", {"username": username, "password": password});
        req.session.username = param_sessionValue
    }
});



// account managment
let usernameData = db.prepare("SELECT username FROM accounts").all();
let passwordData = db.prepare("SELECT password FROM accounts").all();


class AccountManagment {
    checkUsername(usernameInput){
        for (let i = 0; i < usernameData.length; i++) {
            if (usernameData[i].username == usernameInput){
                return true
            }
        }
        return false
    }

    checkLogin(usernameInput, passwordInput){
            for(let i = 0; i < usernameData.length; i++){
                if (usernameData[i].username == usernameInput && passwordData[i].password == passwordInput){
                    return true
                } 
        }
        return false
    }

    addUser(usernameInput, passwordInput){
        usernameData.push({"username":usernameInput})
        passwordData.push({"password":passwordInput})
    }
}

let Acc = new AccountManagment();

const createServer = require('http').createServer;
