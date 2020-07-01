var name;

var links = [["\"https://maximenodejs.herokuapp.com/\"",        "NodeJS App (Hosted on Heroku)"],
             ["\"/Tetris/TetrisV2.html\"",                      "Tetris version 2"],
             ["\"/Fractales/Fractal.html\"",                    "Fractals"],
             ["\"/WebProject-Trajectory(MC.SS)/trajweb.html\"", "Projet Web Peip2"],
             ["\"/Pathfinder/Pathfinder.html\"",                "Gridless Pathfinder"],
             ["\"/WebGL-Smiley/index.html\"",                   "WebGL Smiley"]
            ]


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
        var style = "\"position: absolute; width: 50%; left: 10%; top:"+ i * 8+"%;\"";
        block.innerHTML = "<a style="+ style +" href="+ links[i][0] +"> "+ links[i][1] +" </a></br>";
        container.appendChild(block);
    }
}

