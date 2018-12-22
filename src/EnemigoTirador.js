var EnemigoTirador = cc.Class.extend({
    gameLayer:null,
    orientacion:1,
    sprite:null,
    shape:null,
    ctor:function (gameLayer, posicion) {
        this.gameLayer = gameLayer;

        // Crear Sprite - Cuerpo y forma
        this.sprite = new cc.PhysicsSprite("#cuervo1.png");
        // Cuerpo estática , no le afectan las fuerzas
        // Cuerpo dinámico, SI le afectan las fuerzas
        this.body = new cp.Body(5,Infinity);
        this.body.setPos(posicion);
        this.body.setAngle(0);
        this.sprite.setBody(this.body);
        // Se añade el cuerpo al espacio
        gameLayer.space.addBody(this.body);

        // forma
        this.shape = new cp.BoxShape(this.body,
            this.sprite.getContentSize().width,
            this.sprite.getContentSize().height);
        this.shape.setCollisionType(tipoEnemigo);
        // agregar forma dinamica
        gameLayer.space.addShape(this.shape);


        var mitadAncho = this.sprite.getContentSize().width/2;
        var mitadAlto = this.sprite.getContentSize().height/2;
// más pequeño

        this.shapeIzquierda = new cp.PolyShape(this.body,
            [ -mitadAncho, 0, -mitadAncho, -mitadAlto - 10] ,
            cp.v(0,0) );

        this.shapeIzquierda.setSensor(true);
        this.shapeIzquierda.setCollisionType(tipoEnemigoIzquierda);
// agregar forma dinamica
        gameLayer.space.addShape(this.shapeIzquierda);

        this.shapeDercha = new cp.PolyShape(this.body,
            [ mitadAncho, 0, mitadAncho, -mitadAlto - 10] ,
            cp.v(0,0) );

        this.shapeDercha.setSensor(true);
        this.shapeDercha.setCollisionType(tipoEnemigoDerecha);
// agregar forma dinamica
        gameLayer.space.addShape(this.shapeDercha);


        // añadir sprite a la capa
        gameLayer.addChild(this.sprite,10);

        // Crear animaciones
        var framesAnimacion = [];
        for (var i = 1; i <= 8; i++) {
            var str = "cuervo" + i + ".png";
            var frame = cc.spriteFrameCache.getSpriteFrame(str);
            framesAnimacion.push(frame);
        }
        var animacion = new cc.Animation(framesAnimacion, 0.2);
        var actionAnimacionBucle =
            new cc.RepeatForever(new cc.Animate(animacion));
        // ejecutar la animación
        this.sprite.runAction(actionAnimacionBucle);

        gameLayer.space.addCollisionHandler(tipoSuelo, tipoEnemigoIzquierda,
            null, null, null, this.noSueloIzquierda.bind(this));

        gameLayer.space.addCollisionHandler(tipoSuelo, tipoEnemigoDerecha,
            null, null, null, this.noSueloDerecha.bind(this));

    },
    noSueloDerecha : function(){
        this.orientacion = -1;
    },
    noSueloIzquierda: function(){
        this.orientacion = 1;
    },
    actualizar: function(x,y){
        if((Math.abs(this.body.p.x - x)) < 350){
            if(this.orientacion==1){
                this.sprite.flippedX = false;
                if ((this.body.p.y + 50) > y && (this.body.p.y - 50) < y){
                    if((this.body.p.x - 20) < x) {
                        this.sprite.flippedX = true;
                        this.orientacion = -1;
                    }
                    else{
                    }
                }
            }else{
                this.sprite.flippedX = true;
                if ((this.body.p.y + 50) > y && (this.body.p.y - 50) < y){
                    if((this.body.p.x - 20) > x) {
                        this.sprite.flippedX = false;
                        this.orientacion = 1;
                    }
                    else{
                    }
                }

            }
        }

    }



});
