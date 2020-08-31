function createTerrain(w, h, geometry, material, scene){
    var t = new Object();
    t.w = w;
    t.h = h;
    t.cubes = new Array(w*h);
    for (var i=0; i<w*h; i++){
        t.cubes[i] = new THREE.Mesh(geometry, material);
        scene.add(t.cubes[i]);
        t.cubes[i].position.x = -(w*5 /2) + getx(i, w)*5;
        t.cubes[i].position.y = -(h*5 /2) + gety(i, w)*5;
        
    }
    return t;
}

function addWave(waves, x, y, strength, age_limit){
    var index = waves.length;
    waves[index] = {x:x, y:y, str:strength, age:10, age_limit:age_limit};
}

function updateWaves(waves){
    for (var i=0; i<waves.length; i++){
        waves[i].age += 0.05;
        if (waves[i].age >= waves[i].age_limit){
            waves.splice(i, 1);
            i -= 1;
        }
    }
}

function updateTerrain(terrain, waves, t){
    for (var i=0; i<terrain.w*terrain.h; i++){
        var x = getx(i, terrain.w);
        var y = gety(i, terrain.w);
        terrain.cubes[i].position.z = 0; //5*Math.sin(t - getDistance(0, 0, x, y));
        for (var j=0; j<waves.length; j++){
            terrain.cubes[i].position.z += calcWave(waves, j, x, y, t);
        }
    }
}

function updateColor(terrain){
    for (var i=0; i<terrain.w*terrain.h; i++){
        var ratio = (terrain.cubes[i].position.z + 2) / 15;
        terrain.cubes[i].material = new THREE.MeshLambertMaterial({color: lerpColor(ratio)});
    }
}

function getx(i, w){
    return (i%w);
}
function gety(i, w){
    return (Math.floor(i/w))
}
function getDistance(x, y, x2, y2){
    return Math.sqrt( ((x-x2)*(x-x2)) + ((y-y2)*(y-y2)) );
}

function calcWave(waves, j, x, y, t){
    var T = waves[j].age;
    var D = getDistance(waves[j].x, waves[j].y, x, y);
    var A = waves[j].str;

    var value = A * sinc(T - D - 15);
    return value;
}

function sinc(x){
    var res = Math.sin(x) / (x);
    res *= (Math.abs(x) < 2*Math.PI );
    return res
}

function lerpColor(ratio){
    ratio = ratio > 1 ? 1 : ratio;
    ratio = ratio < 0 ? 0 : ratio;
    var r = Math.floor(250 + (ratio * (100 - 250)));
    var g = Math.floor(100 + (ratio * (100 - 100)));
    var b = Math.floor(100 + (ratio * (250 - 100)));
    
    return "rgb("+r+","+g+","+b+")";
}
