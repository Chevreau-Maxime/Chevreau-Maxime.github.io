"use strict" 

//Variable Declaration---------------------------------------------------
	
	var parametre = document.getElementById("parametre");//menu parameters
	var ctx; //context
	var c; // canvas
	var hidden=true; //boolean to store visibility of parameters
	var interval;
//-----------------------------------------------------------------------


//Initialization => when the page loads
window.onload = function(){

	c = document.getElementById("canvas"); 
	ctx = c.getContext("2d");
	
	document.getElementById("parametre").style = "visibility: hidden;";
	levelSelect();
}

//Level Selection
function levelSelect(){

	for (var i=1; i<=6; i++){
		document.getElementById("Level"+i).style="visibility:visible;";
	}
	document.getElementById("restart").style = "visibility:hidden;";
	document.getElementById("continue").style = "visibility:hidden;";
	

	var X=1;
	var sky = new Image();
	sky.src = "backgroundSeamlessSky2.png";
	clearInterval(interval);
	interval = setInterval(dynamicBackground, 1000/40);
	
	//draw the dynamic background
	function dynamicBackground(){
		ctx.drawImage(sky, X, 0);
		ctx.drawImage(sky, X+1000, 0);
		X -= 1;
		X = X%1000;
		ctx.fillStyle = "black";
        ctx.font = "50px Calibri Bold";
        ctx.fillText("Choose your Level", c.width/2-200, 300);
	}

}


function projectile (){
	document.getElementById("projectile").addEventListener("change", function (e) 
	{
		console.log("projectile -> " + e.target.value);
	});
}

//Manage HTML element "Parametre" visibility
function Parametre()
{
	if (hidden)
	{
		document.getElementById("parametre").style = "visibility: visible;";
		hidden=false;
	}
	
	else 
	{
		document.getElementById("parametre").style = "visibility: hidden;"
		hidden=true;
	}
}
