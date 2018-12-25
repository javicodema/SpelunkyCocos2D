var TrampaCaer = cc.Class.extend({
    orientacion:1,
    sprite:null,
    shape:null,
    body:null,
    activa: false,
    retardoCaida: 500,
    ctor:function (gameLayer, posicion) {
        this.gameLayer = gameLayer;


        // Crear Sprite - Cuerpo y forma
        this.sprite = new cc.PhysicsSprite(res.trampa_caer);
        // Cuerpo estatico, NO le afectan las fuerzas
        this.body = new cp.Body(10000, cp.momentForBox(1,
            this.sprite.getContentSize().width,
            this.sprite.getContentSize().height));

        posicion.x += this.sprite.getContentSize().width/2;
        posicion.y += this.sprite.getContentSize().height/2;
        this.body.setPos( posicion);
        this.body.setMoment( Infinity )
        this.body.userData = this;
        this.sprite.setBody(this.body)

        // forma 16px más pequeña que la imagen original
        this.shape = new cp.BoxShape(this.body,
            this.sprite.getContentSize().width,
            this.sprite.getContentSize().height);
        this.shape.setCollisionType(tipoTrampaCaer);
        // forma dinamica1
        gameLayer.space.addShape(this.shape);
        // añadir sprite a la capa
        gameLayer.addChild(this.sprite,10);

    },
    actualizar: function(x,y) {

    },
    activar: function(){
        setTimeout(  () => {
            this.gameLayer.space.addPostStepCallback( () => {
                this.gameLayer.space.addBody( this.body );
            } )
        } ,this.retardoCaida );

        setTimeout(  () => {
            this.gameLayer.space.addPostStepCallback( () => {
                this.gameLayer.space.removeBody(( this.body ));
                this.gameLayer.space.removeShape(( this.shape ));
                this.gameLayer.removeChild( this.sprite )
            } )
        } ,2000 );
    }

});