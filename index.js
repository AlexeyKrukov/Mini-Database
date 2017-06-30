let express = require('express'),
    bodyParser = require("body-parser"),
    mongoose = require('mongoose'),
    app = express();
app.use(bodyParser.urlencoded({extended:true}));
app.use(bodyParser.json());
//console.log(mongoose.version);
let db = mongoose.createConnection('mongodb://localhost:27017/House');
db.on("error", console.error.bind(console, "connection error:"));
db.once("open", function callback () {
    console.log("Connected!")
});
let OwnerSchema = new mongoose.Schema({
    Owner: {type: String},
    Appartment: {type: Number, min: 1},
    Job: {type: String}
});
let Owner = db.model("Owner",OwnerSchema);
app.post("/write", function(req, res){
let newOwner = new Owner({ Owner: req.body.owner, Appartment: req.body.house, Job: req.body.job});
newOwner.save(function (err, newOwner) {
    if (err) {
        console.log("Something goes wrong with user " + newOwner.Owner);
    }
    else {
        console.log("Yes");
        }
});
});
app.get("/", function(req, res){
    res.render('new.ejs');
});
app.get("/delete", function(req, res){
    //res.render('delete.ejs');
    Owner.find(function (err, owners) {
        res.send(owners);
        //console.log(owners);
    })
});
app.listen(8080);