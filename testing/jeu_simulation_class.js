class Jeu {
    constructor() {
        this.char_x     = 0.2;
        this.char_h     = 0.2;
        this.ground     = 0.9;
        this.distance   = 0;
        this.speed      = 0.005;

        this.period     = 10;
        this.timer      = 0;
        this.gravity    = 0.001;
        this.proj       = new Array();
        this.bow        = new Array();
        this.bow[0]     = Math.floor(Math.random()*this.period);
    }

    move(){
        this.distance += this.speed;
        /**Update projectiles */
        for(var i=0; i<this.proj.length; i++){
            this.proj[i].x -= this.speed;
        }
    }

    update(){
        this.timer = (this.timer + 1) % this.period;
        /**Update projectiles */
        for(var i=0; i<this.proj.length; i++){
            this.proj[i].x += this.proj[i].dx;
            this.proj[i].y += this.proj[i].dy;
            this.proj[i].dy += this.gravity;
            if (this.proj[i].y >= 1){
                this.proj.splice(i, 1);
                i -= 1;
            }
        }
        /**Add projectile */
        for(var i=0; i<this.bow.length; i++){
            if (this.timer == this.bow[i]){
                var angle = -Math.PI/4;
                var strength = 4;
                this.add_proj(this.char_x*1.1, this.ground - (this.char_h*1.1), strength*this.speed*Math.cos(angle), strength*this.speed*Math.sin(angle));
            }
        }
    }

    add_proj(x,y,dx,dy){
        var index = this.proj.length;
        this.proj[index] = {x:x, y:y, dx:dx, dy:dy};
    }

    display(jeu_display){
        jeu_display.clearMap(this.distance, this.ground);
        jeu_display.display_character(this.char_x, this.char_h, this.ground);
        for(var i=0; i<this.proj.length; i++){
            jeu_display.display_proj(this.proj[i].x, this.proj[i].y, this.proj[i].dx, this.proj[i].dy);
        }
    }
}
  