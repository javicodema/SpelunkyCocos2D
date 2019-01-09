var BombaJugador = cc.Class.extend({
    gameLayer:null,
    sprite:null,
    shape:null,
    ctor:function (gameLayer, posicion) {
        this.gameLayer = gameLayer;

        // Crear Sprite - Cuerpo y forma
        this.sprite = new cc.PhysicsSprite(res.bomba);

        this.body = new cp.Body(10000, cp.momentForBox(1,
            this.sprite.getContentSize().width,
            this.sprite.getContentSize().height));

        posicion.x += this.sprite.getContentSize().width/2;
        posicion.y += this.sprite.getContentSize().height/2;
        this.body.setPos( posicion);
        this.body.setMoment( Infinity )
        this.body.userData = this;

        this.sprite.setBody(this.body);
        // Se añade el cuerpo al espacio
        gameLayer.space.addBody(this.body);

        // añadir sprite a la capa
        gameLayer.addChild(this.sprite,50);

        // Crear forma circular
        var radio = this.sprite.getContentSize().width / 2;
        this.shape = new cp.CircleShape(this.body,radio , cp.vzero);
        this.shape.setCollisionType(tipoBombaJugador);
        // Nunca setSensor(true) no genera choques es como un “fantasma”
        //this.shape.setSensor(true);

        // Añadir forma estática al Space
        this.gameLayer.space.addShape(this.shape);

        setTimeout( () => {
            this.detonar();
        }, 2000);
    },
    detonar: function(){
        this.gameLayer.space.addPostStepCallback( () => {
            this.gameLayer.space.removeShape( this.shape );
            this.gameLayer.space.removeBody( this.body );
            this.gameLayer.removeChild( this.sprite );

            var spawn1 = cc.p( this.body.p.x-20, this.body.p.y);
            var spawn2 = cc.p( this.body.p.x+20, this.body.p.y);

            var izquierda = new Disparo(this.gameLayer, spawn2 ,-1);
            var derecha = new Disparo(this.gameLayer, spawn1, 1);

            izquierda.origen = cc.p(spawn2.x, spawn2.y);
            derecha.origen = cc.p(spawn1.x, spawn1.y)

            izquierda.rango = 40;
            derecha.rango = 40;

            this.gameLayer.disparos.push( derecha )
            this.gameLayer.disparos.push( izquierda )

        } );
    }


});
