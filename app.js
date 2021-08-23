const express = require("express");
const app = express();
const path = require('path');
// const admin = require("firebase-admin");
// var serviceAccount = require("./planetsandbox-firebase-adminsdk-aikx0-6c56db485a.json");

const PORT = process.env.PORT || 3000;

app.use(express.static(path.resolve("views/")))

app.get('/', function(req, res) {
    res.sendFile(path.join(__dirname, '/views/index.html'));
});

app.get('/img', function(req, res){
    res.send("img");
});

app.get('/img/:name', function(req, res){
    res.sendFile(path.join(__dirname, `views/assets/media/${req.params.name}.png`));
});

app.listen(PORT, () => {
    console.log("running!")
})

// admin.initializeApp({
//     credential: admin.credential.cert(serviceAccount)
// });
