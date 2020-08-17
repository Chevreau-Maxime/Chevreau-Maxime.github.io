//INIT
var WIDTH = window.innerWidth;
var HEIGHT = window.innerHeight;
var t=0;

//RENDERER
var renderer = new THREE.WebGLRenderer({antialias:true});
renderer.setSize(WIDTH, HEIGHT);
renderer.setClearColor(0xDDDDDD, 1);
document.body.appendChild(renderer.domElement);

//SCENE
var scene = new THREE.Scene();

//CAMERA
var cam_t = 0;
var cam_angle = 0;
var cam_radius = 120;
var camera = new THREE.PerspectiveCamera(90, WIDTH/HEIGHT);
scene.add(camera);

//GEOMETRY
var boxGeometry = new THREE.BoxGeometry(5, 15, 5);
var basicMaterial = new THREE.MeshLambertMaterial({color: "rgb(100,100,230)"});
/*
var cube = new THREE.Mesh(boxGeometry, basicMaterial);
scene.add(cube);
cube.rotation.set(0.4, 0.2, 0);
cube.position.x = -25;

var torusGeometry = new THREE.TorusGeometry(7, 1, 6, 12);
var phongMaterial = new THREE.MeshPhongMaterial({color: 0xFF9500});
var torus = new THREE.Mesh(torusGeometry, phongMaterial);
scene.add(torus);

var dodecahedronGeometry = new THREE.DodecahedronGeometry(7);
var lambertMaterial = new THREE.MeshLambertMaterial({color: 0xEAEFF2});
var dodecahedron = new THREE.Mesh(dodecahedronGeometry, lambertMaterial);
dodecahedron.position.x = 25;
scene.add(dodecahedron);

*/

var terrain = createTerrain(30, 30, boxGeometry, basicMaterial, scene);
var waves = [];
//addWave(waves, 10, 5, 5, Infinity);

//LIGHT
var light = new THREE.PointLight(0xFFFFFF);
light.position.set(-10, 15, 50);
scene.add(light);



//CALL RENDER
function render() {
    requestAnimationFrame(render);
    update();
    renderer.render(scene, camera);
}
render();
addWave(waves, Math.floor(terrain.w * Math.random()),  Math.floor(terrain.h * Math.random()), 8, 80);


function update(){
    t+= 0.01;
    updateWaves(waves);
    updateTerrain(terrain, waves, t);
    //updateColor(terrain);
    if (t > 5) {
        addWave(waves, Math.floor(terrain.w * Math.random()),  Math.floor(terrain.h * Math.random()), 8, 80);
        t = 0;
    }
    cam_t ++;
    cam_angle = 0.3*Math.sin(0.002*cam_t)
    camera.position.x = Math.sin(cam_angle)*cam_radius;
    camera.position.z = Math.cos(cam_angle)*cam_radius;
    camera.rotation.y = cam_angle;
}


window.onresize = scale_back;
function scale_back(){
    WIDTH = window.innerWidth;
    HEIGHT = window.innerHeight;
    renderer.setSize(WIDTH, HEIGHT);
    camera = new THREE.PerspectiveCamera(90, WIDTH/HEIGHT);
}