const express = require('express');
const bodyParser = require('body-parser');
const date = require(__dirname + "/date.js"); //accessing my own module
const mongoose = require('mongoose');
const _ = require('lodash');




//-------------------CONNECTION TO MONGOOSE AND ADDING DEFAULT LIST ITEMS TO COLLECTION 
mongoose.connect("mongodb+srv://inga:inga@cluster0.lmpix.mongodb.net/todolistDB?retryWrites=true&w=majority", {useNewUrlParser: true}, () => console.log('connected to mongo'));

let itemSchema = new mongoose.Schema({
    name: String
})
let Item = mongoose.model('Item', itemSchema); //model for Items collection
//let WorkItem = mongoose.model('WorkItem', itemSchema);



//setting default items and adding them to our db
let item1 = new Item({
    name: 'Welcome to your to do list!'
});

let item2 = new Item({
    name: 'Hit  +  to add an item'
});

//default items are only included in the main list (not work one)
const defaultItems = [item1, item2];


const listSchema = new mongoose.Schema({
    name: String,  //list name
    items: [itemSchema]
})
const List = mongoose.model('List', listSchema);  //Lists collection
//-------------------------------------------------------------------------------
//-------------------------------------------------------------------------------





const app = express();
app.set('view engine', 'ejs'); 
app.use(bodyParser.urlencoded({extended: true}))
app.use(express.static("public")); //letting know that our static files are in public folder



//ROUTES
app.get('/', function(req, res){   //works with Items collection (which is Home to do list)
    

    Item.find(function(err, items){ //items is an array of all objects in items collection
        //if no items initially in the items collection -> add default items and render list 
        if(items.length === 0){
            Item.insertMany(defaultItems, function(err){
                if(err) console.log(err)
                else console.log("Inserted default items in collection");
            })

            res.redirect('/');
        }
        else res.render('list', {title: 'Today', list: items});
    }) 
})




app.get('/:customList', function(req, res){
    let listTitle = _.capitalize(req.params.customList);
    
    //check if the list with such title already exists and show it
    List.findOne({name: listTitle}, function(err, foundList){ //foundList is a document
        if(!foundList){ //if no such list yet -> create it
                    
            //will create new list document for each new list with default items
            const list = new List({
                name: listTitle,
                items: defaultItems
            })
            list.save();
            res.redirect('/' + listTitle);
        } 
        else res.render('list', {title: listTitle, list: foundList.items})
    })
})




//getting user input and adding new listItem to list
app.post("/", function(req, res){
    let listType = req.body.button;
    let newListItem = req.body.listItem;

    const item = new Item({
        name: newListItem
    })


    if(listType == 'Today'){ //if user want to add to default list ->
        item.save();  //adding to Items collection
        res.redirect('/');
    }
    else{ //adding item to list specified and displaying it
        List.findOne({name: listType}, function(err, listObj){
            listObj.items.push(item);
            listObj.save();
            res.redirect('/' + listType);
        })
    }    
})


//deleting items from list
app.post("/delete", function(req, res){
    let itemNameToDelete = req.body.checkbox;  //extracting an item to be deleted
    let listType = req.body.listType;
    
    if(listType == 'Today'){
        Item.deleteOne({name: itemNameToDelete}, function(err){ })
        res.redirect('/');
    }
    else{
        List.findOneAndUpdate({name: listType}, {$pull: {items:{name: itemNameToDelete}}}, function(err, listObj){
             if(!err) res.redirect("/" + listType);
        })
    }
    
})






app.listen(3000, function(){
    console.log("server is running");
})