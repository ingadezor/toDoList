const express = require('express');
const bodyParser = require('body-parser');
const date = require(__dirname + "/date.js"); //accessing my own module
const mongoose = require('mongoose');



//-------------------CONNECTION TO MONGOOSE AND ADDING DEFAULT LIST ITEMS TO COLLECTION 
mongoose.connect("mongodb+srv://inga:inga@cluster0.lmpix.mongodb.net/todolistDB?retryWrites=true&w=majority", {useNewUrlParser: true}, () => console.log('connected to mongo'));

let itemSchema = new mongoose.Schema({
    name: String
})
let Item = mongoose.model('Item', itemSchema); //model for Items collection
let WorkItem = mongoose.model('WorkItem', itemSchema);




//setting default items and adding them to our db
let item1 = new Item({
    name: 'Welcome to your to do list!'
});

let item2 = new Item({
    name: 'Hit  +  to add an item'
});

//default items are only included in the main list (not work one)
const defaultItems = [item1, item2];
//-------------------------------------------------------------------------------
//-------------------------------------------------------------------------------



const app = express();
app.set('view engine', 'ejs'); 
app.use(bodyParser.urlencoded({extended: true}))
app.use(express.static("public")); //letting know that our static files are in public folder




//ROUTES
app.get('/', function(req, res){
    let day = date.getDate(); //using my owm module

    Item.find(function(err, items){ //items is an array of all objects in items collection
        //if no items initially in the items collection -> add default items and render list 
        if(items.length === 0){
            Item.insertMany(defaultItems, function(err){
                if(err) console.log(err)
                else console.log("Inserted default items in collection");
            })

            res.redirect('/');
        }
        else res.render('list', {title: day, list: items});
    }) 
})


//work todolist
app.get('/work', function(req, res){

    WorkItem.find(function(err, workItems){
        res.render('list', {title: 'Work', list: workItems});
    })
    
})




//getting new listItem 
app.post("/", function(req, res){
    let listType = req.body.button;
    let listItem = req.body.listItem;



    if(listType == 'Work') {
        //workList.push(listItem);
        let item = new WorkItem({
            name: listItem
        })
        item.save();


        res.redirect('/work');
    }
    else{
        //list.push(listItem);
        //adding item to main list
        let item = new Item({
            name: listItem
        })
        item.save();

        res.redirect('/');
    }
    
})




app.listen(3000, function(){
    console.log("server is running");
})