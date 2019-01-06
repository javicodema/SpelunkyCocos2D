var TrampaRalentizar = cc.Class.extend({
    gameLayer:null,
    shape:null,
    ctor:function (gameLayer, posicion, ancho, alto) {
        this.gameLayer = gameLayer;
        // Cuerpo estatico, NO le afectan las fuerzas
        this.body = new cp.Body(5, cp.momentForBox(1,ancho,alto));

        posicion.x += ancho/2;
        posicion.y += alto/2;

        this.body = new cp.Body(5, cp.momentForBox(1,
            ancho,
            alto));
        this.body.setPos( posicion )
        //Guardamos una referencia para las colisiones
        this.body.userData = this;

        // forma 16px más pequeña que la imagen original
        this.shape = new cp.BoxShape(this.body, ancho, alto);

        this.shape.setCollisionType(tipoTrampaRalentizar);

        gameLayer.space.addStaticShape(this.shape)
    }
});
