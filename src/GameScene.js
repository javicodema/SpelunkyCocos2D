var tipoSuelo = 1;
var tipoJugador = 2;
var tipoEnemigo = 3;
var tipoEnemigoDerecha = 4;
var tipoEnemigoIzquierda = 5;
var tipoDisparo = 6;
var tipoEnemigoArriba = 8;

var GameLayer = cc.Layer.extend({
    space:null,
    mapa: null,
    mapaAncho: null,
    enemigos:[],
    tiradores:[],
    disparos:[],
    formasEliminar:[],
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
        cc.spriteFrameCache.addSpriteFrames(res.jugador_impactado_plist);
        cc.spriteFrameCache.addSpriteFrames(res.jugador_idle_plist);
        cc.spriteFrameCache.addSpriteFrames(res.animacion_cuervo_plist);

        // Inicializar Space
        this.space = new cp.Space();
        this.space.gravity = cp.v(0, -500);
        // Depuración
        this.depuracion = new cc.PhysicsDebugNode(this.space);
        this.addChild(this.depuracion, 10);

        this.cargarMapa(res.mapa_1_tmx); //habria que meter el mapa como parametro
        this.scheduleUpdate();

        // Zona de escuchadores de colisiones
    // Colisión Suelo y Jugador
        this.space.addCollisionHandler(tipoSuelo, tipoJugador,
            null, null, this.collisionSueloConJugador.bind(this), this.finCollisionSueloConJugador.bind(this));
        this.space.addCollisionHandler(tipoJugador, tipoEnemigo,
            null, null, this.collisionEnemigoConJugador.bind(this), this.finCollisionEnemigoConJugador.bind(this));
        this.space.addCollisionHandler(tipoJugador, tipoDisparo,
            null, null, this.collisionDisparoConJugador.bind(this), null);
        this.space.addCollisionHandler(tipoSuelo, tipoDisparo,
            null, null, this.collisionDisparoConSuelos.bind(this), null);
        this.space.addCollisionHandler(tipoEnemigo, tipoDisparo,
            null, null, this.collisionDisparoConEnemigo.bind(this), null);
        this.space.addCollisionHandler(tipoJugador, tipoEnemigoArriba,
            null, null, this.jugadorSalto.bind(this), null);

        return true;
    },
    update:function (dt) {
        var capaControles =
            this.getParent().getChildByTag(idCapaControles);
        capaControles.actualizarVida(this.jugador.vidas);

        this.jugador.actualizar();
        this.space.step(dt);
        for (var j = 0; j < this.disparos.length; j++) {
            this.disparos[j].body.vy=0;
        }


        for(var i = 0; i < this.formasEliminar.length; i++) {
            var shape = this.formasEliminar[i];

            for (var j = 0; j < this.disparos.length; j++) {
                if (this.disparos[j] != null &&
                    this.disparos[j].body.shapeList[0] == shape) {
                    this.space.removeShape(shape);
                    this.space.removeBody(shape.getBody());
                    this.disparos[j].sprite.removeFromParent();
                    this.disparos.splice(j, 1);
                }
            }
            for (var j = 0; j < this.enemigos.length; j++) {
                if (this.enemigos[j] != null &&
                    this.enemigos[j].body.shapeList[0] == shape) {
                    this.space.removeShape(shape);
                    this.space.removeBody(shape.getBody());
                    this.enemigos[j].sprite.removeFromParent();
                    this.enemigos.splice(j, 1);

                }
            }
            for (var j = 0; j < this.tiradores.length; j++) {
                if (this.tiradores[j] != null &&
                    (this.tiradores[j].body.shapeList[0] == shape ||
                        this.tiradores[j].body.shapeList[1] == shape)) {
                    this.space.removeShape(this.tiradores[j].body.shapeList[0]);
                    this.space.removeShape(this.tiradores[j].body.shapeList[1]);
                    this.space.removeBody(shape.getBody());
                    this.tiradores[j].sprite.removeFromParent();
                    this.tiradores.splice(j, 1);
                }
            }
        }
        this.formasEliminar = [];
        var i = 0;
        for(i=0;i<this.enemigos.length;i++){
            this.enemigos[i].actualizar(this.jugador.body.p.x,this.jugador.body.p.y);
        }

        i = 0;
        for(i=0;i<this.tiradores.length;i++){
            if(this.tiradores[i].actualizar(this.jugador.body.p.x,this.jugador.body.p.y)){
               if(this.tiradores[i].orientacion==1){
                   var disparo =  new Disparo(this,
                       cc.p(this.tiradores[i].body.p.x-30,this.tiradores[i].body.p.y),this.tiradores[i].orientacion);
               } else{
                   var disparo =  new Disparo(this,
                       cc.p(this.tiradores[i].body.p.x+30,this.tiradores[i].body.p.y),this.tiradores[i].orientacion);
               }

              this.disparos.push(disparo);
            }
        }


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

        var jugadores = this.mapa.getObjectGroup("jugador");
        var jugadorArray = jugadores.getObjects();
        this.jugador = new Jugador(this,
                cc.p(jugadorArray[0]["x"],jugadorArray[0]["y"]));

        // Solicitar los objeto dentro de la capa Suelos
        var grupoSuelos = this.mapa.getObjectGroup("suelos");
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


        var grupoEnemigos = this.mapa.getObjectGroup("patrullas");
        var enemigosArray = grupoEnemigos.getObjects();
  /*      for (var i = 0; i < enemigosArray.length; i++) {
            var enemigo = new EnemigoPatrulla(this,
                cc.p(enemigosArray[i]["x"],enemigosArray[i]["y"]));

            this.enemigos.push(enemigo);
        }
*/
        grupoEnemigos = this.mapa.getObjectGroup("disparadores");
        enemigosArray = grupoEnemigos.getObjects();
        for (var i = 0; i < enemigosArray.length; i++) {
            var enemigo = new EnemigoTirador(this,
                cc.p(enemigosArray[i]["x"],enemigosArray[i]["y"]));

            this.tiradores.push(enemigo);
        }
/*
        grupoEnemigos = this.mapa.getObjectGroup("perseguidores");
        enemigosArray = grupoEnemigos.getObjects();
        for (var i = 0; i < enemigosArray.length; i++) {
            var enemigo = new EnemigoPerseguidor(this,
                cc.p(enemigosArray[i]["x"],enemigosArray[i]["y"]));

            this.enemigos.push(enemigo);
        }
*/

    },collisionEnemigoConJugador: function (arbiter, space) {
        //a rellenar
    },
    finCollisionEnemigoConJugador:function (arbiter, space) {
        //a rellenar
    },
    collisionDisparoConJugador: function (arbiter, space) {
        var shapes = arbiter.getShapes();
        this.formasEliminar.push(shapes[1]);
        this.jugador.impactado();
    },
    collisionDisparoConEnemigo:function (arbiter, space) {
        var shapes = arbiter.getShapes();
        this.formasEliminar.push(shapes[0]);
        this.formasEliminar.push(shapes[1]);
    },
    collisionDisparoConSuelos:function (arbiter, space) {
        var shapes = arbiter.getShapes();
        this.formasEliminar.push(shapes[0]);
        this.formasEliminar.push(shapes[1]);
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

    },jugadorSalto:function(arbiter,space){
        console.log("hey, play the game");
        var shapes = arbiter.getShapes();
        this.formasEliminar.push(shapes[1]);
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
