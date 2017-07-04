let express = require('express'),
    bodyParser = require("body-parser"),
    mongoose = require('mongoose'),
    app = express();
app.use(bodyParser.urlencoded({extended:true}));
app.use(bodyParser.json());
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
res.send("");
});
});
app.get("/", function(req, res){
    res.render('new.ejs');
});
app.get("/delete", function(req, res){
    Owner.find(function (err, owners) {
            if(owners.length == 0)
                res.write("No users");
            else {
                for(let i = 0; i < owners.length; i++)
                    res.write((i + 1) + " " + owners[i]["Owner"] + " " + owners[i]["Appartment"] + " " + owners[i]["Job"] + "<br>");
            }
        });
    res.write("<html>");
    res.write("<head>");
        res.write("<title>Delete</title>");
    res.write("</head>");
    res.write("<body>");
        res.write("<form action=\"/delete\" method=\"post\">");
            res.write("<label for=\"delete_id\">ID</label>");
            res.write("<br>");
            res.write("<input type=\"text\" name = \"delete_id\" id = \"delete_id\">");
            res.write("<br><br>");
           res.write("<button>Send</button>");
        res.write("</form>");
   res.write("</body>");
res.write("</html>");
    //res.send("");
});
app.post("/delete", function(req, res){
    Owner.find(function (err, owners) {
            if(owners.length == 0)
                res.write("No users");
            else {
                        let id = req.body.delete_id - 1;
                        console.log(owners[id]);
                        console.log(req.body.delete_id);
                        Owner.findOneAndRemove({'Appartment' : owners[id]["Appartment"]}, function(owners, err){});
            res.redirect('/delete_success/' + req.body.delete_id);
            }
})});
app.get("/delete_success/:id", function(req, res){
        Owner.find(function (err, owners) {
            if(owners.length == 0)
                res.write("No users");
            else {
                for(let i = 0; i < owners.length; i++)
                    res.write((i + 1) + " " + owners[i]["Owner"] + " " + owners[i]["Appartment"] + " " + owners[i]["Job"] + "<br>");
            }
        });
        res.write("<html>");
    res.write("<head>");
        res.write("<title>Delete</title>");
    res.write("</head>");
    res.write("<body>");
        res.write("<form action=\"/delete\" method=\"post\">");
            res.write("<label for=\"delete_id\">ID</label>");
            res.write("<br>");
            res.write("<input type=\"text\" name = \"delete_id\" id = \"delete_id\">");
            res.write("<br><br>");
           res.write("<button>Send</button>");
        res.write("</form>");
   res.write("</body>");
res.write("</html>");
});
app.listen(8080);