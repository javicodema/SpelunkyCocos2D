var tipoSuelo = 1;
var tipoJugador = 2;


var GameLayer = cc.Layer.extend({
    space:null,
    mapa: null,
    mapaAncho: null,
    jugador: null,
    ctor:function () {
        this._super();
        var size = cc.winSize;


        // Inicializar Space
        this.space = new cp.Space();
        this.space.gravity = cp.v(0, -350);
        // Depuración
        this.depuracion = new cc.PhysicsDebugNode(this.space);
        this.addChild(this.depuracion, 10);

        this.jugador = new Jugador(this, cc.p(50,150));
        this.cargarMapa();
        this.scheduleUpdate();

        // Zona de escuchadores de colisiones
// Colisión Suelo y Jugador
        this.space.addCollisionHandler(tipoSuelo, tipoJugador,
            null, null, this.collisionSueloConJugador.bind(this), this.finCollisionSueloConJugador.bind(this));



        return true;
    },
    update:function (dt) {

        this.jugador.actualizar();
        this.space.step(dt);
        // Mover la capa hacia atras(scroll)
        var posicionXJugador = this.jugador.body.p.x - 100;
        var posicionYJugador = this.jugador.body.p.y - 100;
        this.setPosition(cc.p( -posicionXJugador, -posicionYJugador));

        // Controlar el angulo (son radianes) max y min.
        if ( this.jugador.body.a > 0.44 ){
            this.jugador.body.a = 0.44;
        }
        if ( this.jugador.body.a < -0.44){
            this.jugador.body.a = -0.44;
        }
        // controlar la velocidad X , max y min
        if (this.jugador.body.vx < 250){
            this.jugador.body.applyImpulse(cp.v(300, 0), cp.v(0, 0));
        }
        if (this.jugador.body.vx > 400){
            this.jugador.body.vx = 400;
        }
        // controlar la velocidad Y , max
        if (this.jugador.body.vy > 450){
            this.jugador.body.vy = 450;
        }

    },cargarMapa:function (mapa) {
        this.mapa = new cc.TMXTiledMap(mapa);
        // Añadirlo a la Layer
        this.addChild(this.mapa);
        // Ancho del mapa
        this.mapaAncho = this.mapa.getContentSize().width;

        // Solicitar los objeto dentro de la capa Suelos
        var grupoSuelos = this.mapa.getObjectGroup("Suelos");
        var suelosArray = grupoSuelos.getObjects();

        // Los objetos de la capa suelos se transforman a
        // formas estáticas de Chipmunk ( SegmentShape ).
        for (var i = 0; i < suelosArray.length; i++) {
            var suelo = suelosArray[i];
            var puntos = suelo.polylinePoints;
            for(var j = 0; j < puntos.length - 1; j++){
                var bodySuelo = new cp.StaticBody();

                var shapeSuelo = new cp.SegmentShape(bodySuelo,
                    cp.v(parseInt(suelo.x) + parseInt(puntos[j].x),
                        parseInt(suelo.y) - parseInt(puntos[j].y)),
                    cp.v(parseInt(suelo.x) + parseInt(puntos[j + 1].x),
                        parseInt(suelo.y) - parseInt(puntos[j + 1].y)),
                    10);
                shapeSuelo.setCollisionType(tipoSuelo);
                this.space.addStaticShape(shapeSuelo);

            }
        }




    },
    collisionSueloConJugador: function (arbiter, space) {
        this.jugador.tocaSuelo();
    },
    finCollisionSueloConJugador:function (arbiter, space) {
        this.jugador.estado = estadoSaltando;
    }
});

var idCapaJuego = 1;
var idCapaControles = 2;


var GameScene = cc.Scene.extend({
    onEnter:function () {
        this._super();
        var layer = new GameLayer();
        this.addChild(layer, 0, idCapaJuego);

        var controlesLayer = new ControlesLayer();
        this.addChild(controlesLayer, 0, idCapaControles);

    }
});
