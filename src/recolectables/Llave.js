var Llave = cc.Class.extend({
    gameLayer:null,
    sprite:null,
    shape:null,
ctor:function (gameLayer, posicion) {
    this.gameLayer = gameLayer;

    // Crear Sprite
    this.sprite = new cc.PhysicsSprite(res.llave); // conseguir sprite
    // Cuerpo estatico, no le afectan las fuerzas, gravedad, etc.
    var body = new cp.StaticBody();
    posicion.x += this.sprite.getContentSize().width/2;
            posicion.y += this.sprite.getContentSize().height/2;
    body.setPos(posicion);
    this.sprite.setBody(body);

    // Crear forma circular
    var radio = this.sprite.getContentSize().width / 2;
    this.shape = new cp.CircleShape(body, radio , cp.vzero);
    this.shape.setCollisionType(tipoLlave);
    // Nunca setSensor(true) no genera choques es como un “fantasma”
    this.shape.setSensor(true);
    // Añadir forma estática al Space
    this.gameLayer.space.addStaticShape(this.shape);
    // Añadir sprite a la capa
    this.gameLayer.addChild(this.sprite,10);
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
