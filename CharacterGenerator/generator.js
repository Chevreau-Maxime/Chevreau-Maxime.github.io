"use strict";

var inter;



window.onload = function () {


    //----------------------------------------------------Input



    //--------------------------------------------------------GLOBAL VARIABLES :

    var can = document.getElementById("canvas");
    var con = can.getContext("2d");
    var input_complexity = document.getElementById("complexity");
    var input_sharpness = document.getElementById("sharpness");
    var input_continuous = document.getElementById("continuous");
    var input_symmetry = document.getElementById("symmetry");
    
    //inter = setInterval(step, 1000/60);


    //--------------------------------------------------------INITIALIZATION :

    input_complexity.value = 0;
    input_continuous.value = 0;
    input_sharpness.value = 0;
    input_symmetry.value = 0;

    var letters = new Array(26);
    for (var i=0; i<26; i++){
        letters[i] = String.fromCharCode(i + 65);
    }

    var drawings = new Array(26);


    generate();
    drawAlphabet(20,20,20);

    //--------------------------------------------------------GENERATION FUNCTIONS :

    function generate(){
        for (var i=0; i<26; i++){
            //init struct
            drawings[i] = new Array();
            var nb = 3;
            for (var j=0; j<nb; j++){
                //create a stroke
                drawings[i][j] = new Object();
                drawings[i][j].start = [Math.random(), Math.random()];
                drawings[i][j].end = [Math.random(), Math.random()];
                drawings[i][j].bezier = [Math.random(), Math.random()];
            }
        }
    }


    //--------------------------------------------------------DISPLAY FUNCTIONS :

    /**Draws the alphabet at (x,y) */
    function drawAlphabet(x, y, size, spacing = 10){
        for (var i=0; i<26; i++){
            //latin : 
            var px = x + ((spacing+size)*i);
            var py = y;
            con.fillStyle = "black";
            con.font = size + "px Calibri";
            con.fillText(letters[i], px, py);

            //generated : 
            py = y + size + spacing;
            con.strokeStyle = "black";
            con.lineWidth = 1;
            drawChar(i, px, py, size);
        }
    }

    function drawChar(i, x, y, size){
        con.strokeStyle = "black";
        con.lineWidth = 1;
        con.beginPath();
        for (var j=0; j<drawings[i].length; j++){
            con.moveTo(x + drawings[i][j].start[0]*size, y + drawings[i][j].start[1]*size);
            //con.lineTo(x + drawings[i][j].end[0]*size, y + drawings[i][j].end[1]*size);
            con.quadraticCurveTo(
                x + drawings[i][j].bezier[0]*size, y + drawings[i][j].bezier[1]*size, 
                x + drawings[i][j].end[0]*size, y + drawings[i][j].end[1]*size);

        }
        con.stroke();
        con.closePath();
    }

    /**
     * //SCORE
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
     */



    function clearMap(){
        con.clearRect(0, 0, can.width, can.height);
    }
}