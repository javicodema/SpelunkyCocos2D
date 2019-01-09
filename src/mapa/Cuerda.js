var Cuerda = cc.Class.extend({
    gameLayer:null,
    orientacion:1,
    sprite:null,
    shape:null,
    rotacion_max: 40,
    rotation_dir: 1,
    ctor:function (gameLayer, posicion, orientacion) {
        this.gameLayer = gameLayer;

        this.orientacion=orientacion;
        // Crear Sprite - Cuerpo y forma
        this.sprite = new cc.PhysicsSprite(res.cuerda);
        this.body = new cp.Body(10000, cp.momentForBox(1,
            this.sprite.getContentSize().width,
            this.sprite.getContentSize().height));

        this.body.setPos(posicion)


        this.body.setAngle(0);

        /*
        var verts = [];
        verts.push( new cp.v( posicion.x-this.sprite.getContentSize().width/2, posicion.y-this.sprite.getContentSize().height/2 ) );
        verts.push( new cp.v( posicion.x-this.sprite.getContentSize().width/2, posicion.y+this.sprite.getContentSize().height/2 ) );
        verts.push( new cp.v( posicion.x+this.sprite.getContentSize().width/2, posicion.y+this.sprite.getContentSize().height/2 ) );
        verts.push( new cp.v( posicion.x+this.sprite.getContentSize().width/2, posicion.y-this.sprite.getContentSize().height/2 ) );

        console.log(verts)
        var momento = cp.momentForPoly(10, verts, new cp.v( 0, -this.sprite.getContentSize().height/2  )  );
        console.log(momento)
        this.body.setMoment(momento );
        */

        this.sprite.set
        this.sprite.setBody(this.body);



        // Se añade el cuerpo al espacio
        //gameLayer.space.addBody(this.body);

        this.shape = new cp.BoxShape(this.body,
            this.sprite.getContentSize().width,
            this.sprite.getContentSize().height);

        this.shape.setCollisionType(tipoCuerda);

        // agregar forma dinamica
        gameLayer.space.addShape(this.shape);

        // añadir sprite a la capa
        gameLayer.addChild(this.sprite,1);

    },
    update: function(){

        var currentRotation = Math.degrees( this.body.a );
        if( Math.abs(currentRotation) <= this.rotacion_max ){
            var incremento = 1 * this.rotation_dir;
            this.body.setAngle( Math.radians( currentRotation + incremento ) );
        }
        else if( Math.abs(currentRotation) >= this.rotacion_max ){
            this.rotation_dir *= -1;
            var incremento = 1 * this.rotation_dir;
            this.body.setAngle( Math.radians( currentRotation + incremento ) );
        }
    }


});
