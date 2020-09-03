//INIT
var WIDTH = window.innerWidth-5;
var HEIGHT = window.innerHeight-5;
var t=0;
var size = 50;

//RENDERER
var renderer = new THREE.WebGLRenderer({antialias:true});
renderer.setSize(WIDTH, HEIGHT);
renderer.setClearColor(0xDDDDDD, 1);
document.body.appendChild(renderer.domElement);

//SCENE
var scene = new THREE.Scene();

//CAMERA
var camera = new THREE.PerspectiveCamera(90, WIDTH/HEIGHT);
scene.add(camera);

//GEOMETRY
var planeMesh = createMesh(size);
planeMesh.scale.set(10,10,10);
planeMesh.material.side = THREE.DoubleSide;
scene.add(planeMesh);
var waves = [];

//LIGHT
var light = new THREE.PointLight(0xFFFF99);
light.position.set(30, 20, 0);
scene.add(light);


//CALL RENDER
function render() {
    requestAnimationFrame(render);
    update();
    renderer.render(scene, camera);
}
render();



addWave(waves, Math.floor(size * Math.random()),  Math.floor(size * Math.random()), 1, 300);        
function update(){
    t+= 0.01;
    updateWaves(waves);
    //updateTerrain(terrain, waves, t);
    //updateColor(terrain);
    
    
    updateVertex();
    
    if (t > 5) {
        addWave(waves, Math.floor(size * Math.random()),  Math.floor(size * Math.random()), 1, 300);
        t = 0;
    }
    camera.rotation.x = -1;
    camera.position.y = 10;
    camera.position.z = 5;
}


window.onresize = scale_back;
function scale_back(){
    WIDTH = window.innerWidth-5;
    HEIGHT = window.innerHeight-5;
    renderer.setSize(WIDTH, HEIGHT);
    camera = new THREE.PerspectiveCamera(90, WIDTH/HEIGHT);
}

function updateVertex(){
    var tmp, value;
    for (var i=0; i<size; i++){
        for (var j=0; j<size; j++){
            value = 0;
            for (var w=0; w<waves.length; w++){
                value += calcWave(waves, w, i, j, t);
            }
            updateVertexHeight(value/20, i, j, planeMesh, size);
        }
    }
    callUpdate(planeMesh);
}