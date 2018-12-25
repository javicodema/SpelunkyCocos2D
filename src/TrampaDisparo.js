var TrampaDisparo = cc.Class.extend({
    orientacion:1,
    sprite:null,
    shape:null,
    body:null,
    triggerBody: null,
    triggerShape:null,
    activo: false,
    finAccion: false,
    causo_herida: false,
    ctor:function (gameLayer, posicion, trigger) {
        this.gameLayer = gameLayer;


        // Crear Sprite - Cuerpo y forma
        this.sprite = new cc.PhysicsSprite(res.trampa_tirar_encima);
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
        this.shape.setCollisionType(tipoTrampaDisparo);
        // forma dinamica1
        //gameLayer.space.addStaticShape(this.shape);
        // añadir sprite a la capa
        gameLayer.addChild(this.sprite,10);


        //Añadir el trigger
        this.triggerBody = new cp.Body(5, cp.momentForBox(1,
            trigger['width'],
            trigger['height']));
        this.triggerBody.setPos( cc.p(trigger['x']+trigger['width']/2, trigger['y']+trigger['height']/2) )
        //Guardamos una referencia para las colisiones
        this.triggerBody.userData = this;

        // forma 16px más pequeña que la imagen original
        this.triggerShape = new cp.BoxShape(this.triggerBody,
            trigger['width'],
            trigger['height']);

        this.triggerShape.setCollisionType(tipoTriggerDisparo);

        // forma dinamica1
        gameLayer.space.addStaticShape(this.triggerShape);

    },
    actualizar: function(x,y) {

    },
    activar: function(){
        this.gameLayer.space.removeStaticShape(this.triggerShape);
    },
    desactivar: function(){

    }

});