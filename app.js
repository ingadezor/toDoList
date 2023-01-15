const express = require('express');
const bodyParser = require('body-parser');
const date = require(__dirname + "/date.js"); //accessing my own module


let list=[];
let workList = [];


const app = express();
app.set('view engine', 'ejs'); 
app.use(bodyParser.urlencoded({extended: true}))
app.use(express.static("public")); //letting know that our static files are in public folder




//ROUTES
app.get('/', function(req, res){
    let day = date.getDate();

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