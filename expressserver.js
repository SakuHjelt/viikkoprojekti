var express = require('express');
var bodyParser = require('body-parser');
var fs = require('fs');
const uuid = require('uuidv4').default;
var app = express();
var cors = require('cors'); 
app.use(cors());
app.use(bodyParser.json());
var entries = [];
var parser = bodyParser.urlencoded({ extended: true });
app.use(express.static('public'));







var router = express.Router();
app.use('/api', router);
router.route('/entries').get((req, res) => {

    res.json(entries);
}).post((req, res) => {
    console.dir(req.body)
    let np = req.body;
    np.id = uuid();
    entries.push(np);
   tallennaEntries();
    console.log("Creating...")
    res.status(201);
    res.json(np);
})
router.route('/entries/:id').get((req, res) => {
    console.log("Single search");
    console.dir(req.params);
    
    for (let p of entries) {
        if (p.id == req.params.id) {
            res.json(p)
            return;
        }
    }
    res.json({ msg: "Not found!" });
}).delete((req, res) => {
    console.log("Delete: " + req.params.id);
    for (let i=0;i<entries.length;i++) {
        if (entries[i].id == req.params.id) {
            entries.splice(i,1);
            res.json({msg:"deleted: "+req.params.id})
            tallennaEntries();
            return;
        }
    }
    res.json({ msg: "Not found" });
})
function tallennaEntries() {
    fs.writeFile("entries.json", JSON.stringify(entries), () => { console.log("Entries Saved") })
}
var server = app.listen(3000, function () {
    var host = server.address().address;
    fs.readFile("entries.json", (err, data) => {
        
        console.log("Read");
        entries = JSON.parse(data);
        console.dir(entries);
    })
    var port = server.address().port
    console.log("Now listening at http://%s:%s", host, port)
})
