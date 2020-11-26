function display(can, con, constants){
    clearMap(can,con, constants);
    display_character(can, con, constants);
}



function clearMap(can, con, constants){
    //con.fillStyle = "white";
    //con.fillRect(0,0,can.width,can.height);
    printImage(con, "bg_sky",       constants.sky, 0, can.width, can.height);
    printImage(con, "bg_sky",       constants.sky + can.width, 0, can.width, can.height);
    printImage(con, "bg_ground",    constants.sky, constants.ground, can.width, can.height - constants.ground);
    printImage(con, "bg_ground",    constants.sky + can.width, constants.ground, can.width, can.height - constants.ground);
    
}

function display_character(can, con, constants){
    //con.fillStyle = "blue";
    //con.fillRect(x - 10, can.height*0.7, 20, can.height*0.1);
    con.drawImage(document.getElementById("img_character"), 
        0, 0, 100, 100,
        constants.char_x - (constants.char_h/2), constants.ground - constants.char_h, constants.char_h, constants.char_h);
}

function printImage(con, name, x, y, w=0, h=0){
    var img = document.getElementById(name);
    if (h == 0){w = img.width; h = img.height;}
    con.drawImage(img,x,y,w,h);
}
