const express = require("express");
const app = express();
const path = require('path');

const PORT = process.env.PORT || 3000;

app.use("/js", express.static(__dirname + '/js'));

app.get('/', function(req, res) {
    res.sendFile(path.join(__dirname, '/index.html'));
});

app.listen(PORT, () => {
    console.log("running!")
})