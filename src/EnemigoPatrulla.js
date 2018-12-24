var EnemigoPatrulla = cc.Class.extend({
    gameLayer:null,
    orientacion:1,
    vidas:1,
    sprite:null,
    shape:null,
    name:null,
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
        this.name = this.body.p.y;
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

    },
    actualizar: function(){

        if ( this.body.vx < 0.005 && this.body.vx > -0.005){
            this.orientacion = this.orientacion *-1;
        }

        if ( this.orientacion > 0){
            this.sprite.flippedX = true; // Invertir Sprite
            if (this.body.vx < 100){
                this.body.applyImpulse(cp.v(300, 0), cp.v(0, 0));
            } else { // vx mayor más de 100
                this.body.vx = 100;
            }
        }

        if ( this.orientacion < 0) {
            this.sprite.flippedX = false; // No invertir Sprite
            if (this.body.vx > -100){
                this.body.applyImpulse(cp.v(-300, 0), cp.v(0, 0));
            } else { // vx nunca menor que -100
                this.body.vx = -100; //limitado
            }
        }
    }



});
