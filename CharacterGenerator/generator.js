"use strict";

var inter;



window.onload = function () {




    //--------------------------------------------------------GLOBAL VARIABLES :


    var can = document.getElementById("canvas");
    var con = can.getContext("2d");
    var input_complexity = document.getElementById("complexity");
    var input_sharpness = document.getElementById("sharpness");
    var input_continuous = document.getElementById("continuous");
    var input_symmetry = document.getElementById("symmetry");
    var drawings;
    var base_seed;
    var seed;
    //inter = setInterval(step, 1000/60);


    //----------------------------------------------------Input


    document.getElementById("generate").onclick = function(){
        base_seed = Math.random()*9999999999;
        generate();
        draw_everything();
    }

    document.getElementById("text").oninput = function(){
        draw_everything();
    }
    
    input_complexity.onchange = function () {generate(); draw_everything();}
    input_sharpness.onchange  = function () {generate(); draw_everything();} 
    input_continuous.onchange = function () {generate(); draw_everything();}
    input_symmetry.onchange   = function () {generate(); draw_everything();}

    
    
    
    //--------------------------------------------------------INITIALIZATION :



    input_complexity.value = 0.5;
    input_continuous.value = 0.5;
    input_sharpness.value = 0.5;
    input_symmetry.value = 0.5;
    base_seed = 1234512345
    seed = base_seed; //10

    //-------random test :
    var randtest = new Array(100);
    for (var i=0; i<100; i++){
        randtest[i] = 0;
    }
    for (var i=0; i<10000; i++){
        var r = getRandom();
        randtest[Math.round(r*100)] += 1;
    }
    console.table(randtest);
    

    generate();
    scale_back();
    draw_everything();

    //--------------------------------------------------------GENERATION FUNCTIONS :

    function generate(){
        seed = base_seed;
        drawings = new Array(26);
        //defaults :
        var comp     = 3;
        var comp_var = 2;
        var sharp    = 1.3;
        var sharp_var= 0;
        var cont     = 1;

        comp *= input_complexity.value;
        //comp_var for later
        sharp *= input_sharpness.value;
        //sharp_var
        cont *= input_continuous.value;



        for (var i=0; i<26; i++){
            //init struct
            drawings[i] = new Array();
            var nb = 1 + (comp + Math.round(getRandom()*comp_var));
            var nextX = getRandom()
            var nextY = getRandom();
            for (var j=0; j<nb; j++){
                //create a stroke
                drawings[i][j] = new Object();
                drawings[i][j].start = [nextX, nextY];
                drawings[i][j].end = [getRandom(), getRandom()];
                //sharpness
                var x = (drawings[i][j].start[0] + drawings[i][j].end[0]) / 2;
                var y = (drawings[i][j].start[1] + drawings[i][j].end[1]) / 2;
                drawings[i][j].bezier = 
                    [x + ((getRandom()-0.5) * sharp),   // * (getRandom()*sharp_var)), 
                     y + ((getRandom()-0.5) * sharp)]; //* (getRandom()*sharp_var))];
                //continuous ?
                nextX = drawings[i][j].end[0] + ((getRandom()-0.5) * cont);
                nextY = drawings[i][j].end[1] + ((getRandom()-0.5) * cont);
            }
        }
    }

    /**uses a seed in [0, 10^10] */
    function getRandom(){
        var r1 = 1 + seed % 83;
        var r2 = 1 + seed % 7;
        var r3 = 1 + seed % 43;
        seed = (seed * r3 / r2 * r1)%9999999999;
        var res = ((r1+r2+r3) / (83+7+43+3)); //gaussian result
        res = res * 10000; //get digits after the 5th one
        res = res - Math.floor(res); //wow it works, amazing !

        
        /* Method 2 : better, still many 0s
        res = res * 10;
        res = 
            (res<3)*0 + 
            (res>7)*1 + 
            ((res>=3)&(res<=7))*((res-3) / 4);
        */

        /* Method 1 : unbalanced, many 0s
        res = (res<=0.25)*(0.5-res) + (res>=0.75)*(1.5-res); //fold between 0.25 and 0.75
        res = res + (res-0.5); //spread between 0 and 1
        */
        //res = ((res>=0)&(res<=1))*res + (res>1); // in case of overshoot
        return res;
    }


    //--------------------------------------------------------DISPLAY FUNCTIONS :

    window.onresize = scale_back;
    function scale_back(){
        can.width = window.innerWidth - 60;
        can.height = window.innerHeight / 2;
        input_complexity.style.width = window.innerWidth/2;
        input_sharpness.style.width  = window.innerWidth/2;
        input_continuous.style.width = window.innerWidth/2;
        input_symmetry.style.width   = window.innerWidth/2;
        draw_everything();
    }

    function draw_everything(){
        clearMap();
        drawAlphabet(20,20,20);
        drawText(20,200,20);
    }

    /**Draws the alphabet at (x,y) */
    function drawAlphabet(x, y, size, spacing = 10){
        for (var i=0; i<26; i++){
            //latin : 
            var px = x + ((spacing+size)*i);
            var py = y;
            drawLatin(i + 65, px, py, size);

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

    function drawLatin(ascii_code, x, y, size){
        con.fillStyle = "black";
        con.font = size + "px Calibri";
        var letter = String.fromCharCode(ascii_code);
        con.fillText(letter, x, y + size);
    }


    function drawText(x, y, size){
        var text = document.getElementById("text").value;
        var px = x;
        var py = y;
        for (var i=0; i<text.length; i++){
            if ((text.charCodeAt(i) >= 65) & (text.charCodeAt(i) <= 90)){
                drawChar(text.charCodeAt(i) - 65, px, py, size);
            } else if ((text.charCodeAt(i) >= 97) & (text.charCodeAt(i) <= 122)){ 
                drawChar(text.charCodeAt(i) - 97, px, py, size);
            } else {
                drawLatin(text.charCodeAt(i), px, py, size)
            }
            px = px + size*1.5;
            if (px > can.width-size){
                px = x;
                py += size*2;
            }
        }
    }

    function clearMap(){
        con.fillStyle = "white";
        con.fillRect(0, 0, can.width, can.height);
    }
}