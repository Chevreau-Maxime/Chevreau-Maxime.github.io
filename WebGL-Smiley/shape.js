class Shape {
    vertex = new Array();
    index = new Array();
    constructor(){
        this.vertex = new Array();
        this.index = new Array();
    }

    scale(valueX, valueY, valueZ){
        for (var i=0; i<24; i++){
            this.vertex[i*6 + 0] *= valueX;
            this.vertex[i*6 + 1] *= valueY;
            this.vertex[i*6 + 2] *= valueZ;
        }
    }

    translate(valueX, valueY, valueZ){
        for (var i=0; i<24; i++){
            this.vertex[i*6 + 0] += valueX;
            this.vertex[i*6 + 1] += valueY;
            this.vertex[i*6 + 2] += valueZ;
        }
    }


    isCube(){
        this.vertex = new Array(144); // 6 faces, 4 vertices, 6 values (3 pos, 3 color)
        this.index = new Array(36); // 6 faces, 2 triangles, 3 vertices
        var face = 0;
        var colors = new Array(18);
        colors =   [1.0, 0.0, 0.0,
                    0.0, 1.0, 0.0,
                    0.0, 0.0, 1.0,
                    1.0, 1.0, 0.0,
                    0.0, 1.0, 1.0,
                    1.0, 0.0, 1.0
                    ];
        //Do the faces and colors
        for (var x=-1; x<=1; x+=1){
        for (var y=-1; y<=1; y+=1){
        for (var z=-1; z<=1; z+=1){
            if (Math.abs(x)+Math.abs(y)+Math.abs(z) == 1){ //vector (x,y,z) is on an axis
                for (var point=0; point<4; point++){ //which point
                    //Approx Positions
                    this.vertex[(face*24 + point*6) + 0] = x;
                    this.vertex[(face*24 + point*6) + 1] = y;
                    this.vertex[(face*24 + point*6) + 2] = z;
                    //Colors
                    for (var i=0; i<3; i++){
                        this.vertex[(face*24 + point*6) + 3 + i] = colors[(face*3) + i];
                    }
                }
                face += 1;
            }
        }
        }            
        }

        //Refine positions
        for(face=0; face<6; face++){
            var point = 0;
            for(var i=-1; i<=1; i+=2){ //2 coord vector to change both zeroes
                for(var j=-1; j<=1; j+=2){
                    if (this.vertex[face*24 + point*6 + 0] != 0){
                        this.vertex[face*24 + point*6 + 1] = i;
                        this.vertex[face*24 + point*6 + 2] = j; 
                    } else if (this.vertex[face*24 + point*6 + 1] != 0){
                        this.vertex[face*24 + point*6 + 0] = i;
                        this.vertex[face*24 + point*6 + 2] = j;
                    } else {
                        this.vertex[face*24 + point*6 + 0] = i;
                        this.vertex[face*24 + point*6 + 1] = j;
                    }
                    point += 1;
                }
            }
        }

        //INDEXES
        var arr = [0, 4, 8, 12, 16, 20];
        for (var f=0; f<6; f++){
            //1st
            this.index[(f*6) + 0] = arr[f]+0;
            this.index[(f*6) + 1] = arr[f]+1 + (f%2);
            this.index[(f*6) + 2] = arr[f]+2 - (f%2);
            //2nd
            this.index[(f*6) + 3] = arr[f] + 1;
            this.index[(f*6) + 4] = arr[f]+3 - (f%2);
            this.index[(f*6) + 5] = arr[f]+2 + (f%2);
        }
        console.log(this);
    } //END CUBE

}