var jugadorAntiguo;
var NextLevelLayer = cc.Layer.extend({
    ctor:function (puntuacion) {
    this._super();
    var size = cc.winSize;
    var spriteFondoTitulo= new cc.Sprite(res.level_sprite);
    // Asigno posición central
    spriteFondoTitulo.setPosition(cc.p(size.width / 2, size.height / 2));
    // Lo escalo porque es más pequeño que la pantalla
    spriteFondoTitulo.setScale(size.height / spriteFondoTitulo.height);
    // Añado Sprite a la escena
    this.addChild(spriteFondoTitulo);

    this.etiquetaPuntos = new cc.LabelTTF(puntuacion, "Helvetica", 60);
    this.etiquetaPuntos.setPosition(cc.p(size.width/2, size.height*0.7));
    this.etiquetaPuntos.fillStyle = new cc.Color(255, 255, 255, 0);
    this.addChild(this.etiquetaPuntos);

    //MenuItemSprite para cada botón
    var menuBotonVelocidad = new cc.MenuItemSprite(
        new cc.Sprite(res.boton_velocidad_png), // IMG estado normal
        new cc.Sprite(res.boton_velocidad_png), // IMG estado pulsado
        this.pulsarBotonVelocidad, this);
    var menuBotonVida = new cc.MenuItemSprite(
        new cc.Sprite(res.boton_vida_png), // IMG estado normal
        new cc.Sprite(res.boton_vida_png), // IMG estado pulsado
        this.pulsarBotonVida, this);
    var menuBotonArma = new cc.MenuItemSprite(
        new cc.Sprite(res.boton_arma_png), // IMG estado normal
        new cc.Sprite(res.boton_arma_png), // IMG estado pulsado
        this.pulsarBotonArma, this);


    // creo el menú pasándole los botones
    var menu = new cc.Menu();
    menu.addChild(menuBotonVida);
    menu.addChild(menuBotonArma);
    menu.addChild(menuBotonVelocidad);
    menu.alignItemsHorizontally();
    // Asigno posición central
    menu.setPosition(cc.p(size.width / 2, size.height * 0.25));
    // Añado el menú a la escena
    this.addChild(menu);

    return true;

    },
    pulsarBotonArma : function(){
        jugadorAntiguo.pendienteDeArmar=true;
        cc.director.runScene(new GameScene());
    },
    pulsarBotonVida : function(){
        jugadorAntiguo.vidas++;
        cc.director.runScene(new GameScene());
    },
    pulsarBotonVelocidad : function(){
        jugadorAntiguo.bonificadorVelocidad+=100;
        cc.director.runScene(new GameScene());

    }
});

var idCapaSiguienteNivel = 1;

var NextLevelScene = cc.Scene.extend({
    onEnter:function () {
        this._super();
        var layer = new NextLevelLayer();
        this.addChild(layer, 0, idCapaSiguienteNivel);

    }
});