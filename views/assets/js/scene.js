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

camera.position.set( 10, 5, 10 );
controls.update();

function animate() {
    requestAnimationFrame( animate );
    // required if controls.enableDamping or controls.autoRotate are set to true
    controls.update();
    renderer.render( scene, camera );
}

animate()

// db.collection("planets").get().then((query) => {
//     query.forEach((doc) => {
//         // Get data from DB
//         var planetData = doc.data()

//         // Debug
//         var debugStr = `Adicionando planeta "${planetData.name}"; ID: ${doc.id}`
//         console.log(debugStr)
//         console.log("=".repeat(debugStr.length))
//         console.log(`X: ${planetData.x}\nY: ${planetData.y}\nZ: ${planetData.z}`)
        
//         // Prepare mesh
//         var geometry = new THREE.BoxGeometry( 1, 1, 1 );
//         var material = new THREE.MeshBasicMaterial( { color: 0xffff00 } );
//         var mesh = new THREE.Mesh( geometry, material );

//         // Add to the scene
//         scene.add( mesh );
//         mesh.position.set(planetData.x, planetData.y, planetData.z);
//     })
// })

db.collection("planets").onSnapshot((query) => {
    query.forEach((doc) => {
        // Get data from DB
        var planetData = doc.data()

        // Debug
        var debugStr = `Adicionando planeta "${planetData.name}"; ID: ${doc.id}`
        console.log(debugStr)
        console.log("=".repeat(debugStr.length))
        console.log(`X: ${planetData.x}\nY: ${planetData.y}\nZ: ${planetData.z}`)
         
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
    // const geometry = new THREE.BoxGeometry( 1, 1, 1 );
    // const material = new THREE.MeshBasicMaterial( { color: 0xffff00 } );
    // const mesh = new THREE.Mesh( geometry, material );
    // scene.add( mesh );
    alert("Função indisponível!")
})