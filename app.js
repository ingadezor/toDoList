const express = require('express');
const bodyParser = require('body-parser');

let list=[];

const app = express();
app.set('view engine', 'ejs'); 
app.use(bodyParser.urlencoded({extended: true}))


//ROUTES
app.get('/', function(req, res){
    let today = new Date();
    let options ={weekday: 'long', day: 'numeric', month: 'long'}
    let day = today.toLocaleDateString('en-US', options);

    res.render('list', {day: day, list: list});

})


//getting new listItem 
app.post("/", function(req, res){
    let listItem = req.body.listItem;

    //adding item to list
    list.push(listItem);

    res.redirect('/');
    
})




app.listen(3000, function(){
    console.log("server is running");
})