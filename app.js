const express = require("express");    //express app paket
const app = express();                //skapa express objekt
const fs = require('fs');             //fs paket fil i/o

app.use(express.static("public"));   //  express hämtar filer i static folder css
app.set("view engine","ejs");    //nu behöver vi inte filändelsen .ejs  anger att alla templates är ejs
app.use(express.urlencoded());   //för att omvandla equest objekt till sträng/array behövs vid post eller body-parser

const MongoClient = require('mongodb').MongoClient;

const url = 'mongodb://localhost:27017';
const client = new MongoClient(url, { useNewUrlParser: true, useUnifiedTopology: true });

let db;

client.connect(function (err) {
     if (err) throw err;
     db = client.db('knowledgebase');
     console.log("Mongo connected")
 });


app.get("/", (req, res) => {
    //res.send("Hello");
    res.send('<html><body><h1>Hello World</h1>👋👋👋</body></html>');
});

app.get("/home", (req, res) => {    //i views
    res.render("home.ejs");     
});
// app.get("/command", (req, res) => {    //i views
//     res.render("command.ejs");     
// });

app.get('/command', (req, res) => {
    const cmdCollection = db.collection('commands');
    cmdCollection.find({}).toArray(function (err, command) {
        res.render('command', {command: command});
    });
});
//app.get('/users', (req, res) => {
// const usersCollection = db.collection('users');
// usersCollection.find({}).toArray(function (err, users) {
//     res.render('users', {users: users});
// });

app.post('/command',function(req,res) {
    const cmdGet = req.body.command;
    console.log(cmdGet);

    const type = req.body.type;
    const command = req.body.command;
    const description = req.body.description;
    const collection = db.collection('commands');
    collection.insertMany([
        { type: type, command: command, description: description }
    ], function (err, result) {
    res.redirect("command");
   
        // res.render('command.ejs', {  command: cmdGet});   //skickar kommandon tillbaka
    });
    
});


app.get('/login',function(req,res) {
    res.render('login.ejs');
});
app.post('/login',function(req,res) {
    const nameGet = req.body.name;
    console.log(nameGet);

    const regard = req.body.regard;
    const name = req.body.name;
    const psw = req.body.psw;
    const collection = db.collection('users');
    collection.insertMany([
        { regard: regard, name: name, psw: psw }
    ], function (err, result) {
        res.render('home.ejs', {  name: nameGet});   //skickar namn till startsida
    });
    
});

app.get('/users', (req, res) => {
    const usersCollection = db.collection('users');
    usersCollection.find({}).toArray(function (err, users) {
        res.render('users', {users: users});
    });
});

app.get("/testFile", (req, res) => {
    const readable = fs.createReadStream("../Node-tour/data/tours-simple.json");
    const out = readable.pipe(res);  //läser in i stream
    console.log(out);
});



const port = "3000";
const hostname = "localhost";
app.listen(port, () => {
    console.log(`App running at http://${hostname}:${port}/`);
});