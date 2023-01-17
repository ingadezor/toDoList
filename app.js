const express = require('express');
const bodyParser = require('body-parser');
const date = require(__dirname + "/date.js"); //accessing my own module
const mongoose = require('mongoose');

//-------------------MONGOOSE 
mongoose.connect("mongodb+srv://inga:inga@cluster0.lmpix.mongodb.net/todolistDB?retryWrites=true&w=majority", {useNewUrlParser: true}, () => console.log('connected to mongo'));

let itemSchema = new mongoose.Schema({
    name: String
})

let Item = mongoose.model('Item', itemSchema); //model for Items collection



//setting default items and adding them to our db
let item1 = new Item({
    name: 'Welcome to your to do list!'
});

let item2 = new Item({
    name: 'Hit + to add an item'
});

const defaultItems = [item1, item2];
Item.insertMany(defaultItems, function(err){
    if(err) console.log(err)
    else console.log("Inserted default items in collection");
})

//---------------------------



//let list=[];
//let workList = [];


const app = express();
app.set('view engine', 'ejs'); 
app.use(bodyParser.urlencoded({extended: true}))
app.use(express.static("public")); //letting know that our static files are in public folder




//ROUTES
app.get('/', function(req, res){
    let day = date.getDate(); //using my owm module

    res.render('list', {title: day, list: list});

})


//work todolist
app.get('/work', function(req, res){
    res.render('list', {title: 'Work', list: workList});
})




//getting new listItem 
app.post("/", function(req, res){
    let listType = req.body.button;
    let listItem = req.body.listItem;

    if(listType == 'Work') {
        workList.push(listItem);
        res.redirect('/work');
    }
    else{
        list.push(listItem);
        res.redirect('/');
    }
    
})




app.listen(3000, function(){
    console.log("server is running");
})