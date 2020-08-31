//INIT
var WIDTH = window.innerWidth;
var HEIGHT = window.innerHeight;
var t=0;
var size = 10;

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
scene.add(planeMesh);
var waves = [];

//LIGHT
var light = new THREE.PointLight(0xFFFFFF);
light.position.set(0, 50, 0);
scene.add(light);



//CALL RENDER
function render() {
    requestAnimationFrame(render);
    update();
    renderer.render(scene, camera);
}
render();



addWave(waves, Math.floor(size * Math.random()),  Math.floor(size * Math.random()), 1, 80);        
function update(){
    t+= 0.01;
    updateWaves(waves);
    //updateTerrain(terrain, waves, t);
    //updateColor(terrain);
    
    
    updateVertex();
    
    if (t > 5) {
        addWave(waves, Math.floor(size * Math.random()),  Math.floor(size * Math.random()), 1, 80);
        t = 0;
    }
    camera.rotation.x = -3.10/2;
    camera.position.y = 10;
}


window.onresize = scale_back;
function scale_back(){
    WIDTH = window.innerWidth;
    HEIGHT = window.innerHeight;
    renderer.setSize(WIDTH, HEIGHT);
    camera = new THREE.PerspectiveCamera(90, WIDTH/HEIGHT);
}

function updateVertex(){
    planeMesh.geometry.verticesNeedUpdate = true;
    planeMesh.geometry.facecNeedUpdate = true;
    var tmp, value;
    for (var i=0; i<size; i++){
        for (var j=0; j<size; j++){
            value = 0;
            for (var w=0; w<waves.length; w++){
                value += calcWave(waves, w, i, j, t);
            }
            updateVertexHeight(value/10, i, j, planeMesh, size);
        }
    }
}