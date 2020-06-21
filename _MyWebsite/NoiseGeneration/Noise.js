"use strict";

var inter;


window.onload = function () {


    var can = document.getElementById("canvas");
    var con = can.getContext("2d");

    inter = setInterval(step, 1000/30);

    //--------------------------------------------------------GLOBAL VARIABLES :
    
    var width = 20;
    var height = 17;
    var elementWidth = (can.width/width);
    var elementHeight = (can.height/height);

    var maxStep = 0.05;
    

    var coefs = new Array(width);
    for (var i=0; i<width; i++){
        coefs[i] = new Array(height);
        for (var j=0; j<height; j++){
            coefs[i][j] = new Object();
            coefs[i][j] = {value:Math.random(), mod:Math.random()};
        }
    }

    //--------------------------------------------------------INITIALIZATION :

    computeValues();
    console.log(coefs);
    //--------------------------------------------------------FUNCTIONS :

    function lerp(){
        
    }


    function computeValues(){
        for (var x=0; x<width; x++){
            for (var y=0; y<height; y++){
                //value is adjacent +- rand*maxStep
                if (x == 0 & y == 0){
                    coefs[x][y].value = Math.random();
                } else if (x == 0){
                    coefs[x][y].value = coefs[x][y-1].value;
                } else if (y == 0){
                    coefs[x][y].value = coefs[x-1][y].value;
                } else if (((Math.random()*x)+(Math.random()*y))%2 == 0){
                    coefs[x][y].value = coefs[x][y-1].value;
                } else {
                    coefs[x][y].value = coefs[x-1][y].value;
                }

                coefs[x][y].value += (coefs[x][y].mod-0.5)*maxStep;


                //clamp
                coefs[x][y].value = (coefs[x][y].value > 1 ? 1 : coefs[x][y].value);
                coefs[x][y].value = (coefs[x][y].value < 0 ? 0 : coefs[x][y].value);
            }
        }
    }

    function displayGroxel(x, y, value){
        //set color
        var color = value*255
        con.fillStyle = "rgb("+color+","+color+","+color+")";
        con.fillRect(x*elementWidth, y*elementHeight, elementWidth, elementHeight);
    }

    function step() {
        for (var x=0; x<width; x++){
            for (var y=0; y<height; y++){
                displayGroxel(x, y, coefs[x][y].value);
            }
        }
        
    }
}