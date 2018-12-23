var Disparo = cc.Class.extend({
    gameLayer:null,
    orientacion:1,
    sprite:null,
    shape:null,
    ctor:function (gameLayer, posicion, orientacion) {
        this.gameLayer = gameLayer;

        this.orientacion=orientacion;
        // Crear Sprite - Cuerpo y forma
        this.sprite = new cc.PhysicsSprite(res.disparo_png);

        this.body = new cp.Body(5,Infinity);
        this.body.setPos(posicion);
        this.body.setAngle(0);
        if(this.orientacion==-1) this.body.vx=300;
        else this.body.vx = -300;
        this.sprite.setBody(this.body);
        // Se añade el cuerpo al espacio
        gameLayer.space.addBody(this.body);

        // forma
        this.shape = new cp.BoxShape(this.body,
            this.sprite.getContentSize().width,
            this.sprite.getContentSize().height);
        this.shape.setCollisionType(tipoDisparo);
        // agregar forma dinamica
        gameLayer.space.addShape(this.shape);


        var mitadAncho = this.sprite.getContentSize().width/2;
        var mitadAlto = this.sprite.getContentSize().height/2;

        // añadir sprite a la capa
        gameLayer.addChild(this.sprite,10);

    }


});
