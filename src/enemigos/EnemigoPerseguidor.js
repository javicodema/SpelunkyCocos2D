var EnemigoPerseguidor = cc.Class.extend({
    gameLayer:null,
    orientacion:1,
    vidas:1,
    sprite:null,
    shape:null,
    ctor:function (gameLayer, posicion) {
        this.gameLayer = gameLayer;

        // Crear Sprite - Cuerpo y forma
        this.sprite = new cc.PhysicsSprite("#aguila1.png");
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
        this.shapeArriba = new cp.PolyShape(this.body,
            [ -mitadAncho, mitadAlto, mitadAncho, mitadAlto] ,
            cp.v(0,0) );

        //this.shapeArriba.setSensor(true);
        this.shapeArriba.setCollisionType(tipoEnemigoArriba);
        gameLayer.space.addShape(this.shapeArriba);

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


        gameLayer.addChild(this.sprite,10);


        // Crear animaciones
        var framesAnimacionIzq = [];
        var b = 0;
        for (var i = 0; i <= 3; i++) {
            b = i*2 + 1;
            var str = "aguila" + b + ".png";
            var frame = cc.spriteFrameCache.getSpriteFrame(str);
            framesAnimacionIzq.push(frame);
        }
        var framesAnimacionDer = [];
        for (var i = 1; i <= 4; i++) {
            b = i*2;
            var str = "aguila" + b + ".png";
            var frame = cc.spriteFrameCache.getSpriteFrame(str);
            framesAnimacionDer.push(frame);
        }

        var animacionIzq = new cc.Animation(framesAnimacionIzq, 0.2);
        this.izquierda  =
            new cc.RepeatForever(new cc.Animate(animacionIzq));
        this.izquierda.retain();

        var animacionDer = new cc.Animation(framesAnimacionDer, 0.2);
        this.derecha  =
            new cc.RepeatForever(new cc.Animate(animacionDer));
        this.derecha.retain();

        this.animacion=this.izquierda;
        // ejecutar la animación
        this.sprite.runAction(this.izquierda);


    },
    actualizar: function(x,y){
        if((Math.abs(this.body.p.x - x)) < 350){
            if(this.orientacion==1){
                if ((this.body.p.y + 50) > y && (this.body.p.y - 50) < y){
                    if((this.body.p.x - 20) < x) {
                        this.orientacion = -1;
                        this.animacion = this.derecha;
                        this.sprite.stopAllActions();
                        this.sprite.runAction(this.animacion);
                        this.body.vx = 100;
                    }
                    else{
                        this.body.vx=-100;
                    }
                }else{
                    this.body.vx=0;
                }
            }else{
                if ((this.body.p.y + 50) > y && (this.body.p.y - 50) < y){
                    if((this.body.p.x - 20) > x) {
                        this.orientacion = 1;
                        this.animacion = this.izquierda;
                        this.sprite.stopAllActions();
                        this.sprite.runAction(this.animacion);
                        this.body.vx = -100;
                    }
                    else{
                        this.body.vx=100;
                    }
                }else{
                    this.body.vx=0;
                }

            }
        }else{
            this.body.vx=0;
        }

    }



});
