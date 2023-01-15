const express = require('express');
const bodyParser = require('body-parser');

let list=[];
let workList = [];


const app = express();
app.set('view engine', 'ejs'); 
app.use(bodyParser.urlencoded({extended: true}))
app.use(express.static("public")); //letting know that our static files are in public folder




//ROUTES
app.get('/', function(req, res){
    let today = new Date();
    let options ={weekday: 'long', day: 'numeric', month: 'long'}
    let day = today.toLocaleDateString('en-US', options);

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