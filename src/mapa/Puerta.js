var Puerta = cc.Class.extend({
    sprite:null,
    shape:null,
    body:null,
    gameLayer:null,
    ctor:function (gameLayer, posicion) {
        this.gameLayer = gameLayer;


        // Crear Sprite - Cuerpo y forma
        this.sprite = new cc.PhysicsSprite("#puerta1.png");
        // Cuerpo estatico, no le afectan las fuerzas, gravedad, etc.
        this.body = new cp.StaticBody();
        posicion.x += this.sprite.getContentSize().width/2;
                posicion.y += this.sprite.getContentSize().height/2;
        this.body.setPos(posicion);
        this.sprite.setBody(this.body);
        this.shape = new cp.BoxShape(this.body,
            this.sprite.getContentSize().width,
            this.sprite.getContentSize().height);
        this.shape.setCollisionType(tipoPuerta);
        this.shape.setSensor(true);
        // Añadir forma estática al Space
        this.gameLayer.space.addStaticShape(this.shape);
        // Añadir sprite a la capa
        this.gameLayer.addChild(this.sprite,10);

         // Crear animación
            var framesAnimacion = [];
            for (var i = 1; i <= 60; i++) {
                var str = "puerta" + i + ".png";
                var frame = cc.spriteFrameCache.getSpriteFrame(str);
                framesAnimacion.push(frame);
            }
            var animacion = new cc.Animation(framesAnimacion, 0.02);
            var actionAnimacionBucle =
                new cc.RepeatForever(new cc.Animate(animacion));
            // ejecutar la animación
            this.sprite.runAction(actionAnimacionBucle);
    },
      eliminar: function (){
          // quita la forma
          this.gameLayer.space.removeShape(this.shape);

          // quita el cuerpo *opcional, funciona igual
          // NO: es un cuerpo estático, no lo añadimos, no se puede quitar.
          // this.gameLayer.space.removeBody(shape.getBody());

          // quita el sprite
          this.gameLayer.removeChild(this.sprite);
      }


});