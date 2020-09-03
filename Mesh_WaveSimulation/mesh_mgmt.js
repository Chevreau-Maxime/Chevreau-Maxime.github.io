

/** creates a square mesh with width-1 faces per side*/
function createMesh(width){
    var tmp;
    var geometry = new THREE.Geometry();
    //vertex
    for (var i=0; i<width*width; i++){
        tmp = getXY(i, width);
        geometry.vertices.push(
            new THREE.Vector3(tmp[0], 0, tmp[1])
        );
    }
    //faces
    for (var i=0; i<width*width; i++){
        tmp = getXY(i, width);
        if ((tmp[0] < width-1) & (tmp[1] < width-1)){
            geometry.faces.push(
                new THREE.Face3(getIdx(tmp[0], tmp[1], width), getIdx(tmp[0]+1, tmp[1], width), getIdx(tmp[0]+1, tmp[1]+1, width)),
                new THREE.Face3(getIdx(tmp[0], tmp[1], width), getIdx(tmp[0]+1, tmp[1]+1, width), getIdx(tmp[0], tmp[1]+1, width))
            );
        }
    }
    
    geometry.computeVertexNormals();
    geometry.normalize();
    var mesh = new THREE.Mesh(geometry, 
        new THREE.MeshPhongMaterial( {color: 0x5555ff, side: THREE.DoubleSide} )
        //new THREE.MeshPhongMaterial();
    );
    return mesh;
}

/** changes y value of mesh plane*/
function updateVertexHeight(value, x, y, mesh, width){
    var i = getIdx(x, y, width);
    mesh.geometry.vertices[i].y = value;
}

function callUpdate(mesh){
    mesh.geometry.verticesNeedUpdate = true;
    mesh.geometry.elementsNeedUpdate = true;
    mesh.geometry.colorsNeedUpdate = true;
    mesh.geometry.computeVertexNormals();
}


function getIdx(x, y, width){
    return x + (width*y);
}

function getXY(idx, width){
    var x = idx;
    while (x >= width) x -= width; 
    return [x, Math.floor(idx/width)];
}

function randomColor(){
    var a = Math.floor(255 * Math.random());
    return "rgb("+a+","+a+","+a+")";
}