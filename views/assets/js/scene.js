import * as THREE from 'https://cdn.skypack.dev/three';
import { OrbitControls } from 'https://cdn.skypack.dev/three/examples/jsm/controls/OrbitControls.js';

firebase.initializeApp({
    apiKey: 'AIzaSyBi6KYmSu8_82aqweJxNQ2UteZ7WhAFh0U',
    authDomain: 'planetsandbox.firebaseapp.com',
    projectId: 'planetsandbox'
});
  
var db = firebase.firestore()

// Renderer
const renderer = new THREE.WebGLRenderer();
renderer.setSize( window.innerWidth, window.innerHeight );
document.body.appendChild( renderer.domElement );

// Fundamentals
const scene = new THREE.Scene();

const camera = new THREE.PerspectiveCamera( 45, window.innerWidth / window.innerHeight, 1, 10000 );

const directionalLight = new THREE.DirectionalLight( 0xffffff, 1 );
scene.add( directionalLight );
directionalLight.position.set(1, 0, 0)

const controls = new OrbitControls( camera, renderer.domElement );
controls.enablePan = false;
controls.enableDamping = true;
controls.autoRotate = true;

camera.position.set(2, 5, 10)
controls.update();

function animate() {
    requestAnimationFrame( animate );
    // required if controls.enableDamping or controls.autoRotate are set to true
    controls.update();
    renderer.render( scene, camera );
}

animate()

db.collection("planets").onSnapshot((query) => {
    query.docChanges().forEach((change) => {
        // Get data from DB
        var planetData = change.doc.data()

        // Debug
        // var debugStr = `Adicionando planeta "${planetData.name}"; ID: ${change.doc.id}`
        // console.log(debugStr)
        // console.log("=".repeat(debugStr.length))
        // console.log(`X: ${planetData.x}\nY: ${planetData.y}\nZ: ${planetData.z}`)

        document.getElementById('allPlanets').innerHTML += `<br>Planet Name: ${planetData.name} - Created by: ${planetData.creator}`
        
        // Prepare mesh
        var geometry = new THREE.SphereGeometry( 1, 32, 15 );
        if(planetData.type == undefined || planetData.type == null){
            var material = new THREE.MeshStandardMaterial( { color: new THREE.Color('rgb(255, 255, 255)') } ); 
        } else{
            var texture = new THREE.TextureLoader().load(`https://https://web-universe.herokuapp.com/img/${planetData.type}`)
            var material = new THREE.MeshStandardMaterial( { map: texture } );
        }
        var mesh = new THREE.Mesh( geometry, material );
        mesh.name = planetData.name

        // Add to the scene
        scene.add( mesh );
        mesh.position.set(planetData.x, planetData.y, planetData.z);
    })
})

document.getElementById("addObjButton").addEventListener("click", function() {
    var planetName = document.getElementById('name').value;
    var planetX = Math.floor(Math.random() * 10000)
    var planetY = Math.floor(Math.random() * 10000)
    var planetZ = Math.floor(Math.random() * 10000)
    var protoType = document.getElementById('type').value;
    var creator = document.getElementById('creator').value;
    var type = ""

    if(protoType == "rock"){
        type = protoType + Math.ceil(Math.random() * 8);
    } else{
        type = protoType + Math.ceil(Math.random() * 4);
    }

    var found = 0;

    db.collection("planets").where("name", "==", planetName)
    .get()
    .then((querySnapshot) => {
        querySnapshot.forEach((doc) => {
            found++;
        }); 

        if(found == 1){
            alert("That name has been taken. Please, insert another.")
            found = 0
        } else{
            if(planetName.length > 0){
                db.collection("planets").add({
                    name: planetName,
                    x: Number(planetX),
                    y: Number(planetY),
                    z: Number(planetZ),
                    type: type,
                    creator: creator
                })

                var message = `Planet: ${planetName} <br> Coordinates: ${planetX}; ${planetY}; ${planetZ} <br> Creator: ${creator} <br>Type: ${type}`

                document.getElementById('planetInfo').innerHTML = message

                camera.position.set(Number(planetX)+2, Number(planetY)+2, Number(planetZ)+2)
                controls.update()
                controls.target.set(Number(planetX), Number(planetY), Number(planetZ))
                controls.update()
            } else{
                alert("Please, insert a correct name for your planet.")
            }
        }
    })
})

document.getElementById("searchPlanet").addEventListener("click", function() {
    var found = 0;

    db.collection("planets").where("name", "==", document.getElementById("searchName").value)
    .get()
    .then((querySnapshot) => {
        querySnapshot.forEach((doc) => {
            var planetData = doc.data()
            found++
            
            // Debug
            // var debugStr = `Procurando planeta "${planetData.name}"; ID: ${doc.id}`
            // console.log(debugStr)
            // console.log("=".repeat(debugStr.length))
            // console.log(`X: ${planetData.x}\nY: ${planetData.y}\nZ: ${planetData.z}`)

            var message = `Planet: ${planetData.name} <br> Coordinates: ${planetData.x}; ${planetData.y}; ${planetData.z} <br> Creator: ${planetData.creator} <br> Type: ${planetData.type}`

            document.getElementById('planetInfo').innerHTML = message

            camera.position.set(planetData.x+2, planetData.y+2, planetData.z+2)
            controls.update()
            controls.target.set(planetData.x, planetData.y, planetData.z)
            controls.update()
        });
        
        if(found == 0){
            alert("This planet doesn't exist.")
        } else{
            found = 0
        }
    })
    .catch((error) => {
        alert(error)
    });
})
