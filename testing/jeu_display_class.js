class Jeu_Display {
    constructor(can){
        this.can = can;
        this.con = can.getContext("2d");
    }
    
    clearMap(distance, ground){
        var w = this.can.width;
        var h = this.can.height;
        var d = (Math.floor(distance*w)%w);
        var g = ground * h;

        //con.fillStyle = "white";
        //con.fillRect(0,0,can.width,can.height);
        this.printImage("bg_sky",       -d, 0, w, h);
        this.printImage("bg_sky",       -d + w, 0, w, h);
        this.printImage("bg_ground",    -d, g, w, h - g);
        this.printImage("bg_ground",    -d + w, g, w, h - g);
    }
    
    display_character(char_x, char_h, ground){
        var w = this.can.width;
        var h = this.can.height;
        var cx = char_x * w;
        var ch = char_h * h;
        var g = ground * h;

        this.printImage("img_character", cx-(ch/2), g-ch, ch, ch);
    }

    display_proj(x, y, dx, dy){
        var w = this.can.width;
        var h = this.can.height;
        this.con.strokeStyle = "red";
        this.con.lineWidth = 2;
        this.con.beginPath();
        this.con.moveTo(x*w, y*h);
        var length = 15;
        this.con.lineTo((x + dx)*w, (y + dy)*h);
        this.con.stroke();
        this.con.closePath();
    }

    printImage(name, x, y, w=0, h=0){
        var img = document.getElementById(name);
        if (h == 0){w = img.width; h = img.height;}
        this.con.drawImage(img,x,y,w,h);
    }

}