var name;

var links = [
    ["https://maximenodejs.herokuapp.com/",       "NodeJS App (Hosted on Heroku)"                    ],
    ["Tetris/TetrisV2.html",                      "Tetris version 2"                                 ],
    ["Fractales/Fractal.html",                    "Fractals"                                         ],
    ["WebProject-Trajectory(MC.SS)/trajweb.html", "Trajectory simulation (Peip2)"                    ],
    ["Pathfinder/Pathfinder.html",                "Gridless Pathfinder"                              ],
    ["WaveSimulation/index.html"  ,               "WebGL Wave Simulation"                            ],
    ["Mesh_WaveSimulation/index.html"  ,          "WebGL Wave Simulation (single mesh)"              ],
    ["WebGL-Smiley/index.html",                   "WebGL Smiley"                                     ],
    ["/CharacterGenerator/generator.html",         "Procedural Alphabet Generator and text translator"]
];





function askName(){
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
    var container = document.getElementById("container");
    container.innerHTML = "";

    for (var i=0; i<links.length; i++){
        var block = document.createElement("div");
        var a = document.createElement("a");
        var link = document.createTextNode(links[i][1]); 
        a.appendChild(link);
        a.title = links[i][1];
        a.href = links[i][0];
        block.style = "position: absolute; width: 50%; left: 10%; top:"+ i * 8+"%;";
        block.appendChild(a);
        //block.innerHTML = "<a style="+ style +" href="+ links[i][0] +"> "+ links[i][1] +" </a></br>";
        container.appendChild(block);
    }
}



