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
    query.forEach((doc) => {
        // Get data from DB
        var planetData = doc.data()

        // Debug
        // var debugStr = `Adicionando planeta "${planetData.name}"; ID: ${doc.id}`
        // console.log(debugStr)
        // console.log("=".repeat(debugStr.length))
        // console.log(`X: ${planetData.x}\nY: ${planetData.y}\nZ: ${planetData.z}`)
         
        // Prepare mesh
        var geometry = new THREE.BoxGeometry( 1, 1, 1 );
        var material = new THREE.MeshBasicMaterial( { color: 0xffff00 } );
        var mesh = new THREE.Mesh( geometry, material );
 
        // Add to the scene
        scene.add( mesh );
        mesh.position.set(planetData.x, planetData.y, planetData.z);
    })
})

document.getElementById("addObjButton").addEventListener("click", function() {
    var planetName = document.getElementById('name').value;
    var planetX = document.getElementById('x').value;
    var planetY = document.getElementById('y').value;
    var planetZ = document.getElementById('z').value;
    var creator = document.getElementById('creator').value;

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
                    creator: creator
                })
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
            var message = `Planet: ${planetData.name}\n\nCoordinates: ${planetData.x}; ${planetData.y}; ${planetData.z}\n\nCreator: ${planetData.creator}`

            alert(message)

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
