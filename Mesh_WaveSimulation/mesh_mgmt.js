

/** creates a square mesh with width-1 faces per side*/
function createMesh(width){
    var tmp;
    var geometry = new THREE.Geometry();
    geometry.verticesNeedUpdate = true;
    geometry.colorsNeedUpdate = true;
    //vertex
    for (var i=0; i<width*width; i++){
        tmp = getXY(i, width);
        geometry.vertices.push(
            new THREE.Vector3(tmp[0], 0, tmp[1])
        );
    }
    //faces
    for (var i=0; i<(width-1)*(width-1); i++){
        tmp = getXY(i, width-1);
        geometry.faces.push(
            new THREE.Face3(i, i+1, i+1+width),
            new THREE.Face3(i, i+1+width, i+width)
        );
    }
    
    geometry.computeVertexNormals();
    geometry.normalize();
    var mesh = new THREE.Mesh(geometry, 
        new THREE.MeshPhongMaterial({color: "rgb(100,100,250)"})
    );
    mesh.geometry.verticesNeedUpdate = true;
    return mesh;
}

/** changes y value of mesh plane*/
function updateVertexHeight(value, x, y, mesh, width){
    var i = getIdx(x, y, width);
    mesh.geometry.vertices[i].y = value;
}


function getIdx(x, y, width){
    return x + (width*y);
}

function getXY(idx, width){
    return [idx%width, Math.floor(idx/width)];
}