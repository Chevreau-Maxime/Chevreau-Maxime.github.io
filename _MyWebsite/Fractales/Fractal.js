
    var inter;
    var x1 = -2.1;
    var x2 = 0.6;
    var y1 = -1.2;
    var y2 = 1.2;

    var clickState = 0; //0 nothing, 1 waits for P1, 2 waits for P2
    var P1 = [0,0];
    var P2 = [0,0];

    var Parameters = new Array(2);
    Parameters = [-0.835, -0.2321];



function updateParameters(){
    Parameters[0] = Number(document.getElementById("nb1").value);
    Parameters[1] = Number(document.getElementById("nb2").value);
    document.getElementById("nbDisplay").innerHTML = Parameters[0] + " + " + Parameters[1];
}

function mouseClick (e) {
    //General Var
    var canvas = document.getElementById("can");
    var con = canvas.getContext("2d");
    if ((e.clientX<canvas.width)&(e.clientY<canvas.height)) {
        if (clickState == 1){
            P1 = [e.clientX, e.clientY];
            con.beginPath();
            con.strokeStyle = "red"; con.lineWidth = 2;
            con.moveTo(0, P1[1]); con.lineTo(canvas.width, P1[1]);
            con.moveTo(P1[0], 0); con.lineTo(P1[0], canvas.height);
            con.stroke();
            con.closePath();
            clickState = 2;
            //alert("Select second point");
            document.getElementById("text").innerHTML += "<br />"+"Select second point";
        } else if (clickState == 2){
            P2 = [e.clientX, e.clientY];
            con.beginPath();
            con.strokeStyle = "red"; con.lineWidth = 2;
            con.moveTo(0, P2[1]); con.lineTo(canvas.width, P2[1]);
            con.moveTo(P2[0], 0); con.lineTo(P2[0], canvas.height);
            con.stroke();
            con.closePath();
            clickState = 0;
            updateBorders();
            document.getElementById("text").innerHTML += "<br />"+"Now you can render it again";
        }
    }
}
window.addEventListener('click', mouseClick, false);

function updateBorders(){
    var PointA = new Array(2); PointA = convert(P1);
    var PointB = new Array(2); PointB = convert(P2);
    x1 = Math.min(PointA[0], PointB[0]);
    x2 = Math.max(PointA[0], PointB[0]);
    y1 = Math.min(PointA[1], PointB[1]);
    y2 = Math.max(PointA[1], PointB[1]);
}

function startBorderSelect(){
    //If not previously waiting for click, then start
    if (clickState == 0){
        clickState = 1;
        document.getElementById("text").innerHTML += "<br />"+"Select first point";
    }
}

/**Converts from Screen coordinates to local coordinates. P is an Array of size 2 */
function convert(P){
    var canvas = document.getElementById("can");
    var res = [0, 0];
    res[0] = ((P[0]/canvas.width) * (x2-x1)) + x1;
    res[1] = ((P[1]/canvas.height) * (y2-y1)) + y1;
    return res;
}

function Unzoom(){
    var amp = 4;
    var middle = [(x1+x2)/2, (y1+y2)/2];
    x1 = middle[0] + (amp*(x1-middle[0]));
    x2 = middle[0] + (amp*(x2-middle[0]));
    y1 = middle[1] + (amp*(y1-middle[1]));
    y2 = middle[1] + (amp*(y2-middle[1]));
    drawJulia();
}

/**Adjusts the width/height ratio of the render, as to keep the same area.
 * Also keeps the center identical now. */
function correctResolution(){
    var canvas = document.getElementById("can");
    /** w'*h' = A = w*h
     * and w'/h' = canvas.width/canvas.height = ratio
     * w' ? h' ?
     */
    var w = x2-x1;
    var h = y2-y1;
    var middle = [(x1+x2)/2, (y1+y2)/2];
    var newh = Math.sqrt((w*h) / (canvas.width/canvas.height));
    var neww = (w*h)/newh;
    x2 = x1 + neww;
    y2 = y1 + newh;
    var newMiddle = [(x1+x2)/2, (y1+y2)/2];
    x1 += middle[0]-newMiddle[0];
    x2 += middle[0]-newMiddle[0];
    y1 += middle[1]-newMiddle[1];
    y2 += middle[1]-newMiddle[1];
    drawJulia();
}





function drawJulia(){
    //General Var
    var canvas = document.getElementById("can");
    var con = canvas.getContext("2d");
    var timeStart = performance.now();
    //Specific Var
    var iterationsMax = 200;
    var iterations;
    var ci, cr, zr, zi;
    var tmp;
    var sizeX = x2-x1;
    var sizeY = y2-y1;

    cr = -0.835;
    ci = -0.2321;
    cr = Parameters[0];
    ci = Parameters[1];

    con.clearRect(0, 0, canvas.width, canvas.height);
    for (var x=0; x<canvas.width; x++){
        for (var y=0; y<canvas.height; y++){
            iterations = iterationsMax;

            zr = ((sizeX*(x)/canvas.width)+x1);
            zi = ((sizeY*(y)/canvas.height)+y1);

            while ((iterations>0)&(((zr*zr)+(zi*zi))<4)){
                tmp = zr;
                zr = (zr*zr)+(cr)-(zi*zi);
                zi = (2*tmp*zi) + ci;
                iterations -=1;
            }

            if (iterations == 0){
                con.fillStyle = "rgb(0, 0, 150)";
                con.fillRect(x, y, 1, 1);
            } else {
                con.fillStyle = getColorSinus((iterationsMax-iterations)/iterationsMax,
                50, 50, 50,
                255, 225, 225);
                //con.fillStyle = getColorRainbow((iterationsMax-iterations)/iterationsMax);
                con.fillRect(x, y, 1, 1);
            }
            
        }
    }
    var timeEnd = performance.now();
    document.getElementById("text").innerHTML = "Time taken : " + (timeEnd-timeStart) + "ms.";
}




//Color !!

function getColor(percent, startR, startG, startB, endR, endG, endB){
    var R = startR + (percent*(endR-startR));
    var G = startG + (percent*(endG-startG));
    var B = startB + (percent*(endB-startB));
    var res = "rgb("+R+","+G+","+B+")";
    return res;
}

function getColorSinus(percent, startR, startG, startB, endR, endG, endB){
    var percentSinus = Math.sin(percent*Math.PI/2);
    return getColor(percentSinus, startR, startG, startB, endR, endG, endB)
}

/**percent is between 0 and 1 */
function getColorRainbow(percent){
    var p = percent //Math.sin(percent*Math.PI/2);
    var R = ((p < 0.5) ? 1 : 1.5-p);
    var G = ((p < 0.5) ? 1-p : p);
    var B = ((p < 0.5) ? 0.5+p : 1);
    R *= 255;
    G *= 255;
    B *= 255;
    return "rgb("+R+","+G+","+B+")";

}







//Fonction Obsolete mais on garde quand meme, ca peut servir :)
//--------------------------------------------------------
    function drawMandelbrot(){
        var iterationsMax = 200;
        var iterations;
        var ci, cr, zr, zi;
        var zrTmp;

        con.clearRect(0, 0, canvas.width, canvas.height);
        for (var x=0; x<canvas.width; x++){
            for (var y=0; y<canvas.height; y++){
                iterations = iterationsMax;
                cr = ((2.7*x/canvas.width)-(2.1));
                ci = ((2.4*y/canvas.height)-(1.2));
                zr = 0;
                zi = 0;
                while (iterations>0){
                    zrTmp = zr;
                    zr = (zr*zr)+(cr)-(zi*zi);
                    zi = (2*zrTmp*zi) + ci;
                    iterations -=1;
                }

                if ( ((zr*zr)+(zi*zi)) < 4){
                    con.fillStyle = "black";
                    con.fillRect(x, y, 1, 1);
                }

            }
        }
    }