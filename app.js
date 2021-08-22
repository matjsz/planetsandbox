const express = require("express");
const app = express();
const path = require('path');
// const admin = require("firebase-admin");
// var serviceAccount = require("./planetsandbox-firebase-adminsdk-aikx0-6c56db485a.json");

const PORT = process.env.PORT || 3000;

app.use(express.static(path.resolve("views/")))

app.use((req, res) => {
    res.send("404")
})

app.get('/', function(req, res) {
    res.sendFile(path.join(__dirname, '/views/index.html'));
});

app.listen(PORT, () => {
    console.log("running!")
})

// admin.initializeApp({
//     credential: admin.credential.cert(serviceAccount)
// });






// var firebaseConfig = {
//     apiKey: "AIzaSyBi6KYmSu8_82aqweJxNQ2UteZ7WhAFh0U",
//     authDomain: "planetsandbox.firebaseapp.com",
//     projectId: "planetsandbox",
//     storageBucket: "planetsandbox.appspot.com",
//     messagingSenderId: "791648424265",
//     appId: "1:791648424265:web:12fd295e189ae076528a98",
//     measurementId: "G-B5RQ7KCFNE"
// };
// // Initialize Firebase
// firebase.initializeApp(firebaseConfig);
// firebase.analytics();
