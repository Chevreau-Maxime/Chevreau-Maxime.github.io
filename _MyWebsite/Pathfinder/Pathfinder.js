"use strict";

var inter;


window.onload = function () {


    //----------------------------------------------------Input

    var Input = new Object();
    Input.click = new Array(2);

    function mouseClick (e) {
        //alert("click at : " + e.clientX + ", " + e.clientY);
        Input.click[0] = e.clientX - 8;
        Input.click[1] = e.clientY - 8;
    }
    window.addEventListener('click', mouseClick, false);



    var can = document.getElementById("canvas");
    var con = can.getContext("2d");

    inter = setInterval(step, 1000/60);

    //--------------------------------------------------------GLOBAL VARIABLES :
    
    var Robot = new Object();
    Robot = {angle:0, size:10, speed:1, turnSpeed:0.05};
    Robot.position = new Array(2);
    Robot.position[0] = 20;
    Robot.position[1] = 20;
    Robot.raycastRange = 200;
    Robot.raycast = new Array(5);
    Robot.raycast = [-Math.PI*0.3, -Math.PI*0.1, 0, Math.PI*0.1, Math.PI*0.3];
    Robot.memory = new Array();
    Robot.path = new Array();
    
    var Blocks = new Array(2);
    for (var i=0; i<Blocks.length; i++){
        Blocks[i] = new Object();
    } 
    //Blocks[0] = {x:300, y:200, w:100, h:50};
    Blocks[1] = {x:450, y:70, w:50, h:400};
    Blocks[0] = {x:100, y:100, w:100, h:30};

    var Objective = new Object();
    Objective = {x:can.width-20, y:can.height-20};
    var requirePathUpdate = true;

    //--------------------------------------------------------INITIALIZATION :


    calulatePath_Sensor(Robot, Objective);

    //--------------------------------------------------------SIMULATION FUNCTIONS :


    function updateMemory(Rob){
        var Path = new Array(2);
        Path[0] = new Array(2);
        Path[1] = new Array(2);
        var distance;
        var possible = true;
        var collision = null;

        //reset requirePathUpdate
        //requirePathUpdate = false;

        for (var i=0; i<Rob.raycast.length; i++){
            var P = new Array(2);
            collision = null;
            possible = true;

            //Check the raycast
            Path[0][0] = Rob.position[0];
            Path[0][1] = Rob.position[1];
            Path[1][0] = Rob.position[0] + Rob.raycastRange*Math.cos(Rob.raycast[i] + Rob.angle);
            Path[1][1] = Rob.position[1] + Rob.raycastRange*Math.sin(Rob.raycast[i] + Rob.angle);
            if (!checkIfOkay(Path)){
                //Obstacle found, get coordinates
                for (var t=0; t<Rob.raycastRange; t+=1){
                    
                    P[0] = Rob.position[0] + t*Math.cos(Rob.raycast[i] + Rob.angle);
                    P[1] = Rob.position[1] + t*Math.sin(Rob.raycast[i] + Rob.angle);
                    if (checkCollision_Blocks(P, Blocks) && collision == null){
                        collision = new Array(2);
                        collision[0] = P[0];
                        collision[1] = P[1];
                    }
                }
                //Check if nearby other memory point
                for (var j=0; j<Rob.memory.length; j++){
                    if (collision!=null){
                        distance = Math.sqrt(((collision[0]-Rob.memory[j][0])*(collision[0]-Rob.memory[j][0])) + 
                        ((collision[1]-Rob.memory[j][1])*(collision[1]-Rob.memory[j][1])));
                        if (distance < 10){
                            possible = false;
                        }
                    }
                }

                //update Robot memory
                if (possible && collision!=null){
                    //requirePathUpdate = true;
                    Rob.memory[Rob.memory.length] = new Array(2);
                    Rob.memory[Rob.memory.length-1][0] = collision[0];
                    Rob.memory[Rob.memory.length-1][1] = collision[1];
                }
            }
        }
    }


    function moveRobot(Rob){
        var moveVector = new Array(2);
        moveVector[0] = Rob.path[1][0] - Rob.path[0][0];
        moveVector[1] = Rob.path[1][1] - Rob.path[0][1];
        var distance = Math.sqrt((moveVector[0]*moveVector[0])+(moveVector[1]*moveVector[1]));

        //before any movement, reach required angle
        //var reqAngle = Math.atan(moveVector[1]/moveVector[0]);
        var reqAngle = Math.acos(moveVector[0]/distance);
        if (moveVector[1] < 0){
            reqAngle *= -1;
        }

        //alert("current : " + Math.round(Rob.angle*10)/10 + " needed : " + Math.round(reqAngle*10)/10);
        document.getElementById("text").innerHTML = "ANGLE      current : " + Math.round(Rob.angle*10)/10 + " needed : " + Math.round(reqAngle*10)/10;

        if (reqAngle != Rob.angle) {
            if (distance==0 && Rob.path.length==2){
                //Haha nothing
            }
            //Apply rotation or snap angle directly ?
            else if (Math.abs(reqAngle - Rob.angle) < Rob.turnSpeed){
                Rob.angle = reqAngle;
            } else if (Math.abs(reqAngle - Rob.angle) > Math.PI){
                Rob.angle += ((reqAngle - Rob.angle)/Math.abs(reqAngle - Rob.angle)) * 2 * Math.PI;
                Rob.angle += ((reqAngle - Rob.angle)/Math.abs(reqAngle - Rob.angle)) * Rob.turnSpeed;
            } else {
                Rob.angle += ((reqAngle - Rob.angle)/Math.abs(reqAngle - Rob.angle)) * Rob.turnSpeed;                
            }
        }
        //Angle is okay, move the robot
        else {
            if (distance < Rob.speed){
                Rob.position[0] = Rob.path[1][0];
                Rob.position[1] = Rob.path[1][1];
            } else {
                Rob.position[0] += Rob.speed * Math.cos(Rob.angle);
                Rob.position[1] += Rob.speed * Math.sin(Rob.angle);    
            }
        }
    }


    function changeObjective (Obj, Rob){
        if (Input.click[0] > 10 && Input.click[0] < can.width + 10){
            if (Input.click[1] > 10 && Input.click[1] < can.height + 10){
                if (!checkCollision_Blocks(Input.click, Blocks)){
                    if (!checkCollision_Sensor(Input.click, Rob)){
                        Obj.x = Input.click[0];
                        Obj.y = Input.click[1];
                    }
                }
            }
        }
    }















    //---------------------------------------------Points :

    function checkCollision_Sensor(P, Rob){
        var distance;
        var margin = 30;
        for (var j=0; j<Rob.memory.length; j++){
            distance = Math.sqrt(((P[0]-Rob.memory[j][0])*(P[0]-Rob.memory[j][0])) + 
            ((P[1]-Rob.memory[j][1])*(P[1]-Rob.memory[j][1])));
            if (distance < margin){
                return true;
            }
        }
        return false;
    }

    function checkIfOkay_Sensor(Path, Rob){
        var pathIsOkay = true;
        var precision = 1;
        var vector = new Array(2);
        var P = new Array(2);
        var distance;
        for (var i=0; i<Path.length-1; i++){
            //get line vector
            vector[0] = Path[i+1][0] - Path[i][0];
            vector[1] = Path[i+1][1] - Path[i][1];
            distance = Math.sqrt((vector[0]*vector[0])+(vector[1]*vector[1]));
            for (var j=0; j<(distance/precision); j++){
                P[0] = Path[i][0] + (j*vector[0]*(precision/distance));
                P[1] = Path[i][1] + (j*vector[1]*(precision/distance)); 
                if (checkCollision_Sensor(P, Rob)){
                    pathIsOkay = false;
                    //alert("at position : " + P[0] + ", " + P[1]);
                }
            }
        }
        return pathIsOkay;
    }


    function correctPath_Sensor(Path, Rob){
        var Obstacle = new Array();
        //Find The First Obstacle :
        var precision = 1;
        var vector = new Array(2);
        var P = new Array(2);
        var distance;
        var inObstacle = false;
        var whereToChange = null;
        for (var i=0; i<Path.length-1; i++){
            //get line vector
            vector[0] = Path[i+1][0] - Path[i][0];
            vector[1] = Path[i+1][1] - Path[i][1];
            distance = Math.sqrt((vector[0]*vector[0])+(vector[1]*vector[1]));
            for (var j=0; j<(distance/precision); j++){
                P[0] = Path[i][0] + (j*vector[0]*(precision/distance));
                P[1] = Path[i][1] + (j*vector[1]*(precision/distance));
                //if first getting inside obstacle or leaving : 
                if (checkCollision_Sensor(P, Rob)!=inObstacle){
                    //if Obstacle is not full already
                    if (Obstacle.length < 2){
                        inObstacle = true;
                        Obstacle[Obstacle.length] = new Array(2);
                        Obstacle[Obstacle.length-1][0] = P[0];
                        Obstacle[Obstacle.length-1][1] = P[1];
                    }
                    if (whereToChange == null){
                        whereToChange = i;
                    }
                }
            }
        }
        //checkpoint
        //alert(Obstacle[0][0] + ", " + Obstacle[0][1] + " and " + Obstacle[1][0] + ", " + Obstacle[1][1]);
        //Now deviate the Path :
        var n = 1;
        var middle = new Array(2);
        middle[0] = (Obstacle[1][0] + Obstacle[0][0])/2;
        middle[1] = (Obstacle[1][1] + Obstacle[0][1])/2;
        //alert("Middle : " + middle[0] + ", " + middle[1]);        
        /**vector is from Obs[0] to Obs[1] --> (x, y)
         * vector' is perpendicular to vector --> (y, -x)
         */
        vector[0] = Obstacle[1][1] - Obstacle[0][1];
        vector[1] = -1*(Obstacle[1][0] - Obstacle[0][0]);
        distance = Math.sqrt((vector[0]*vector[0])+(vector[1]*vector[1]));
        
        P[0] = middle[0] + (0.5*vector[0]*(precision/distance)*n);
        P[1] = middle[1] + (0.5*vector[1]*(precision/distance)*n);
        while (checkCollision_Sensor(P, Rob)){
           //middle is the orthogonal projection of P on the line
           P[0] = middle[0] + (0.5*vector[0]*(precision/distance)*n);
           P[1] = middle[1] + (0.5*vector[1]*(precision/distance)*n);
           //increment and change sign of n
           n += n/Math.abs(n);
           n *= -1;
        }
        //checkpoint :
        //alert("New point : " + P[0] + ", " + P[1]);

        //Now change the Path
        Path.splice(whereToChange+1, 0, P);
    }



    function optimizePath_Sensor(Path, Rob){
        var done = false;
        //Verify necessity of each point in Path
        var miniPath = new Array(2);
        while (!done){
            done = true;
            for (var i=0; i<Path.length-2; i++){
                for (var j=0; j<2; j++){
                    miniPath[j] = new Array(2);
                    miniPath[j][0] = Path[i+(2*j)][0];
                    miniPath[j][1] = Path[i+(2*j)][1];
                }
                if (checkIfOkay_Sensor(miniPath, Rob)){
                    Path.splice(i+1, 1);
                    done = false;
                }
            }
        }
    }

    function calulatePath_Sensor(Rob, Obj){
        //initial path
        var Path = new Array(2);
        Path[0] = new Array(2);
        Path[1] = new Array(2);
        Path[0][0] = Rob.position[0];
        Path[0][1] = Rob.position[1];
        Path[1][0] = Obj.x;
        Path[1][1] = Obj.y;
        //while not okay -> correct path
        while (!checkIfOkay_Sensor(Path, Rob)){
            correctPath_Sensor(Path, Rob);
        }
        optimizePath_Sensor(Path, Rob);
        
        //display
        var string = "Length : " + Path.length + ", Positions : ";
        for (var i=0; i<Path.length; i++){
            string += " (" +  Math.round(Path[i][0]) + ", " + Math.round(Path[i][1]) + ") ";
        }
        //document.getElementById("text").innerHTML = string;
        
        //once it's okay -> update in Rob
        Rob.path = new Array(Path.length);
        for (var i=0; i<Path.length; i++){
            Rob.path[i] = new Array(2);
            Rob.path[i][0] = Path[i][0];
            Rob.path[i][1] = Path[i][1];
        }
    }




























    //---------------------------------------------BLOCKS :

    function checkCollision_Blocks(P, Blocks){
        var collision = false;
        var margin = 0;
        for (var i=0; i<Blocks.length; i++){
            if (P[0] > Blocks[i].x - margin && P[0] < Blocks[i].x + Blocks[i].w + margin){
                if (P[1] > Blocks[i].y - margin && P[1] < Blocks[i].y + Blocks[i].h + margin){
                    //Point in block
                    collision = true;
                }
            }
        }
        return collision;
    }

    

    function checkIfOkay(Path){
        var pathIsOkay = true;
        var precision = 1;
        var vector = new Array(2);
        var P = new Array(2);
        var distance;
        for (var i=0; i<Path.length-1; i++){
            //get line vector
            vector[0] = Path[i+1][0] - Path[i][0];
            vector[1] = Path[i+1][1] - Path[i][1];
            distance = Math.sqrt((vector[0]*vector[0])+(vector[1]*vector[1]));
            for (var j=0; j<(distance/precision); j++){
                P[0] = Path[i][0] + (j*vector[0]*(precision/distance));
                P[1] = Path[i][1] + (j*vector[1]*(precision/distance)); 
                if (checkCollision_Blocks(P, Blocks)){
                    pathIsOkay = false;
                    //alert("at position : " + P[0] + ", " + P[1]);
                }
            }
        }
        return pathIsOkay;
    }





    function correctPath(Path){
        var Obstacle = new Array();
        //Find The First Obstacle :
        var precision = 1;
        var vector = new Array(2);
        var P = new Array(2);
        var distance;
        var inObstacle = false;
        var whereToChange = null;
        for (var i=0; i<Path.length-1; i++){
            //get line vector
            vector[0] = Path[i+1][0] - Path[i][0];
            vector[1] = Path[i+1][1] - Path[i][1];
            distance = Math.sqrt((vector[0]*vector[0])+(vector[1]*vector[1]));
            for (var j=0; j<(distance/precision); j++){
                P[0] = Path[i][0] + (j*vector[0]*(precision/distance));
                P[1] = Path[i][1] + (j*vector[1]*(precision/distance));
                //if first getting inside obstacle or leaving : 
                if (checkCollision_Blocks(P, Blocks)!=inObstacle){
                    //if Obstacle is not full already
                    if (Obstacle.length < 2){
                        inObstacle = true;
                        Obstacle[Obstacle.length] = new Array(2);
                        Obstacle[Obstacle.length-1][0] = P[0];
                        Obstacle[Obstacle.length-1][1] = P[1];
                    }
                    if (whereToChange == null){
                        whereToChange = i;
                    }
                }
            }
        }
        //checkpoint
        //alert(Obstacle[0][0] + ", " + Obstacle[0][1] + " and " + Obstacle[1][0] + ", " + Obstacle[1][1]);
        //Now deviate the Path :
        var n = 1;
        var middle = new Array(2);
        middle[0] = (Obstacle[1][0] + Obstacle[0][0])/2;
        middle[1] = (Obstacle[1][1] + Obstacle[0][1])/2;
        //alert("Middle : " + middle[0] + ", " + middle[1]);        
        /**vector is from Obs[0] to Obs[1] --> (x, y)
         * vector' is perpendicular to vector --> (y, -x)
         */
        vector[0] = Obstacle[1][1] - Obstacle[0][1];
        vector[1] = -1*(Obstacle[1][0] - Obstacle[0][0]);
        distance = Math.sqrt((vector[0]*vector[0])+(vector[1]*vector[1]));
        
        P[0] = middle[0] + (0.5*vector[0]*(precision/distance)*n);
        P[1] = middle[1] + (0.5*vector[1]*(precision/distance)*n);
        while (checkCollision_Blocks(P, Blocks)){
           //middle is the orthogonal projection of P on the line
           P[0] = middle[0] + (0.5*vector[0]*(precision/distance)*n);
           P[1] = middle[1] + (0.5*vector[1]*(precision/distance)*n);
           //increment and change sign of n
           n += n/Math.abs(n);
           n *= -1;
        }
        //checkpoint :
        //alert("New point : " + P[0] + ", " + P[1]);

        //Now change the Path
        Path.splice(whereToChange+1, 0, P);
    }






    function optimizePath(Path){
        var done = false;
        //Verify necessity of each point in Path
        var miniPath = new Array(2);
        while (!done){
            done = true;
            for (var i=0; i<Path.length-2; i++){
                for (var j=0; j<2; j++){
                    miniPath[j] = new Array(2);
                    miniPath[j][0] = Path[i+(2*j)][0];
                    miniPath[j][1] = Path[i+(2*j)][1];
                }
                if (checkIfOkay(miniPath)){
                    Path.splice(i+1, 1);
                    done = false;
                }
            }
        }
    }

    function calulatePath(Rob, Obj){
        //initial path
        var Path = new Array(2);
        Path[0] = new Array(2);
        Path[1] = new Array(2);
        Path[0][0] = Rob.position[0];
        Path[0][1] = Rob.position[1];
        Path[1][0] = Obj.x;
        Path[1][1] = Obj.y;

        //while not okay -> correct path
        while (!checkIfOkay(Path)){
            correctPath(Path);
        }
        optimizePath(Path);
        
        //display
        var string = "Length : " + Path.length + ", Positions : ";
        for (var i=0; i<Path.length; i++){
            string += " (" +  Math.round(Path[i][0]) + ", " + Math.round(Path[i][1]) + ") ";
        }
        //document.getElementById("text").innerHTML = string;
        
        //once it's okay -> update in Rob
        Rob.path = new Array(Path.length);
        for (var i=0; i<Path.length; i++){
            Rob.path[i] = new Array(2);
            Rob.path[i][0] = Path[i][0];
            Rob.path[i][1] = Path[i][1];
        }
    }
















    //--------------------------------------------------------DISPLAY FUNCTIONS :

    function clearMap(){
        con.clearRect(0, 0, can.width, can.height);
    }

    function drawRobot(Rob){
        //Circle
        con.beginPath();
        con.fillStyle = "black";
        con.arc(Rob.position[0], Rob.position[1], Rob.size, 0, 2*Math.PI);
        con.fill();
        con.closePath();
        //Vector
        con.beginPath();
        con.moveTo(Rob.position[0], Rob.position[1]);
        con.lineTo(Rob.position[0] + Rob.size*1.5*Math.cos(Rob.angle), Rob.position[1] + Rob.size*1.5*Math.sin(Rob.angle));
        con.strokeStyle = "black";
        con.lineWidth = 3;
        con.stroke();
        con.closePath;
        //raycasts
        for (var i=0; i<Rob.raycast.length; i++){
            con.beginPath();
            con.moveTo(Rob.position[0], Rob.position[1]);
            con.lineTo(Rob.position[0] + Rob.raycastRange*Math.cos(Rob.angle+Rob.raycast[i]), Rob.position[1] + Rob.raycastRange*Math.sin(Rob.angle+Rob.raycast[i]));
            con.strokeStyle = "red";
            con.lineWidth = 2;
            con.stroke();
            con.closePath;
        }
    }
    
    function drawBlocks(Blocks){
        for (var i=0; i<Blocks.length; i++){
            con.fillStyle = "rgba(253, 173, 0, 0.678)";
            con.fillRect(Blocks[i].x, Blocks[i].y, Blocks[i].w, Blocks[i].h);
        }
    }

    function drawObjective(Objective){
        var x = Objective.x;
        var y = Objective.y;
        var size = 10;
        con.beginPath();
        con.moveTo(x-size, y-size);
        con.lineTo(x+size, y+size);
        con.moveTo(x-size, y+size);
        con.lineTo(x+size, y-size);
        con.strokeStyle = "black";
        con.lineWidth = 2;
        con.stroke();
        con.closePath;
    }

    function drawPath (Rob){
        con.beginPath();
        for (var i=0; i<Rob.path.length-1; i++){
            con.moveTo(Rob.path[i][0], Rob.path[i][1]);
            con.lineTo(Rob.path[i+1][0], Rob.path[i+1][1]);
        }
        con.strokeStyle = "blue";
        con.lineWidth = 1;
        con.stroke();
        con.closePath;
    }

    function drawInterdictionPoints(Rob){
        for (var i=0; i<Rob.memory.length; i++){
            //Point
            con.beginPath();
            con.fillStyle = "red";
            con.arc(Rob.memory[i][0], Rob.memory[i][1], 2, 0, 2*Math.PI);
            con.fill();
            con.closePath();
            //Aura
            con.beginPath();
            con.fillStyle = "rgba(200, 0, 0, 0.2)";
            con.arc(Rob.memory[i][0], Rob.memory[i][1], 30, 0, 2*Math.PI);
            con.fill();
            con.closePath();
        }
    }




    function step() {
        clearMap();

        updateMemory(Robot);
        changeObjective(Objective, Robot);
        if (requirePathUpdate) calulatePath_Sensor(Robot, Objective);
        moveRobot(Robot);


        drawBlocks(Blocks);
        drawRobot(Robot);
        drawObjective(Objective);
        drawPath(Robot);
        drawInterdictionPoints(Robot);
    }
}