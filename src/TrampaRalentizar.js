var TrampaRalentizar = cc.Class.extend({
    gameLayer:null,
    shape:null,
    ctor:function (gameLayer, posicion, ancho, alto) {
        this.gameLayer = gameLayer;
        // Cuerpo estatico, NO le afectan las fuerzas
        this.body = new cp.Body(10000, cp.momentForBox(1,ancho,alto));

        posicion.x += ancho/2;
        posicion.y += alto/2;
        this.body.setPos( posicion);
        this.body.setMoment( Infinity )
        this.body.userData = this;
        //this.sprite.setBody(this.body)

        // forma 16px más pequeña que la imagen original
        this.shape = new cp.BoxShape(this.body, ancho,alto);
        this.shape.setCollisionType(tipoTrampaRalentizar);
        // forma dinamica1
        //gameLayer.space.addStaticShape(this.shape);
        // añadir sprite a la capa
    }


});
