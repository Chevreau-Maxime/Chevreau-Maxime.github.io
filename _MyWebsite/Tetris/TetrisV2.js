"use strict";

var inter;
//**Steps to translate program
// - Display the Blocks
// - Display CurrentBlock
// - Move CurrentBlock per step, with collision feedback
// - Freeze Current, new current
// - Random color, pattern
// - Rotation events

// Score :
//50 points a line
//points = S 50*n dn avec n la nieme ligne
//every 500 points (which is worth a 4 line combo)
//-> ou get a bonus

//Bonus :
//- the block is lava ! surrounding blocks around the current block are melted for 10 points each !
//- Crumble ! the bottom 2 lines are deleted for 15 points per block !

//Hex :
//- the block mutates every update into a new block
//- the block rotates every update
//- some blocks are deleted based on number of adjacent blocks
//- 


window.onload = function () {


    //----------------------------------------------------Input

    var Input = new Object();
    Input.click = new Array(2);
    var Left = false;
    var Right = false;
    var Up = false;
    var Down = false;
    var Shift = false;


    function mouseClick (e) {
        //alert("click at : " + e.clientX + ", " + e.clientY);
        Input.click[0] = e.clientX - 8;
        Input.click[1] = e.clientY - 8;
    }
    window.addEventListener('click', mouseClick, false);




    function inputPress(e) {
        if (e.keyCode == 16) Shift = true;
        if (e.keyCode == 38) {Up = true; rotateCurrent();}
        if (e.keyCode == 37) {Left = true; moveCurrent(-1);}
        if (e.keyCode == 39) {Right = true; moveCurrent(1);}
        if (e.keyCode == 40) Down = true;
    }
    window.addEventListener('keydown', inputPress, false);


    function inputUp(e) {
        if (e.keyCode == 16) Shift = false;        
        if (e.keyCode == 37) Left = false;
        if (e.keyCode == 38) Up = false;
        if (e.keyCode == 39) Right = false;
        if (e.keyCode == 40) Down = false;
    }
    window.addEventListener('keyup', inputUp, false);


    var can = document.getElementById("canvas");
    var con = can.getContext("2d");

    inter = setInterval(step, 1000/60);

    //--------------------------------------------------------GLOBAL VARIABLES :

    //GAME PARAMETERS
    var gameWidth = 10;
    var gameHeight = 25;
    var unitWidth = can.width/gameWidth;
    var unitHeight = can.height/gameHeight;
    var limit = 5;

    //VARIABLES
    var counter = 0;
    var Score = 0;
    var Defeat = 0;

    var Blocks = new Array(gameWidth);
    for (var i=0; i<Blocks.length; i++){
        Blocks[i] = new Array(gameHeight);
        for (var j=0; j<Blocks[i].length; j++){
            Blocks[i][j] = new Object();
            Blocks[i][j] = {state:false, color:"black"};
        }
    }

    var currentBlock = new Object();
    currentBlock = {x:1, y:5, color:"red", parts:[[0, 0], [0, 1], [-1, 0]]};

    //PATTERNS
    var Patterns = new Array();
    Patterns[0] = [[0, 0], [1, 0], [-1, 0], [0, -1]]; //Tribranch
    Patterns[1] = [[0, 0], [0, 1], [1, 1], [1, 0]]; //square
    Patterns[2] = [[0, 0], [-1, 0], [1, 0], [1, 1]]; //L*
    Patterns[3] = [[0, 0], [-1, 0], [1, 0], [-1, 1]]; //L
    Patterns[4] = [[0, 0], [1, 0], [2, 0], [-1, 0]]; //I

    var Colors = new Array();
    Colors = ["red", "blue", "green", "black", "brown", "grey", "orange", "purple"];

    //Textures
    var imageBlock = new Image();
    imageBlock.src = document.getElementById("block").src;
    //imageBlock.src = "textures/block.png"; <- slower
    var backgroundX = 1;
	var imageSky = new Image();
    imageSky.src = document.getElementById("background").src;
    //imageSky.src = "textures/backgroundSeamlessSky2.png"; <- slower
    
    //Text Particles
    var textParticles = new Array(1);
    textParticles[0] = {text:"Welcome !", size:45, color:"black", x:0, y:100, dx:0.7, dy:-3, ddx:0, ddy:0.10};



    //--------------------------------------------------------INITIALIZATION :

    newCurrentBlock();


    //--------------------------------------------------------SIMULATION FUNCTIONS :


    function rotateCurrent(){
        var newParts = new Array(currentBlock.parts.length);
        for (var i=0; i<currentBlock.parts.length; i++){
            newParts[i] = new Array(2);
            newParts[i][0] = -1*currentBlock.parts[i][1];
            newParts[i][1] = currentBlock.parts[i][0];
        }
        //check newParts
        var possible = true;
        for (var i=0; i<newParts.length; i++){
            //borders
            if ((currentBlock.x + newParts[i][0])<0) possible = false;
            if ((currentBlock.x + newParts[i][0])>= gameWidth) possible = false;
            //blocks
            if (Blocks[currentBlock.x + newParts[i][0]]
                    [currentBlock.y + newParts[i][1]].state) possible = false;
        }
        if (possible) currentBlock.parts = newParts;
    }

    /**dir is direction (1 or -1) */
    function moveCurrent(dir){
        //check if possible
        var possible = true;
        for (var i=0; i<currentBlock.parts.length; i++){
            //borders
            if ((currentBlock.x + currentBlock.parts[i][0] + dir)<0) possible = false;
            if ((currentBlock.x + currentBlock.parts[i][0] + dir)>= gameWidth) possible = false;
            //blocks
            if (Blocks[currentBlock.x + currentBlock.parts[i][0] + dir]
                    [currentBlock.y + currentBlock.parts[i][1]].state) possible = false;
        }
        if (possible){
            currentBlock.x += dir;
        }
    }

    function newCurrentBlock(){
        //RANDOM PATTERN
        var r = Math.round(Math.random()*(Patterns.length-1));
        var c = Math.round(Math.random()*(Colors.length-1));
        currentBlock.x = (gameWidth)/2;
        currentBlock.y = 2;
        currentBlock.color = Colors[c];
        currentBlock.parts = Patterns[r].slice();
    }

    function lineCompletion(){
        
        var complete = true;
        var nbOfLines = 0;
        var maxY = 0;
        for (var y=0; y<gameHeight; y++){
            complete = true;
            for (var x=0; x<gameWidth; x++){
                if (!Blocks[x][y].state) complete = false;
            }
            if (complete){
                //alert("line complete");
                //line y is complete
                maxY = y;
                for (var j=y; j>0; j--){
                    for (var i=0; i<gameWidth; i++){
                        Blocks[i][j].state = Blocks[i][j-1].state;
                        Blocks[i][j].color = Blocks[i][j-1].color;
                    }
                }
                nbOfLines += 1;
            }
        }
        //Add to score
        var scoreTable = [0, 50, 150, 300, 500, 1000];
        Score += scoreTable[nbOfLines];
        if (nbOfLines != 0) newTextParticle("+"+scoreTable[nbOfLines]+" pts", 50, "red", 150, maxY*unitHeight, Math.random()*0.5 - 1, 0, 0, -0.15);
    }

    function checkDefeat(minimumY){
        for (var j=0; j<minimumY; j++){
            for (var i=0; i<gameWidth; i++){
                console.log(i + ", " + j);
                if (Blocks[i][j].state){
                    //then a block is above limit
                    Defeat = 1;
                    alert("YOU LOST.");
                }
            }
        }
    }


    function update(){
        //CHECK IF DOWNWARDS COLLISION
        var collision = false;
        for (var i=0; i<currentBlock.parts.length; i++){
            //Check for block collision
            if (currentBlock.y + currentBlock.parts[i][1] + 1 < gameHeight){
                if (Blocks[currentBlock.x + currentBlock.parts[i][0]]
                    [currentBlock.y + currentBlock.parts[i][1] + 1].state){
                collision = true;
                }
            }
            //check for border collision
            if (currentBlock.y + currentBlock.parts[i][1] + 1 == gameHeight){
                collision = true;
            }
        }
        if (collision){
            //FREEZE THE CURRENTBLOCK
            for (var i=0; i<currentBlock.parts.length; i++){
                Blocks[currentBlock.x + currentBlock.parts[i][0]]
                    [currentBlock.y + currentBlock.parts[i][1]].state = true;
                Blocks[currentBlock.x + currentBlock.parts[i][0]]
                    [currentBlock.y + currentBlock.parts[i][1]].color = currentBlock.color;
            }
            //NEW CURRENTBLOCK
            newCurrentBlock();
            //CHECK FOR LINE COMPLETION
            lineCompletion();
            //CHECK FOR DEFEAT
            checkDefeat(limit);
        } else {
            //MOVE THE CURRENTBLOCK
            currentBlock.y += 1;
        }
    }







    //--------------------------------------------------------DISPLAY FUNCTIONS :

    function clearMap(){
        //con.clearRect(0, 0, can.width, can.height);
        dynamicBackground();
    }

    
	
	//draw the dynamic background
	function dynamicBackground(){
        //BACKGROUND
        var newImageWidth = can.height*1000/500;
		con.drawImage(imageSky, backgroundX, 0, newImageWidth, can.height);
		con.drawImage(imageSky, backgroundX+newImageWidth, 0, newImageWidth, can.height);
		backgroundX -= 0.3;
        backgroundX = backgroundX%newImageWidth;
        //TITLE
		con.fillStyle = "black";
        con.font = "40px Calibri Bold";
        con.fillText("- Tetris -", can.width/2-100, 50);
        //SCORE
        con.fillStyle = "black";
        con.font = "40px Calibri Bold";
        con.fillText("SCORE : " + Score, can.width/2-140, 100);
        //LIMIT
        con.beginPath();
        con.moveTo(0, limit*unitHeight);
        con.lineTo(gameWidth*unitWidth, limit*unitHeight);
        con.strokeStyle = "red";
        con.lineWidth = 0.5;
        con.stroke();
        con.closePath();
    }
    
    function newTextParticle(text, size, color, x, y, dx, dy, ddx, ddy){
        var index = textParticles.length;
        textParticles[index] = {text:text, size:size, color:color, x:x, y:y, dx:dx, dy:dy, ddx:ddx, ddy:ddy};
    }

    function drawTextParticles(){
        for (var i=0; i<textParticles.length; i++){
            con.fillStyle = textParticles[i].color;
            con.font = textParticles[i].size + "px Calibri Bold";
            con.fillText(textParticles[i].text, textParticles[i].x, textParticles[i].y);
            textParticles[i].x += textParticles[i].dx;
            textParticles[i].y += textParticles[i].dy;
            textParticles[i].dx += textParticles[i].ddx;
            textParticles[i].dy += textParticles[i].ddy;
            if (textParticles[i].y < 0 || textParticles[i].y > can.height){
                textParticles.splice(i);
            }
        }
    }

    function drawBlocks(){
        //temporarily freeze currentBlock
        for (var i=0; i<currentBlock.parts.length; i++){
            Blocks[currentBlock.x + currentBlock.parts[i][0]]
                [currentBlock.y + currentBlock.parts[i][1]].state = true;
        }

        //display all blocks
        for (var i=0; i<Blocks.length; i++){
            for (var j=Blocks[i].length-1; j>=0; j--){
                if (Blocks[i][j].state){
                    con.drawImage(imageBlock, i*unitWidth, j*unitHeight, unitWidth+5, unitHeight+5);
                    //con.fillStyle = Blocks[i][j].color;
                    //con.fillRect(i*unitWidth, j*unitHeight, unitWidth, unitHeight);
                }
            }
        }

        //unfreeze currentBlock
        for (var i=0; i<currentBlock.parts.length; i++){
            Blocks[currentBlock.x + currentBlock.parts[i][0]]
                [currentBlock.y + currentBlock.parts[i][1]].state = false;
        }
    }

   


    function step() {
        clearMap();
        drawBlocks();
        drawTextParticles();
        counter+=1;
        if (Down) {counter = counter%5;}
        counter = counter%20;
        if (counter == 0) {update();}
    }
}