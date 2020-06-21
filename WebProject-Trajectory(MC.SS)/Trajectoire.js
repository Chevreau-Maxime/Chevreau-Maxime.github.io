"use strict";
var inter;

var currentLevel= 0;

function endGame (){
    //erase canvas
    document.getElementById("canvas").getContext("2d").
    clearRect(0, 0, document.getElementById("canvas").width, document.getElementById("canvas").height);
    //stop function calling
    clearInterval(inter);
}

function Play (level) {

    //----------------------------------------------------Input

    var Left = false;
    var Right = false;
    var Up = false;
    var Down = false;
    var Shift = false;

    function inputPress(e) {
        if (e.keyCode == 16) Shift = true;
        if (e.keyCode == 37) Left = true;
        if (e.keyCode == 38) Up = true;
        if (e.keyCode == 39) Right = true;
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

    //--------------------------------------------------------Basic Canvas Setup

    var can = document.getElementById("canvas");
    var con = can.getContext("2d");

    clearInterval(inter);
    clearInterval(interval);
    inter = setInterval(step, 1000/60);
    
    hideInterface();

    //----------------------------------------------------------------------------------------
    //---------------------------------------------------------------------- Variables:
    //----------------------------------------------------------------------------------------
    var preparationMode = true;
    var shootDirection = Math.PI*1.5;
    var shootStrength = 0;
    var gravityConst = 0.1;
    var framesSinceLaunch = 0;

    var backgroundImage = new Image();
    var wallTexture = new Image();
    wallTexture.src = "brickTexture.png";

    //------------------------------------------------------------------------
    //-------------------------------------------- Object Generic Definition :
    //------------------------------------------------------------------------
    var Projectile = new Object();
    /**Projectile :
     * x, y coordinates
     * dx, dy speed components
     */
    var Objective = new Object();
    /**Objective :
     * x, y coordinates
     * w and h for 2d size
     */
    var Magnets = new Array();
    /**Magnets :
     * x, y coordinates
     * strength, range, pulse caracteristics
     */
    var Walls = new Array();
    /**Walls :
     * x, y coordinates
     * collisionCoef, w, h caracteristics
     */
    var Trampo = new Array();
    /**Trampo :
     * xp1, yp1 coordinates of left point
     * xp2, yp2 for right point
     * xd, yd for control point coordinates
     * actif, the current state
     */
    var Ventilators = new Array();
    /**Ventilators :
     * x, y coordinates
     * direction, range, width for area of effect definition
     * strength for... strength :)
     */

    
    //-----------------------------------------------------Projectile
    Projectile.x = 30; 
    Projectile.y = can.height - 30;
    Projectile.dx = 0;
    Projectile.dy = 0;
    Projectile.radius = 10;
    if (document.getElementById("projectile").value == "liege"){
        Projectile.color = "rgb(177, 147, 83)";
        Projectile.collisionCoef = 0.7;
        Projectile.mass = 1;
    } else if (document.getElementById("projectile").value == "caoutchouc"){
        Projectile.color = "black";
        Projectile.collisionCoef = 0.9;
        Projectile.mass = 2;
    } else if (document.getElementById("projectile").value == "fer"){
        Projectile.color = "grey";
        Projectile.collisionCoef = 0.2;
        Projectile.mass = 6;
    } else {
        Projectile.color = "blue";
        Projectile.collisionCoef = 1;
        Projectile.mass = 1;
    }

    //-----------------------------------------------------Objective
    Objective.x = can.width - 50;
    Objective.y = can.height/2 - 40;
    Objective.w = 40;
    Objective.h = 80;


    //-------------------------------------------------------------------------------
    //-------------------------------------------- Object Level Specific Definition :
    //-------------------------------------------------------------------------------
    //define all obstacles and projectile caracteristics for this level
    //   /!\ -1 -> restart and -2 continue
    if (level == -1){
        level = currentLevel;
    }
    if (level == -2){
        level = currentLevel+1;
    }
    if (level > 7){
        level = 7;
    }
    currentLevel = level;



    if (level == 1){
        //TUTORIAL : sky background, no obstacle, high path prediction
        backgroundImage.src = "backgroundSky.png";


    } else if (level == 2){
        //Wall demonstration
        backgroundImage.src = "backgroundPlains.png";
        Walls = new Array(5);
        Walls[0] = {x:can.width/2-100, y:can.height/2, w:100, h:100, collisionCoef:1};
        Walls[1] = {x:can.width/2-150, y:can.height/2-100, w:100, h:100, collisionCoef:1};
        Walls[2] = {x:can.width/2+100, y:can.height/2-200, w:100, h:100, collisionCoef:1};
        Walls[3] = {x:can.width/2+200, y:can.height/2+150, w:100, h:100, collisionCoef:1};
        Walls[4] = {x:100, y:100, w:150, h:75, collisionCoef:1};


    } else if (level == 3){
        //Ventilator demonstration
        backgroundImage.src = "backgroundSky.png";
        Ventilators = new Array(3);
        Ventilators[0] = {x:600, y:can.height-40, direction:Math.PI*1.65, range:300, width:60, strength:10};
        Ventilators[1] = {x:400, y:can.height-50, direction:Math.PI*1.51, range:450, width:100, strength:30};
        Ventilators[2] = {x:100, y:50, direction:Math.PI*0.3, range:350, width:40, strength:20};


    } else if (level == 4){
        //Trampo demonstration
        backgroundImage.src = "backgroundSky.png";
        Trampo = new Array(3);
        Trampo[0] = {xp1:200, xp2:300, yp1:300, yp2:300, xd:250, yd:300, actif:false};
        Trampo[1] = {xp1:400, xp2:500, yp1:300, yp2:300, xd:450, yd:300, actif:false};
        Trampo[2] = {xp1:700, xp2:950, yp1:400, yp2:400, xd:650, yd:400, actif:false};
        Trampo[3] = {xp1:600, xp2:700, yp1:150, yp2:150, xd:650, yd:170, actif:false};

    } else if (level == 5){
        //Magnet demonstration
        backgroundImage.src = "backgroundSky.png";        
        Magnets = new Array(3);
        Magnets[0] = {x:can.width/2+100, y:can.height/2, strength:20, range:150};
        Magnets[1] = {x:can.width/2-150, y:can.height/2+50, strength:40, range:250};
        Magnets[2] = {x:can.width/2+300, y:can.height/2+100, strength:-30, range:100};
        


    } else if (level == 6){
        //Real level demonstration
        backgroundImage.src = "backgroundSky.png";        
        Magnets = new Array(2);
        Magnets[0] = {x:can.width/2, y:can.height/2 +100, strength:30, range:150};
        Magnets[1] = {x:200, y:200, strength:-30, range:150};
        Walls = new Array(1);
        Walls[0] = {x:can.width/2 - 50, y:can.height/2 + 150, w:100, h:100, collisionCoef:1};
        Trampo = new Array(1);
        Trampo[0] = {xp1:700, xp2:900, yp1:350, yp2:350, xd:750, yd:350, actif:false};
        Ventilators = new Array(1);
        Ventilators[0] = {x:600, y:40, direction:Math.PI*0.7, range:300, width:60, strength:35};

    } else if (level==7){
        //Space level demonstration
        backgroundImage.src = "backgroundSpace.png"; 
        gravityConst = 0;
        Projectile.y = can.height/2;
        Magnets = new Array(1);
        Magnets[0] = {x:400, y:can.height/2, strength:30, range:1000};
    }



    //-----------------------------Additionnal Obstacle Setup
    //-------Magnet
    for (var i=0; i<Magnets.length; i++){
        Magnets[i].pulse = new Array(Math.round(Magnets[i].range/30));
        for (var j=0; j<Magnets[i].pulse.length; j++){
            Magnets[i].pulse[j] = (j+1)*Magnets[i].range/Magnets[i].pulse.length;
        }
    }
    //-------Ventilator
    for (var i=0; i<Ventilators.length; i++){
        Ventilators[i].fan = 0;
    }









    //----------------------------------------------------------------------------------------------------
    //----------------------------------------------------------------------------------------------------
    //----------------------------------------------------------------------------------------------------
    //---------------------------------------------------------------------- Physics Simulation Functions:
    //----------------------------------------------------------------------------------------------------
    //----------------------------------------------------------------------------------------------------
    //----------------------------------------------------------------------------------------------------







    /**Uses input to update the shooting angle and force
     */
    function updateShootVector(){
        if (Left && !Right){
            shootDirection -= Math.PI*0.002;
        }
        if (Right && !Left){
            shootDirection += Math.PI*0.002;
        }
        if (Up && !Down && shootStrength<30){
            shootStrength += 0.05;
        }
        if (Down && !Up && shootStrength>=0){
            shootStrength -= 0.05;
        }
    }

    /**Apply the shooting angle and force
     */
    function shootProjectile (){        
            Projectile.dx = (shootStrength*Math.cos(shootDirection));
            Projectile.dy = (shootStrength*Math.sin(shootDirection));
            preparationMode = false;
    }
    
    /**Update object O's position according to velocity
     */
    function updatePosition(O){
        O.x += O.dx;
        O.y += O.dy;
    }

    /**Update object O's vertical velocity according to gravity
     */
    function update_Gravity(O){
        O.dy += gravityConst/O.mass;
    }
    
    /**Update object O's velocity because of the Magnets.
     */
    function update_Magnets(Magnets, O){
        for (var i=0; i<Magnets.length; i++){
            //update Projectile velocity
            //if Projectile within range :
            var distance = Math.sqrt(((Magnets[i].x - O.x)*(Magnets[i].x - O.x)) + ((Magnets[i].y - O.y)*(Magnets[i].y - O.y)));
            if (distance < Magnets[i].range){
                O.dx += (Magnets[i].x - O.x)*Magnets[i].strength/(distance*distance);
                O.dy += (Magnets[i].y - O.y)*Magnets[i].strength/(distance*distance);
            }         
        }
    }

    /**Update the Ball velocity according to its
     * collision with Block
     */
    function update_WallsCollision(Ball, Block){
        //store previous position
        var X, Y;
        X = Ball.x - Ball.dx;
        Y = Ball.y - Ball.dy;
        //Scenario 1 : Up or down
        if ((X <= Block.x + Block.w)&&(X >= Block.x)){
            Ball.dy = (0-Ball.dy) * Ball.collisionCoef;
        } else
        //Scenario 2 : Left or right
        if ((Y <= Block.y + Block.h)&&(Y >= Block.y)){
            Ball.dx = (0-Ball.dx) * Ball.collisionCoef;
        } else
        //Scenario 3 : Corner
        {
            Ball.dy = (0-Ball.dy) * Ball.collisionCoef;
            Ball.dx = (0-Ball.dx) * Ball.collisionCoef;
        }
        //Prevent case where Ball cannot get out of block :
        Ball.x += Ball.dx;
        Ball.y += Ball.dy;
    }

    /**Searches for collisions between Proj and Walls. 
     * If found, update_WallsCollision is called.
     */
    function update_Walls(Walls, Proj){
        for (var i=0; i<Walls.length; i++){
            //check if O is inside Walls[i]
            if ((Proj.x >= Walls[i].x) && (Proj.x <= Walls[i].x + Walls[i].w)){
                if ((Proj.y >= Walls[i].y) && (Proj.y <= Walls[i].y + Walls[i].h)){
                    update_WallsCollision(Proj, Walls[i]);
                }
            }
        }
    }

    /**Update object O's velocity because of the Trampolines.
     */
    function update_Trampo(Trampo, Proj){
        for(var i=0; i<Trampo.length; i++) {
            if (!Trampo[i].actif){
                if ((Proj.x > Trampo[i].xp1 && Proj.x < Trampo[i].xp2) 
                && (Proj.y > Trampo[i].yp1 )){
                    if (Proj.y-Proj.dy < Trampo[i].yp1){
                        Trampo[i].actif = true;
                    }
                }
            } else if (Trampo[i].actif){
                if ( (Proj.x > Trampo[i].xp1 && Proj.x < Trampo[i].xp2) 
                  && (Proj.y > Trampo[i].yp1 )){
                        Proj.dy += (Trampo[i].yp1-Proj.y)*0.01;
                } else {
                    Trampo[i].actif = false;
                }
            }
        }
    }

    /**Returns true if Point (Px, Py) is above
     * the line that passes through (x1, y1) and
     * (x2, y2). 
     */
    function checkIfAboveLine(x1, x2, y1, y2, Px, Py){
        var above = false;
        //search for line equation : y=m*x+p
        var m = (y1-y2)/(x1-x2);
        var p = y1 - (x1*m);
        if (Px*m + p >= Py){
            above = true;
        }
        return above;
    }

    /**Apply Ventilator Force on Projectile (Proj)
     */
    function update_VentilatorsForce (Ventilator, Proj){
        Proj.dx += Math.cos(Ventilator.direction)*Ventilator.strength/(30*Proj.mass);
        Proj.dy += Math.sin(Ventilator.direction)*Ventilator.strength/(30*Proj.mass);
    }

    /**Update object O's velocity because of the Ventilators.
     */
    function update_Ventilators(Ventilators, Proj){
        for (var i=0; i<Ventilators.length; i++){
            //store the edges of the ventilator
            var leftVent = new Array(2);
            leftVent[0] = Ventilators[i].x + (Math.cos(Ventilators[i].direction-Math.PI*0.5)*(Ventilators[i].width/2));
            leftVent[1] = Ventilators[i].y + (Math.sin(Ventilators[i].direction-Math.PI*0.5)*(Ventilators[i].width/2));
            var rightVent = new Array(2);
            rightVent[0] = Ventilators[i].x + (Math.cos(Ventilators[i].direction+Math.PI*0.5)*(Ventilators[i].width/2));
            rightVent[1] = Ventilators[i].y + (Math.sin(Ventilators[i].direction+Math.PI*0.5)*(Ventilators[i].width/2));
            //store edges of the end of the zone
            var leftEnd = new Array(2);
            leftEnd[0] = leftVent[0] + (Math.cos(Ventilators[i].direction)*Ventilators[i].range);
            leftEnd[1] = leftVent[1] + (Math.sin(Ventilators[i].direction)*Ventilators[i].range);
            var rightEnd = new Array(2);
            rightEnd[0] = rightVent[0] + (Math.cos(Ventilators[i].direction)*Ventilators[i].range);
            rightEnd[1] = rightVent[1] + (Math.sin(Ventilators[i].direction)*Ventilators[i].range);

            var projectileInZone = true;
            //set to false if outside bounds

            //  LEFT / RIGHT
            //Ventilator pointing right
            if ((Ventilators[i].direction%(2*Math.PI)) > 1.5*Math.PI || (Ventilators[i].direction%(2*Math.PI)) < 0.5*Math.PI){
                if (checkIfAboveLine(leftVent[0], leftEnd[0], leftVent[1], leftEnd[1], Proj.x, Proj.y)){
                    
                    //projectile is above left line
                    projectileInZone = false;
                }
                if (!checkIfAboveLine(rightVent[0], rightEnd[0], rightVent[1], rightEnd[1], Proj.x, Proj.y)){

                    //projectile is below right line
                    projectileInZone = false;
                }
            //Ventilator pointing left
            } else if ((Ventilators[i].direction%(2*Math.PI)) < 1.5*Math.PI && (Ventilators[i].direction%(2*Math.PI)) > 0.5*Math.PI){
                if (!checkIfAboveLine(leftVent[0], leftEnd[0], leftVent[1], leftEnd[1], Proj.x, Proj.y)){
                    
                    //projectile is below left line
                    projectileInZone = false;
                }
                if (checkIfAboveLine(rightVent[0], rightEnd[0], rightVent[1], rightEnd[1], Proj.x, Proj.y)){

                    //projectile is above right line
                    projectileInZone = false;
                }

            //Ventilator vertical
            } else {
                if (((Ventilators[i].direction%(2*Math.PI)) == 1.5*Math.PI) && (Proj.y > leftVent[1])){
                    projectileInZone = false;
                } else if (((Ventilators[i].direction%(2*Math.PI)) == 0.5*Math.PI) && (Proj.y < leftVent[1])) {
                    projectileInZone = false;
                }
            }

            //  UP / DOWN
            //Ventilator pointing Up
            if (Ventilators[i].direction%(2*Math.PI) > Math.PI){
                if (checkIfAboveLine(leftEnd[0], rightEnd[0], leftEnd[1], rightEnd[1], Proj.x, Proj.y)){

                    //projectile is above end of zone
                    projectileInZone = false;
                }
                if (!checkIfAboveLine(leftVent[0], rightVent[0], leftVent[1], rightVent[1], Proj.x, Proj.y)){

                    //projectile is below beginning of zone
                    projectileInZone = false;
                }

            //Ventilator pointing down
            } else if (Ventilators[i].direction%(2*Math.PI) < Math.PI){
                if (!checkIfAboveLine(leftEnd[0], rightEnd[0], leftEnd[1], rightEnd[1], Proj.x, Proj.y)){

                    //projectile is below end of zone
                    projectileInZone = false;
                }
                if (checkIfAboveLine(leftVent[0], rightVent[0], leftVent[1], rightVent[1], Proj.x, Proj.y)){

                    //projectile is above beginning of zone
                    projectileInZone = false;
                }

            //Ventilator horizontal
            } else {
                if (Ventilators[i].direction%(2*Math.PI) == Math.PI  && Proj.x > leftVent[0]){
                    projectileInZone = false;
                }
                if (Ventilators[i].direction%(2*Math.PI) == 0  && Proj.x < leftVent[0]){
                    projectileInZone = false;
                }
            }

            //Apply
            if (projectileInZone){
                update_VentilatorsForce(Ventilators[i], Proj);
            }
        }
    }


    //-----------------------------------------------------------------------------------------
    //-----------------------------------------------------------------------------------------
    //-----------------------------------------------------------------------------------------
    //---------------------------------------------------------------------- Display Functions:
    //-----------------------------------------------------------------------------------------
    //-----------------------------------------------------------------------------------------
    //-----------------------------------------------------------------------------------------





    function writeText(string){
        con.fillStyle = "black";
        con.font = "50px Calibri";
        con.fillText(string, can.width/2 - 250, 100);
    }



    function hideInterface(){
        for (var i=1; i<=6; i++){
            document.getElementById("Level"+i).style="visibility:hidden;";
        }
        document.getElementById("restart").style="visibility:hidden;";
        document.getElementById("continue").style="visibility:hidden;";
    }

    function cleanMap() {
        con.clearRect(0, 0, can.width, can.height);
    }

    function drawBackground(){
        con.drawImage(backgroundImage, 0, 0, can.width, can.height);
    }

    function drawProjectile(O){
        con.beginPath();
        con.fillStyle = O.color;
        con.arc(O.x, O.y, O.radius, 0, 2*Math.PI);
        con.fill();
        con.closePath();
    }

    function drawShootVector(){
        //draw basic vector
        con.beginPath();
        con.moveTo(Projectile.x, Projectile.y);
        con.lineTo(Projectile.x + 5*shootStrength*Math.cos(shootDirection), Projectile.y + 5*shootStrength*Math.sin(shootDirection));        
        con.strokeStyle = "green";
        con.lineWidth= 3 + shootStrength/6;
        con.stroke();
        con.closePath;

        //draw end of the arrow
        con.beginPath();
        //perpendicular line
        con.moveTo(Projectile.x + 5*shootStrength*Math.cos(shootDirection) + 0.6*shootStrength*Math.cos(shootDirection-(Math.PI/2)),
            Projectile.y + 5*shootStrength*Math.sin(shootDirection) + 0.6*shootStrength*Math.sin(shootDirection-(Math.PI/2)));
        con.lineTo(Projectile.x + 5*shootStrength*Math.cos(shootDirection) + 0.6*shootStrength*Math.cos(shootDirection+(Math.PI/2)),
            Projectile.y + 5*shootStrength*Math.sin(shootDirection) + 0.6*shootStrength*Math.sin(shootDirection+(Math.PI/2)));
        //right side
        con.lineTo(Projectile.x + 6.5*shootStrength*Math.cos(shootDirection), Projectile.y + 6.5*shootStrength*Math.sin(shootDirection));
        //left side
        con.lineTo(Projectile.x + 5*shootStrength*Math.cos(shootDirection) + 0.6*shootStrength*Math.cos(shootDirection-(Math.PI/2)),
            Projectile.y + 5*shootStrength*Math.sin(shootDirection) + 0.6*shootStrength*Math.sin(shootDirection-(Math.PI/2)));
        con.strokeStyle = "black"
        con.fillStyle = "green";
        con.lineWidth=0.5;
        con.fill()
        con.stroke();
        con.closePath();
    }

    function drawObjectiveHitBox(){
        con.beginPath();
        con.moveTo(Objective.x, Objective.y);
        con.lineTo(Objective.x + Objective.w, Objective.y);
        con.moveTo(Objective.x + Objective.w, Objective.y);
        con.lineTo(Objective.x + Objective.w, Objective.y + Objective.h);
        con.moveTo(Objective.x + Objective.w, Objective.y + Objective.h);
        con.lineTo(Objective.x, Objective.y + Objective.h);
        con.moveTo(Objective.x, Objective.y + Objective.h);
        con.lineTo(Objective.x, Objective.y);
        con.strokeStyle = "red";
        con.lineWidth=5;
        con.stroke();
        con.closePath();
    }

    function drawMagnets(Magnets){
        for (var i=0; i<Magnets.length; i++){
            //Magnet body
            con.beginPath();
            con.fillStyle = "red";
            con.arc(Magnets[i].x, Magnets[i].y, 5, 0, 2*Math.PI);
            con.fill();
            con.closePath();
            //Magnet pulses
            for (var j=0; j<Magnets[i].pulse.length; j++){
                //update Magnet pulsing waves
                if ((Magnets[i].pulse[j] >= 3) && (Magnets[i].pulse[j] <= Magnets[i].range)){
                    if (Magnets[i].strength < 0){
                        Magnets[i].pulse[j] += 0.5;
                    } else {
                        Magnets[i].pulse[j] -= 0.5;
                    }
                } else {
                    if (Magnets[i].strength > 0){
                        Magnets[i].pulse[j] = Magnets[i].range;
                    } else {
                        Magnets[i].pulse[j] = 3;
                    }
                }
                //draw them
                con.beginPath();
                //transparency scales with distance from center
                con.strokeStyle = ("rgba(1, 1, 1, " + (1-(Magnets[i].pulse[j]/Magnets[i].range)) + ")");
                con.arc(Magnets[i].x, Magnets[i].y, Magnets[i].pulse[j], 0, 2*Math.PI);
                con.lineWidth=1;
                con.stroke();
                con.closePath();
            }
        }
    }

    function drawWalls (Walls) {
        for (var i=0; i<Walls.length; i++){
            con.fillStyle = "black";
            con.fillRect(Walls[i].x, Walls[i].y, Walls[i].w, Walls[i].h);
            con.drawImage(wallTexture, Walls[i].x, Walls[i].y, Walls[i].w, Walls[i].h);
        }
    }

    
    function drawTrampo (Trampo, Proj){
        for (var i=0; i<Trampo.length; i++){
            //Draw Trampo line
            if (Trampo[i].actif){
                Trampo[i].xd = ((2*Proj.x)-((Trampo[i].xp1 + Trampo[i].xp2)/2));
                Trampo[i].yd = ((2*Proj.y)-((Trampo[i].yp1 + Trampo[i].yp2)/2)) + Proj.radius*2;
            } else {
                Trampo[i].yd += (Trampo[i].yp1-Trampo[i].yd)*(1/30);
                Trampo[i].xd += (((Trampo[i].xp1 + Trampo[i].xp2)/2)-Trampo[i].xd)*(1/30);
            }
            con.beginPath();
            con.moveTo(Trampo[i].xp1, Trampo[i].yp1);
            con.quadraticCurveTo(Trampo[i].xd, Trampo[i].yd, Trampo[i].xp2, Trampo[i].yp2);
            con.lineWidth=1;
            con.strokeStyle = "red";
            con.stroke();
            con.closePath();

            //Draw Trampo edges
            con.beginPath();
            con.fillStyle = "red";
            con.arc(Trampo[i].xp1, Trampo[i].yp1, 5, 0, 2*Math.PI);
            con.arc(Trampo[i].xp2, Trampo[i].yp2, 5, 0, 2*Math.PI);
            con.fill();
            con.closePath();
        }
    }

    function drawVentilators(Ventilators){
        for (var i=0; i<Ventilators.length; i++){
            //draw circles :
            con.beginPath();
            con.strokeStyle = "black";
            con.arc(Ventilators[i].x, Ventilators[i].y, Ventilators[i].width/2, 0, 2*Math.PI);
            con.lineWidth = 3;
            con.stroke();
            con.closePath();
            var numberOfFans = 4; //changeable
            for (var j=0; j<=numberOfFans; j++){
                con.beginPath();
                con.fillStyle = "grey";
                var fanAngle = (2*j*(Math.PI)/numberOfFans) + Ventilators[i].fan;
                con.arc((Ventilators[i].x+(Math.cos(fanAngle)*Ventilators[i].width/4)), (Ventilators[i].y+(Math.sin(fanAngle)*Ventilators[i].width/4)), 
                    (Ventilators[i].width/4), 0, (2*Math.PI));
                con.fill();
                con.lineWidth = 1.5;
                con.stroke();
                con.closePath();
            }
            //draw area of effect:
            var leftVent = new Array(2);
            leftVent[0] = Ventilators[i].x + (Math.cos(Ventilators[i].direction-Math.PI*0.5)*(Ventilators[i].width/2));
            leftVent[1] = Ventilators[i].y + (Math.sin(Ventilators[i].direction-Math.PI*0.5)*(Ventilators[i].width/2));
            var rightVent = new Array(2);
            rightVent[0] = Ventilators[i].x + (Math.cos(Ventilators[i].direction+Math.PI*0.5)*(Ventilators[i].width/2));
            rightVent[1] = Ventilators[i].y + (Math.sin(Ventilators[i].direction+Math.PI*0.5)*(Ventilators[i].width/2));

            con.beginPath();
            con.moveTo(leftVent[0], leftVent[1]);
            con.lineTo(leftVent[0] + Math.cos(Ventilators[i].direction)*Ventilators[i].range,
                leftVent[1] + Math.sin(Ventilators[i].direction)*Ventilators[i].range);
            con.moveTo(rightVent[0], rightVent[1]);
            con.lineTo(rightVent[0] + Math.cos(Ventilators[i].direction)*Ventilators[i].range, 
                rightVent[1] + Math.sin(Ventilators[i].direction)*Ventilators[i].range);
            con.strokeStyle = "black";
            con.lineWidth=0.5;
            con.stroke();
            con.closePath;

            //update display (fan angle and particles(?) )
            Ventilators[i].fan += 0.08;
        }
    }


    /**Tests collisions between the **Projectile** and the **Objective**.
     * Also checks for defeat condition if Projectile is off-limits.
     */ 
    function testVictoryDefeat (){
        //test the X axis coordinates
        if ((Projectile.x <= Objective.x + Objective.w)&&(Projectile.x >= Objective.x)){
            //test the Y axis coordinates
            if ((Projectile.y <= Objective.y + Objective.h)&&(Projectile.y >= Objective.y)){
                cleanMap();
                drawBackground();
                writeText("Nice Shot !        Time : " + Math.round(100*(framesSinceLaunch/60))/100 +"s");
                clearInterval(inter);
                document.getElementById("restart").style="visibility:visible;";
                document.getElementById("continue").style="visibility:visible;";
            }
        }
        //test for defeat condition as well
        if (Projectile.x <= -100 || Projectile.x >= can.width + 100 || Projectile.y >= can.height + 200){
            cleanMap();
            drawBackground();
            writeText("    Try Again ?");
            clearInterval(inter);
            document.getElementById("restart").style="visibility:visible;";
        }
    }


    
    /**Calculate and display the **Projectile** trajectory
     * if current shooting strength and angle are used.
     */
    function calculatePath (O, L){
        var Proj = new Object();
        Proj = {x:O.x, y:O.y, mass:O.mass, collisionCoef:O.collisionCoef};
        Proj.dx = 0+(shootStrength*Math.cos(shootDirection));
        Proj.dy = 0+(shootStrength*Math.sin(shootDirection));
        

        var Path = new Array(L);
        for (var i=0; i<L; i++){
            //update the anticipated path
            Path[i] = new Array(2);
            Path[i][0] = Proj.x;
            Path[i][1] = Proj.y;
            //update its position
            update_Gravity(Proj);
            update_Magnets(Magnets, Proj);
            updatePosition(Proj);
            update_Walls(Walls, Proj);
            update_Ventilators(Ventilators, Proj);
            update_Trampo(Trampo, Proj);
        }

        //display
        con.beginPath();
        for (var i=0; i<L-1; i++){
            if(i%30>4 && i%30<28){
                con.moveTo(Path[i][0], Path[i][1]);
                con.lineTo(Path[i+1][0], Path[i+1][1]);
            } else if (i%30==0 && i!=0){
                con.fillStyle = "black";
                con.font = "20px Arial";
                con.fillText(i/60+"s", Path[i][0], Path[i][1]);
            }
        }
        con.strokeStyle = "yellow";
        con.lineWidth=3;
        con.stroke();
        con.closePath;
    }








    /**The function that calls every other function at a given interval.
     * (Here it is 60 frames per second)
     */
    function step(){
        
        cleanMap();
        drawBackground();

        if (!preparationMode){
            update_Gravity(Projectile);
            update_Magnets(Magnets, Projectile);
            updatePosition(Projectile);
            update_Walls(Walls, Projectile);
            update_Trampo(Trampo, Projectile);
            update_Ventilators(Ventilators, Projectile);
            framesSinceLaunch += 1;
        } else {
            updateShootVector();
            calculatePath(Projectile, 2000);
            drawShootVector();
            if (Shift){
                shootProjectile();
            }
        }

        drawProjectile(Projectile);
        drawMagnets(Magnets);
        drawObjectiveHitBox();
        drawWalls(Walls);
        drawTrampo(Trampo, Projectile);
        drawVentilators(Ventilators);

        testVictoryDefeat();
    }
}