// Initialisierung Express.js
const express = require("express");
const app = express();



//Freigabe des /views Ordner
/* app.use(express.static(__dirname + "/views"));
app.get("/kontaktausgabe", function(req,res){
    res.render("kontaktausgabe");
}); */

//Initialisierung express-fileupload
const fileUpload =require('express-fileupload');
app.use(fileUpload());

//Initialisierung von express-session
const session = require('express-session');
app.use(session({
    secret: 'example',
    resave: false,
    saveUninitialized: true
}));

//Initialisierung body-parser
app.use(express.urlencoded({extended:true}));

// Initialisierung von EJS
app.engine(".ejs", require("ejs").__express);
app.set("view engine", "ejs");

// Initialisierung von Datenbank
const DATABASE ="userdata.db";
const db = require("better-sqlite3")(DATABASE);



//Start Server
app.listen(3000, function(){
    console.log("listening on 3000")
});

// Get req
app.get("/frontpage", function(req, res){
    res.sendFile(__dirname + "/views/frontpage.html");
});

app.get("/start", function(req, res){
    res.sendFile(__dirname + "/views/start.html");
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


//POST-Request
app.post("/login", function(req, res){
    const username = req.body.username;
    const password = req.body.password;
    const param_sessionValue = req.body.username;
    
   
    if (Acc.benutzerExistiert(username) == false){
        if (Acc.anmeldungErfolgreich(username,password) == false){
            res.render("loginError");
        }
    } else { 
        (Acc.anmeldungErfolgreich(username,password) == true)
        res.render("loginSuccess", {"username": username, "password": password});
        req.session.username = param_sessionValue
    } 


});



app.post("/newaccount", function(req, res){
    const username = req.body.username;
    const password = req.body.password;
    const param_sessionValue = req.body.username;

    if (Acc.benutzerExistiert(username) == true){
        res.render("registerError", {"username": username});
    } else {
   Acc.benutzerHinzufuegen(username, password)
        res.render("registerSuccess", {"username": username, "password": password});
        req.session.username = param_sessionValue
    }



});




// Benutzerkonten Managment
let usernameData = db.prepare("SELECT username FROM accounts").all();
let passwordData = db.prepare("SELECT password FROM accounts").all();



class Konten {

    benutzerExistiert(usernameInput){
        for (let i = 0; i < usernameData.length; i++) {
            if (usernameData[i].username == usernameInput){
                return true
            }
        }
        return false
    }

    anmeldungErfolgreich(usernameInput, passwordInput){
            for(let i = 0; i < usernameData.length; i++){
                if (usernameData[i].username == usernameInput && passwordData[i].password == passwordInput){
                    return true
                } 
        }
        return false
    }

    benutzerHinzufuegen(usernameInput, passwordInput){
        usernameData.push({"username":usernameInput})
        passwordData.push({"password":passwordInput})
    }
}

let Acc = new Konten();


