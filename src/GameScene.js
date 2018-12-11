var tipoSuelo = 1;
var tipoJugador = 2;
var tipoEnemigo = 3;


var GameLayer = cc.Layer.extend({
    space:null,
    mapa: null,
    mapaAncho: null,
    jugador: null,
    ctor:function () {
        this._super();
        var size = cc.winSize;

        //Zona de cache
        cc.spriteFrameCache.addSpriteFrames(res.jugador_caminar_plist);
        cc.spriteFrameCache.addSpriteFrames(res.jugador_agachado_plist);
        cc.spriteFrameCache.addSpriteFrames(res.jugador_salto_bajando_plist);
        cc.spriteFrameCache.addSpriteFrames(res.jugador_salto_subiendo_plist);
        cc.spriteFrameCache.addSpriteFrames(res.jugador_mov_escalera_plist);
        cc.spriteFrameCache.addSpriteFrames(res.jugador_idle_plist);

        // Inicializar Space
        this.space = new cp.Space();
        this.space.gravity = cp.v(0, -500);
        // Depuración
        this.depuracion = new cc.PhysicsDebugNode(this.space);
        this.addChild(this.depuracion, 10);

        this.jugador = new Jugador(this, cc.p(50,150));
        this.cargarMapa(res.mapa_prueba_tmx); //habria que meter el mapa como parametro
        this.scheduleUpdate();

        // Zona de escuchadores de colisiones
    // Colisión Suelo y Jugador
        this.space.addCollisionHandler(tipoSuelo, tipoJugador,
            null, null, this.collisionSueloConJugador.bind(this), this.finCollisionSueloConJugador.bind(this));
        this.space.addCollisionHandler(tipoJugador, tipoEnemigo,
            null, null, this.collisionEnemigoConJugador.bind(this), this.finCollisionEnemigoConJugador.bind(this));

        return true;
    },
    update:function (dt) {

        this.jugador.actualizar();
        this.space.step(dt);


        // Controlar el angulo (son radianes) max y min.
        if ( this.jugador.body.a > 0.44 ){
            this.jugador.body.a = 0.44;
        }
        if ( this.jugador.body.a < -0.44){
            this.jugador.body.a = -0.44;
        }


        //Leer controles jugador
        var capaControles = this.getParent().getChildByTag(idCapaControles);
        controles = capaControles.teclas_pulsadas;

        //Control de salto
        if( controles.saltar ){
            this.jugador.saltar();
        }

        //Controles de movimiento
        if( controles.abajo ){
            if( this.jugador.estado == estadoTrepando ){
                //Trepar hacia abajo
            }
            else {
                this.jugador.agachado();
            }
        }
        if( controles.arriba ){
            if( this.jugador.estado == estadoTrepando ){
                //Trepar hacia arriba
            }
        }

        if( controles.mov_derecho ){
            this.jugador.moverDerecha();
        }
        else if( controles.mov_izquierdo){
            this.jugador.moverIzquierda();
        }
        else{
            this.jugador.body.vx = 0;
        }
        //Controles acciones
        if(controles.lanzar_objeto){

        }
        if(controles.ataque) {

        }
        //Controles de camara
        var offsetCamara_x = 0
        var offsetCamara_y = 0;
        if( controles.mirar_izquierda ){
            offsetCamara_x = -100;
        }
        else if( controles.mirar_derecha){
            offsetCamara_x = 100;
        }
        if( controles.mirar_arriba){
            offsetCamara_y = 20;
        }
        else if( controles.mirar_abajo){
            offsetCamara_y = -100;
        }
        //Control pausa
        if( controles.pausa ){

        }


        // Mover la capa hacia atras(scroll)
        var posicionXJugador = this.jugador.body.p.x - 400 + offsetCamara_x;
        var posicionYJugador = this.jugador.body.p.y - 50 + offsetCamara_y;
        this.setPosition(cc.p( -posicionXJugador, -posicionYJugador));

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

            //El mapa de pruebas usa polygonPoints, cambiar con mapa definitivo
            //var puntos = suelo.polylinePoints;
            var puntos = suelo.polygonPoints;
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




    },collisionEnemigoConJugador: function (arbiter, space) {
        //a rellenar
    },
    finCollisionEnemigoConJugador:function (arbiter, space) {
        //a rellenar
    },
    collisionSueloConJugador: function (arbiter, space) {
        this.jugador.tocaSuelo();
    },
    finCollisionSueloConJugador:function (arbiter, space) {

        //Si deja el suelo sin haber saltado (Ej: Caerse) no tiene doble salto.
        if( this.jugador.estado != estadoSaltando ) {
            this.jugador.saltosAcutales++

            //Evitar efecto de tobogan al dejar el suelo.
            this.jugador.body.vx = 0;
            this.jugador.body.vy = 0;
        }
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
