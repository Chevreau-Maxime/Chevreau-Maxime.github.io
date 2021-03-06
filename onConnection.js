var name;

var links = [
    ["https://maximenodejs.herokuapp.com/",       "NodeJS App (Hosted on Heroku)"                    , "snap_NodeJS.jpg"],
    ["Tetris/TetrisV2.html",                      "Tetris version 2"                                 , "snap_Tetris.jpg"],
    ["Fractales/Fractal.html",                    "Fractals"                                         , "snap_Fractal.jpg"],
    ["WebProject-Trajectory(MC.SS)/trajweb.html", "Trajectory simulation (Peip2)"                    , "snap_Trajectory.jpg"],
    ["Pathfinder/Pathfinder.html",                "Gridless Pathfinder"                              , "snap_Pathfinder.jpg"],
    ["WaveSimulation/index.html"  ,               "WebGL Wave Simulation"                            , "snap_Wave1.jpg"],
    ["Mesh_WaveSimulation/index.html"  ,          "WebGL Wave Simulation (single mesh)"              , "snap_Wave2.jpg"],
    ["WebGL-Smiley/index.html",                   "WebGL Smiley"                                     , "snap_WebGL_smiley.jpg"],
    ["CharacterGenerator/generator.html",         "Procedural Alphabet Generator and text translator", "snap_Generator.jpg"]
];




window.onload = function(){
    spawnInterface();
    //Existing user ?
    name = localStorage.getItem("username");
    if (name == "null"){
        //New User :
        name = prompt("Hello, what is your name ?");
        //Store
        localStorage.setItem("username", name);
    } else {
        //Existing User :
        alert("Welcome back " + name + " !");
    }
}


function spawnInterface(){
    console.log("start spawning html");
    //var container = document.getElementById("container");
    //container.innerHTML = "";

    /*
    for (var i=0; i<links.length; i++){
        var block = document.createElement("div");
        var a = document.createElement("a");
        var link = document.createTextNode(links[i][1]); 
        a.appendChild(link);
        a.title = links[i][1];
        a.href = links[i][0];
        block.style = "position: absolute; width: 50%; left: 10%; top:"+ i * 8 +"%;";
        block.appendChild(a);
        container.appendChild(block);
    }*/
    for (var i=0; i<links.length; i++){
        //div
        var div_resp = document.createElement('div');
        div_resp.className = "responsive";
        //div
        var div_gallery = document.createElement('div');
        div_gallery.className = "gallery";
        //a link
        var a_image = document.createElement('a');
        a_image.target = "_blank";
        a_image.href = links[i][0];
        //image
        var img = document.createElement('img');
        img.src = "Index_Images/" + links[i][2];
        img.width = 400; img.height=400;
        //description
        var desc = document.createElement('div');
        desc.className = "desc";
        desc.innerText = links[i][1];
        //Add all together
        a_image.appendChild(img);
        div_gallery.appendChild(a_image);
        div_gallery.appendChild(desc);
        div_resp.appendChild(div_gallery);
        document.getElementById('body').appendChild(div_resp);
    } 
}



