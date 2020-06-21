var renderer, scene, camera, mesh;
var time;
var LBase = 20;
var LEpaule = 50;
var LBiceps = 300;
var LAvantbras = 300;

var AngleBaseEpaule = 0;
var AngleEpauleBiceps = 10;
var AngleBicepsAvantbras = 0;

var CameraAngle = 0;
var CameraHeight = 150;
var CameraRadius = 1000;


init();
updateVars(2);
animate();

/**index 1 means field was modified, 2 means slider was changed */
function updateVars(index){
    if (index == 1){
        //get values from fields
        CameraAngle = document.getElementById("camAngleField").value;
        CameraHeight = document.getElementById("camHeightField").value;
        CameraRadius = document.getElementById("camRadiusField").value;
    }
    if (index == 2) {
        //get values from sliders
        CameraAngle = document.getElementById("camAngle").value;
        CameraHeight = document.getElementById("camHeight").value;
        CameraRadius = document.getElementById("camRadius").value;
        //document.getElementById("camText").innerText = "Angle : " + CameraAngle + ", Height : " + CameraHeight + ", Distance : " + CameraRadius;
    }
    //update all input blocks regardless
    document.getElementById("camAngle").value = CameraAngle;
    document.getElementById("camHeight").value = CameraHeight;
    document.getElementById("camRadius").value = CameraRadius;
    document.getElementById("camAngleField").value = CameraAngle;
    document.getElementById("camHeightField").value = CameraHeight;
    document.getElementById("camRadiusField").value = CameraRadius;

}




function init(){
    // on initialise le moteur de rendu
    renderer = new THREE.WebGLRenderer();
    // si WebGL ne fonctionne pas sur votre navigateur vous pouvez utiliser le moteur de rendu Canvas à la place
    // renderer = new THREE.CanvasRenderer();
    renderer.setSize(window.innerWidth/2, window.innerHeight);
    document.getElementById('container').appendChild(renderer.domElement);
    // on initialise la scène
    scene = new THREE.Scene();
    // on initialise la camera que l’on place ensuite sur la scène
    camera = new THREE.PerspectiveCamera(50, window.innerWidth / window.innerHeight, 1, 10000 );
    camera.position.set(0, 200, 1000);
    scene.add(camera);
    //Light
    var directionalLight = new THREE.DirectionalLight( 0xffffff, 0.5 );
    scene.add( directionalLight );
    
    //init meshArray
    meshArray = new Array();
    time = 0;

    // on créé un  cube au quel on définie un matériau puis on l’ajoute à la scène 
    var matFullRed   = new THREE.MeshBasicMaterial( { color: 0xff0000, wireframe: false } );
    var matFullWhite = new THREE.MeshBasicMaterial( { color: 0xffffff, wireframe: false } );
    var matWireGreen = new THREE.MeshBasicMaterial( { color: 0x005500, wireframe: false } );
    var matWireBlue  = new THREE.MeshBasicMaterial( { color: 0x000077, wireframe: false } );
    var matWireRed  = new THREE.MeshBasicMaterial( { color: 0xee0033, wireframe: false } );
    
    var geoSol = new THREE.CubeGeometry(1000, 5, 1000);
    var geoBase = new THREE.CubeGeometry(200, LBase, 200);
    var geoEpaule = new THREE.CubeGeometry(100, 50, 100);
    var geoBiceps = new THREE.CubeGeometry(30, LBiceps, 30);
    var geoAvantbras = new THREE.CubeGeometry(30, LAvantbras, 30);


    ///INIT les meshs
    mesh = new Array(0);
    mesh[0] = new THREE.Mesh( geoSol, matFullWhite ); //Sol
    mesh[1] = new THREE.Mesh( geoBase, matWireGreen ); //base
    mesh[2] = new THREE.Mesh( geoEpaule, matWireBlue ); //epaule
    mesh[3] = new THREE.Mesh( geoBiceps, matWireRed ); //biceps
    //mesh[4] = new THREE.Mesh( geoAvantbras, matWireBlue ); //avantbras
    for (var i=0; i<mesh.length; i++) scene.add(mesh[i]);
}


////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////







/**Translate angle instructions to arm mesh coordinates */
function moveMesh(){
    //Sol
    mesh[0].position.y = -5;
    //Base, put on y=0
    var VectPosBase = new THREE.Vector3(0, LBase/2, 0);
    var VectBase = new THREE.Vector3(0, LBase, 0);
    mesh[1].position = VectPosBase;
    //Epaule
    var VectAngleEpaule = new THREE.Vector3(0, AngleBaseEpaule, 0);    //vector angle de Epaule
    var VectEpaule = new THREE.Vector3(0, LEpaule, 0); //vector "squelette" de l'epaule, qui le traverse 
    var VectPosEpaule = new THREE.Vector3(); //vector from origin to center
    VectPosEpaule.addVectors(VectPosBase, VectBase.multiplyScalar(0.5)).add(VectEpaule.clone().multiplyScalar(0.5));
    console.log(VectPosEpaule);
    mesh[2].position = VectPosEpaule;
    mesh[2].rotation.setFromVector3(VectAngleEpaule);
    
    
    
    
    /*
    var projected2DRadius = 0.5*LBiceps*Math.cos(AngleEpauleBiceps); //position projetee du centre du biceps sur le plan horizontal intersectant la liaison
    mesh[3].position.x = projected2DRadius*Math.sin(AngleBaseEpaule);
    mesh[3].position.z = projected2DRadius*Math.cos(AngleBaseEpaule);
    mesh[3].position.y = mesh[2].position.y + (0.5*LBiceps*Math.sin(AngleEpauleBiceps));
    mesh[3].rotation.y = mesh[2].rotation.y;
    mesh[3].rotation.x = Math.atan((0.5*LBiceps*Math.sin(AngleEpauleBiceps))/(projected2DRadius*Math.cos(AngleBaseEpaule)));
    mesh[3].rotation.z = Math.atan((0.5*LBiceps*Math.sin(AngleEpauleBiceps))/(projected2DRadius*Math.sin(AngleBaseEpaule)));
    */
}



/**Circle radius 1000, height 200, pointing towards center */
function moveCamera(){
    var radius = CameraRadius;
    var height = CameraHeight;
    var angle = 2*Math.PI*CameraAngle/360;
    camera.position.x = radius*Math.sin(angle);
    camera.position.z = radius*Math.cos(angle);
    camera.position.y = height;
    camera.rotation.y = angle;
}
 

function animate(){
    // on appel la fonction animate() récursivement à chaque frame
    requestAnimationFrame(animate);
    //Camera :
    moveCamera();
    //Mesh
    moveMesh();
    AngleBaseEpaule += 0.01
    
    // on effectue le rendu de la scène
    renderer.render(scene, camera);
    time+=1;
}