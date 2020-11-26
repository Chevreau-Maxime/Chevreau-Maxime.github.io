"use strict";



window.onload = function () {


    //----------------------------------------------------Input

    var Input = new Object();
    //Mouse
    Input.click = new Array(2);
    //Key
    Input.Shift = true;
    Input.Left = true;
    Input.Up = true;
    Input.Right = true;
    Input.Down = true;


    function mouseClick (e) {
        Input.click[0] = e.clientX - 8;
        Input.click[1] = e.clientY - 8;
    } 
    window.addEventListener('click', mouseClick, false);

    function inputPress(e) {
        if (e.keyCode == 16) Input.Shift = true;
        if (e.keyCode == 37) Input.Left = true;
        if (e.keyCode == 38) Input.Up = true;
        if (e.keyCode == 39) Input.Right = true;
        if (e.keyCode == 40) Input.Down = true;
        isMoving = true;
    }
    window.addEventListener('keydown', inputPress, false);

    function inputUp(e) {
        if (e.keyCode == 16) Input.Shift = false;        
        if (e.keyCode == 37) Input.Left = false;
        if (e.keyCode == 38) Input.Up = false;
        if (e.keyCode == 39) Input.Right = false;
        if (e.keyCode == 40) Input.Down = false;
        isMoving = false;
    }
    window.addEventListener('keyup', inputUp, false);
    

    

    //--------------------------------------------------------GLOBAL VARIABLES :
    var can = document.getElementById("canvas");
    var con = can.getContext("2d");
    var inter;
    var isMoving = false;
    var constants = new Object();
    constants.sky = 0;
    

    //-------------------------------------------------------- INITIALIZATION :

    inter = setInterval(step, 1000/40);
    resetCanvas();

    //-------------------------------------------------------- FUNCTIONS :

    window.onresize = function(){
        resetCanvas();
    }

    function resetCanvas(){
        var fill_ratio = 0.9;
        var wh_ratio = 2;
        var w = window.innerWidth*fill_ratio;
        var h = window.innerHeight*fill_ratio;
        if (w > wh_ratio*h){
            can.height = h;
            can.width = wh_ratio*h;
        } else {
            can.width = w;
            can.height = w/wh_ratio;
        }
        can.style.position = "absolute";
        can.style.top = ((1-fill_ratio)/2)*window.innerHeight + "px";
        can.style.left = ((1-fill_ratio)/2)*window.innerWidth + "px";

        constants.char_x = 0.2 * can.width;
        constants.char_h = 0.2 * can.height;
        constants.ground = 0.9 * can.height;
        constants.speed  = 0.005* can.width;
    }

    function move(){
        constants.sky -= constants.speed;
        if (Math.abs(constants.sky) > can.width) constants.sky = 0;
    }



    function step() {
        display(can, con, constants);
        if (isMoving) move();
    }
}