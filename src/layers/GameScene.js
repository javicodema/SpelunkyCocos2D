var tipoSuelo = 1;
var tipoJugador = 2;
var tipoEnemigo = 3;
var tipoEnemigoDerecha = 4;
var tipoEnemigoIzquierda = 5;
var tipoDisparo = 6;
var tipoJugAbajo = 7;
var tipoEnemigoArriba = 8;
var tipoTrampaTirarEncima = 9;
var tipoTriggerTirarEncima = 10;
var tipoTrampaDisparo = 11;
var tipoTriggerDisparo = 12;
var tipoEscalera = 13;
var tipoTrampaCaer = 14;
var tipoLlave = 15;
var tipoPuerta = 16;
var tipoTrampaRalentizar = 17;
var tipoOpcional = 21;
var tipoMontura = 19;
var tipoArma = 20;
var tipoBomba = 18;
var tipoCuerda = 22;
var tipoBombaJugador = 40;

var nivelActual = 1;
var nivelMaximo = 3;

var GameLayer = cc.Layer.extend({
    space:null,
    puerta:null,
    mapa: null,
    mapaAncho: null,
    enemigos:[],
    tiradores:[],
    disparos:[],
    armas:[],
    bombas:[],
    formasEliminar:[],
    llaves:[],
    cuerdas:[],
    opcionales:[],
    monturas:[],
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
        cc.spriteFrameCache.addSpriteFrames(res.puerta_plist);
        cc.spriteFrameCache.addSpriteFrames(res.animacion_rana_plist);
        cc.spriteFrameCache.addSpriteFrames(res.animacion_aguila_plist);
        cc.spriteFrameCache.addSpriteFrames(res.horse_ani_plist);

        // Inicializar Space
        this.space = new cp.Space();
        this.space.gravity = cp.v(0, -500);
        // Depuración
        this.depuracion = new cc.PhysicsDebugNode(this.space);
        this.addChild(this.depuracion, 10);

        this.cargarMapa("res/mapas/nivel"+nivelActual+".tmx"); //habria que meter el mapa como parametro
        if(jugadorAntiguo!=null)
            this.jugador.actualizarStats(jugadorAntiguo);
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
        this.space.addCollisionHandler(tipoJugAbajo, tipoEnemigoArriba,
            null, null, this.jugadorSalto.bind(this), null);
        this.space.addCollisionHandler(tipoSuelo, tipoEnemigoIzquierda,
            null, null, null, this.noSueloIzquierda.bind(this));
        this.space.addCollisionHandler(tipoSuelo, tipoEnemigoDerecha,
            null, null, null, this.noSueloDerecha.bind(this));
        this.space.addCollisionHandler(tipoEscalera, tipoEnemigoIzquierda,
            null, null, null, this.escaleraIzquierda.bind(this));
        this.space.addCollisionHandler(tipoEscalera, tipoEnemigoDerecha,
            null, null, null, this.escaleraDerecha.bind(this));
        this.space.addCollisionHandler(tipoJugador, tipoMontura,
            null, null, this.collisionMonturaConJugador.bind(this), null);

        //Colisiones de la trampa de tirar encima
        this.space.addCollisionHandler(tipoJugador, tipoTriggerTirarEncima,
            this.collisionTriggerTirarEncima.bind(this), null, null, null);
        this.space.addCollisionHandler(tipoSuelo, tipoTrampaTirarEncima,
            this.collisionTrampaTirarEncimaSuelo.bind(this), null, null, null);
        this.space.addCollisionHandler(tipoJugador, tipoTrampaTirarEncima,
            null, null, this.collisionTrampaTirarEncimaJugador.bind(this), null);

        //Colisiones trampa ralentizar
        this.space.addCollisionHandler(tipoJugador, tipoTrampaRalentizar,
            this.colisionTrampaRalentizar.bind(this), null, null, this.finColisionTrampaRalentizar.bind(this));


        this.space.addCollisionHandler(tipoJugador, tipoEscalera,
            null, null, this.collisionEscaleraJugador.bind(this), this.finCollisionEscaleraJugador.bind(this));

        //Colisiones de la trampa de caida
        this.space.addCollisionHandler(tipoJugador, tipoTrampaCaer,
            this.collisionTrampaCaerJugador.bind(this), null, null, this.finCollisionSueloConJugador.bind(this));

        //Colisiones de la trampa de disparo
        this.space.addCollisionHandler(tipoJugador, tipoTriggerDisparo,
            this.collisionTrampaDisparoJugador.bind(this), null, null, null);

        // Jugador y llave
        this.space.addCollisionHandler(tipoJugador, tipoLlave,
                null, this.collisionJugadorConLlave.bind(this), null, null);

        // Jugador y puerta)
        this.space.addCollisionHandler(tipoJugador, tipoPuerta,
                null, this.collisionJugadorPuerta.bind(this), null, null);

        this.space.addCollisionHandler(tipoJugador, tipoOpcional,
            null, this.collisionJugadorConOpcional.bind(this), null, null);
        this.space.addCollisionHandler(tipoJugador, tipoBomba,
                    null, this.collisionBombaConJugador.bind(this), null, null);
        this.space.addCollisionHandler(tipoJugador, tipoArma,
            this.collisionArmaConJugador.bind(this), null, null, null);


        //Colision con cuerdas
        this.space.addCollisionHandler(tipoJugador, tipoCuerda,
            null, this.collisionCuerdaJugador.bind(this), null, this.finCollisionCuerdaJugador.bind(this));

        return true;
    },
    update:function (dt) {
        var capaControles =
            this.getParent().getChildByTag(idCapaControles);
        capaControles.actualizarVida(this.jugador.vidas);


        this.space.step(dt);
        this.jugador.actualizar();

        for (var j = 0; j < this.disparos.length; j++) {
            var disparo = this.disparos[j];
            disparo.body.vy = 0;
            if( this.disparos[j].rango != undefined ){
                if( Math.abs(disparo.origen.x - disparo.body.p.x) > disparo.rango ){
                    this.formasEliminar.push(disparo.shape);
                }
            }
        }

        for (var j = 0; j < this.cuerdas.length; j++) {
            this.cuerdas[j].update();
        }


        for(var i = 0; i < this.formasEliminar.length; i++) {
            var shape = this.formasEliminar[i];

            for (var j = 0; j < this.llaves.length; j++) {
               if (this.llaves[j].shape == shape) {
                   this.llaves[j].eliminar();
                   this.llaves.splice(j, 1);
               }
            }

            for (var j = 0; j < this.armas.length; j++) {
               if (this.armas[j].shape == shape) {
                   this.armas[j].eliminar();
                   this.armas.splice(j, 1);
               }
            }

            for (var j = 0; j < this.bombas.length; j++) {
               if (this.bombas[j].shape == shape) {
                   this.bombas[j].eliminar();
                   this.bombas.splice(j, 1);
               }
            }

            for (var j = 0; j < this.monturas.length; j++) {
                if (this.monturas[j].shape == shape) {
                    this.monturas[j].eliminar();
                    this.monturas.splice(j, 1);
                }
            }

            for (var j = 0; j < this.opcionales.length; j++) {
                if (this.opcionales[j].shape == shape) {
                    this.opcionales[j].eliminar();
                    this.opcionales.splice(j, 1);
                }
            }

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
                    (this.enemigos[j].body.shapeList[0] == shape ||
                        this.enemigos[j].body.shapeList[1] == shape)){
                    this.space.removeShape(this.enemigos[j].body.shapeList[0]);
                    this.space.removeShape(this.enemigos[j].body.shapeList[1]);
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
        this.jugador.body.a = 0;


        //Leer controles jugador
        controles = capaControles.teclas_pulsadas;

        //Control de salto
        if( controles.saltar ){
            if( this.jugador.estado != this.jugador.estadoTrepando && this.jugador.puntoAnclaje!= null ){
                this.space.addPostStepCallback( () => {
                    this.space.removeConstraint(this.jugador.puntoAnclaje)
                    this.space.removeConstraint(this.jugador.puntoAnclaje2)
                    this.jugador.puntoAnclaje = null;
                    this.jugador.puntoAnclaje2 = null;
                } );
            }
            this.jugador.saltar();
        }

        if(controles.ataque){
            if(this.jugador.arma!=null && this.jugador.delayDisparo<=0){
                if(this.jugador.orientacion==1){
                    var disparo =  new Disparo(this,
                        cc.p(this.jugador.body.p.x+30,this.jugador.body.p.y+10),-this.jugador.orientacion);
                    this.jugador.disparar();
                } else{
                    var disparo =  new Disparo(this,
                        cc.p(this.jugador.body.p.x-30,this.jugador.body.p.y+10),-this.jugador.orientacion);
                    this.jugador.disparar();
                }
                this.disparos.push(disparo);
            }
        }

        if( controles.lanzar_objeto ){
            this.jugador.soltarBomba();
            capaControles.actualizarBombas( this.jugador.nBombas );
        }

        //Controles de movimiento
        if( controles.abajo ){
            if( this.jugador.estado == estadoTrepando ){
                this.jugador.treparAbajo();
            }
            else {
                this.jugador.agachado();
            }
        }
        else{
            if(this.jugador.estado==estadoAgachado) this.jugador.notAgachado();
        }

        if( controles.arriba ){
            if( this.jugador.estado == estadoTrepando ){
                this.jugador.treparArriba();
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
        this.jugador = new Jugador(this, cc.p(jugadorArray[0]["x"],jugadorArray[0]["y"]));

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
                    3);
                shapeSuelo.setElasticity(0.5);
                shapeSuelo.setFriction(1);
                shapeSuelo.setCollisionType(tipoSuelo);
                this.space.addStaticShape(shapeSuelo);

            }
        }


        // Solicitar los objeto dentro de la capa escaleras
        var grupoEscaleras = this.mapa.getObjectGroup("escaleras");
        if(grupoEscaleras!=null){
            var escalerasArray = grupoEscaleras.getObjects();
            // Los objetos de la capa suelos se transforman a
            // formas estáticas de Chipmunk ( SegmentShape ).
            for (var i = 0; i < escalerasArray.length; i++) {
                var escalera = escalerasArray[i];
                var bodyEscalera = new cp.Body(1000,1);
                bodyEscalera.setPos( cc.p(escalera['x']+escalera['width']/2, escalera['y']+escalera['height']/2) )
                var escaleraShape = new cp.BoxShape(bodyEscalera,escalera['width'], escalera['height']);
                escaleraShape.setCollisionType( tipoEscalera );
                escaleraShape.setElasticity(0.5);
                escaleraShape.setFriction(1);
                this.space.addShape( escaleraShape );
            }
        }

        //Cuerdas
        var grupoCuerdas = this.mapa.getObjectGroup("cuerdas");
        if(grupoCuerdas!=null){
            var cuerdasArray = grupoCuerdas.getObjects();
            // Los objetos de la capa suelos se transforman a
            // formas estáticas de Chipmunk ( SegmentShape ).
            for (var i = 0; i < cuerdasArray.length; i++) {
                var cuerda = cuerdasArray[i];
                var nuevaCuerda = new Cuerda(this, cc.p(cuerda['x'], cuerda['y']), 1)
                this.cuerdas.push( nuevaCuerda );
            }
        }

        // Enemigos

        var grupoEnemigos = this.mapa.getObjectGroup("patrullas");
        if(grupoEnemigos!=null){
            var enemigosArray = grupoEnemigos.getObjects();
            for (var i = 0; i < enemigosArray.length; i++) {
                var enemigo = new EnemigoPatrulla(this,
                    cc.p(enemigosArray[i]["x"],enemigosArray[i]["y"]));

                this.enemigos.push(enemigo);
            }
        }

        grupoEnemigos = this.mapa.getObjectGroup("disparadores");
        if(grupoEnemigos!=null){
            enemigosArray = grupoEnemigos.getObjects();
            for (var i = 0; i < enemigosArray.length; i++) {
                var enemigo = new EnemigoTirador(this,
                    cc.p(enemigosArray[i]["x"],enemigosArray[i]["y"]));

                this.tiradores.push(enemigo);
            }
        }

        grupoEnemigos = this.mapa.getObjectGroup("perseguidores");
        if(grupoEnemigos!=null){
            enemigosArray = grupoEnemigos.getObjects();
            for (var i = 0; i < enemigosArray.length; i++) {
                var enemigo = new EnemigoPerseguidor(this,
                    cc.p(enemigosArray[i]["x"],enemigosArray[i]["y"]));

                this.enemigos.push(enemigo);
            }
        }

        //Armas
        grupoArmas = this.mapa.getObjectGroup("armas");
        if(grupoArmas!=null){
            armasArray = grupoArmas.getObjects();
            for (var i = 0; i < armasArray.length; i++) {
                var arma = new Arma(this,
                    cc.p(armasArray[i]["x"],armasArray[i]["y"]));

                this.armas.push(arma);
            }
        }

        //bombas
        grupoBombas = this.mapa.getObjectGroup("bombas");
        if(grupoBombas!=null){
            bombasArray = grupoBombas.getObjects();
            for (var i = 0; i < bombasArray.length; i++) {
                var bomba = new Bomba(this,
                    cc.p(bombasArray[i]["x"],bombasArray[i]["y"]));

                this.bombas.push(bomba);
            }
        }

        //Trampas tirar encima
        var grupoTrampasTirar = this.mapa.getObjectGroup("trampasTirarEncima");
        var grupoTriggersTirar = this.mapa.getObjectGroup("triggersTirarEncima");
        if(grupoTrampasTirar!=null && grupoTriggersTirar!=null){
            var trampasArray = grupoTrampasTirar.getObjects();
            var triggersArray = grupoTriggersTirar.getObjects();
            for (var i = 0; i < trampasArray.length; i++) {
                var numero = trampasArray[i].name.substring(2);
                var trigger = triggersArray.find( tr => tr.name == 'ttg'+ numero)
                var trampaTirarEncima = new TrampaTirarEncima( this,  cc.p(trampasArray[i]["x"],trampasArray[i]["y"]), trigger );
            }
        }

        //Trampas disparo
        var grupoTrampasDisparo = this.mapa.getObjectGroup("trampasDisparo");
        var grupoTriggersDisparo = this.mapa.getObjectGroup("triggersDisparo");
        if(grupoTrampasDisparo!=null && grupoTriggersDisparo!=null){
            var trampasArray = grupoTrampasDisparo.getObjects();
            var triggersArray = grupoTriggersDisparo.getObjects();
            for (var i = 0; i < trampasArray.length; i++) {
                var numero = trampasArray[i].name.substring(2);
                var trigger = triggersArray.find( tr => tr.name == 'tgd'+ numero)
                var trampaDisparo= new TrampaDisparo( this,  cc.p(trampasArray[i]["x"],trampasArray[i]["y"]), trigger );
            }
        }

        //Trampas caer
        var grupoTrampasCaer = this.mapa.getObjectGroup("trampasCaer");
        if(grupoTrampasCaer!=null){
            var trampasArray = grupoTrampasCaer.getObjects();
            for (var i = 0; i < trampasArray.length; i++) {
                var trampaCaer= new TrampaCaer( this,  cc.p(trampasArray[i]["x"],trampasArray[i]["y"]));
            }
        }

        //Trampas ralentizar
        var grupoTrampasRalentizar = this.mapa.getObjectGroup("trampasRalentizar");
            if(grupoTrampasRalentizar!=null){
            var trampasArray = grupoTrampasRalentizar.getObjects();
            for (var i = 0; i < trampasArray.length; i++) {
                var trampaRalentizar= new TrampaRalentizar( this,  cc.p(trampasArray[i]["x"],trampasArray[i]["y"]), trampasArray[i].width, trampasArray[i].height);
            }
        }

		// Llaves
        var llaves = this.mapa.getObjectGroup("llaves");
        if(llaves!=null){
            var llavesArray = llaves.getObjects();
            for (var i = 0; i < llavesArray.length; i++) {
                var llave= new Llave( this,  cc.p(llavesArray[i]["x"],llavesArray[i]["y"]));
                this.llaves.push(llave);
            }
		}

        // Opcionales
        var opcionales = this.mapa.getObjectGroup("opcionales");
        if(opcionales!=null){
            var opcionalesArray = opcionales.getObjects();
            for (var i = 0; i < opcionalesArray.length; i++) {
                var opc= new Opcional( this,  cc.p(opcionalesArray[i]["x"],opcionalesArray[i]["y"]));
                this.opcionales.push(opc);
            }
        }

        var monturas = this.mapa.getObjectGroup("monturas");
        if(monturas!=null){
            var monturasArray = monturas.getObjects();
            for (var i = 0; i < monturasArray.length; i++) {
                var montura= new Montura( this,  cc.p(monturasArray[i]["x"],monturasArray[i]["y"]));
                this.monturas.push(montura);
            }
        }

		// Puerta
        var puerta = this.mapa.getObjectGroup("puerta").getObjects()[0];
        if(puerta!=null)
            this.puerta = new Puerta(this, cc.p(puerta["x"],puerta["y"]))
    },collisionEnemigoConJugador: function (arbiter, space) {
        var shapes = arbiter.getShapes();
        for (var j = 0; j < this.enemigos.length; j++) {
            if(this.enemigos[j].body.shapeList[3]==shapes[1]){
                this.enemigos[j].vx=0;
            }
        }
        for (var j = 0; j < this.tiradores.length; j++) {
            if(this.tiradores[j].body.shapeList[3]==shapes[1]){
                this.tiradores[j].vx=0;
            }
        }
    },
    finCollisionEnemigoConJugador:function (arbiter, space) {
        this.jugador.impactado();
    },collisionBombaConJugador:function (arbiter,space){
        // Marcar la bomba para eliminarla
            var shapes = arbiter.getShapes();
            // shapes[0] es el jugador
            this.formasEliminar.push(shapes[1]);

            this.jugador.nBombas++;

            var capaControles = this.getParent().getChildByTag(idCapaControles);
            capaControles.actualizarBombas( this.jugador.nBombas );

    },
    collisionJugadorConLlave:function (arbiter, space) {
        // Marcar la llave para eliminarla
        var shapes = arbiter.getShapes();
        // shapes[0] es el jugador
        this.formasEliminar.push(shapes[1]);

        var capaControles = this.getParent().getChildByTag(idCapaControles);
        this.jugador.llavesRecogidas++;
        capaControles.actualizarLlaves(this.jugador.llavesRecogidas);
        this.jugador.puntuacion+=30;
        capaControles.actualizarPuntos(this.jugador.puntuacion);

    },
    collisionArmaConJugador:function(arbiter, space){
        // Marcar el arma para eliminarla
        var shapes = arbiter.getShapes();
        // shapes[0] es el jugador
        this.formasEliminar.push(shapes[1]);
        this.jugador.armar();

    },collisionJugadorConOpcional:function (arbiter, space) {
        // Marcar la llave para eliminarla
        var shapes = arbiter.getShapes();
        // shapes[0] es el jugador
        this.formasEliminar.push(shapes[1]);

        var capaControles = this.getParent().getChildByTag(idCapaControles);
        this.jugador.puntuacion+=50;
        capaControles.actualizarPuntos(this.jugador.puntuacion);

    },collisionMonturaConJugador:function (arbiter, space) {
        // Marcar la llave para eliminarla
        var shapes = arbiter.getShapes();
        // shapes[0] es el jugador
        for (var j = 0; j < this.monturas.length; j++) {
            if (this.monturas[j].shape == shapes[1]) {
                this.jugador.montar(this.monturas[j])
            }
        }
        this.formasEliminar.push(shapes[1]);
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


        this.jugador.puntuacion+=10;
        var capaControles = this.getParent().getChildByTag(idCapaControles);
        capaControles.actualizarPuntos(this.jugador.puntuacion);
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
        if( this.jugador.estado != estadoSaltando && this.jugador.estado != estadoMontadoSaltando ) {
            this.jugador.saltosAcutales++

            //Evitar efecto de tobogan al dejar el suelo.
            this.jugador.body.vx = 0;
            this.jugador.body.vy = 0;
        }
        if(this.jugador.montura==null) this.jugador.estado = estadoSaltando;
        else this.jugador.estado = estadoMontadoSaltando;

    },jugadorSalto:function(arbiter,space){
        var shapes = arbiter.getShapes();
        this.formasEliminar.push(shapes[1]);
        this.jugador.vidas++;

        this.jugador.puntuacion+=10;
        var capaControles = this.getParent().getChildByTag(idCapaControles);
        capaControles.actualizarPuntos(this.jugador.puntuacion);
    },
    noSueloDerecha : function(arbiter, space){
        var shapes = arbiter.getShapes();
        for (var j = 0; j < this.enemigos.length; j++) {
            if(this.enemigos[j].body.shapeList[3]==shapes[1]){
                this.enemigos[j].orientacion=-1;
                this.enemigos[j].animacion = this.enemigos[j].izquierda;
                this.enemigos[j].sprite.stopAllActions();
                this.enemigos[j].sprite.runAction(this.enemigos[j].animacion);
            }
        }
        for (var j = 0; j < this.tiradores.length; j++) {
            if(this.tiradores[j].body.shapeList[3]==shapes[1]){
                this.tiradores[j].orientacion=-1;
            }
        }
    },
    noSueloIzquierda: function(arbiter, space){
        var shapes = arbiter.getShapes();
        for (var j = 0; j < this.enemigos.length; j++) {
            if(this.enemigos[j].body.shapeList[2]==shapes[1]){
                this.enemigos[j].orientacion=1;
                this.enemigos[j].animacion = this.enemigos[j].derecha;
                this.enemigos[j].sprite.stopAllActions();
                this.enemigos[j].sprite.runAction(this.enemigos[j].animacion);
            }
        }
        for (var j = 0; j < this.tiradores.length; j++) {
            if(this.tiradores[j].body.shapeList[2]==shapes[1]){
                this.tiradores[j].orientacion=1;
            }
        }
    },escaleraDerecha : function(arbiter, space){
        var shapes = arbiter.getShapes();
        for (var j = 0; j < this.enemigos.length; j++) {
            if(this.enemigos[j].body.shapeList[3]==shapes[1]){
                this.enemigos[j].orientacion=-1;
            }
        }
        for (var j = 0; j < this.tiradores.length; j++) {
            if(this.tiradores[j].body.shapeList[3]==shapes[1]){
                this.tiradores[j].orientacion=-1;
            }
        }
    },
    escaleraIzquierda: function(arbiter, space){
        var shapes = arbiter.getShapes();
        for (var j = 0; j < this.enemigos.length; j++) {
            if(this.enemigos[j].body.shapeList[2]==shapes[1]){
                this.enemigos[j].orientacion=1;
            }
        }
        for (var j = 0; j < this.tiradores.length; j++) {
            if(this.tiradores[j].body.shapeList[2]==shapes[1]){
                this.tiradores[j].orientacion=1;
            }
        }
    },
    collisionTriggerTirarEncima: function(arbitrer, space){
        triggerActivado = arbitrer.body_b.userData;
        a = arbitrer.body_a.userData;
        if( triggerActivado === undefined ){
            return;
        }
        if( !triggerActivado instanceof TrampaTirarEncima){
            trampaTirarEncima = a
        }

        if( !triggerActivado.activo ) {
            space.addPostStepCallback(() => {
                triggerActivado.activar();
            })
        }
        triggerActivado.activo = true;

    },collisionTrampaTirarEncimaSuelo: function(arbitrer, space){
        trampaTirarEncima = arbitrer.body_b.userData;
        a = arbitrer.body_a.userData;
        if( !trampaTirarEncima  instanceof TrampaTirarEncima){
            trampaTirarEncima  = a
        }
        if( trampaTirarEncima .activo && !trampaTirarEncima .finAccion ) {
            space.addPostStepCallback( ()=>{
                trampaTirarEncima.desactivar();
            } )
        }
        trampaTirarEncima.finAccion = true;
    },collisionTrampaTirarEncimaJugador:function(arbitrer, space){
        trampaCaida = arbitrer.body_b.userData;
        jugador = arbitrer.body_a.userData;
        if( trampaCaida === undefined ){
            return;
        }
        if( !trampaCaida.causo_herida && !trampaCaida.finAccion && trampaCaida.activo) {
            var capaControles = this.getParent().getChildByTag(idCapaControles);
            //Mover el jugador atras para evitar problemas de atravesar suelos.
            jugador.body.p.x += jugador.sprite.scaleX>0?-20:20;

            jugador.impactado();
            capaControles.actualizarVida( this.jugador.vidas );
        }
        trampaCaida.causo_herida = true;

    },collisionEscaleraJugador: function(arbitrer, space){
        this.jugador.trepar();
    },finCollisionEscaleraJugador: function(arbitrer, space){
        this.jugador.finTrepar();
    },collisionTrampaCaerJugador: function(arbitrer, space){
        trampaCaida = arbitrer.body_b.userData;
        a = arbitrer.body_a.userData;
        if( !trampaCaida  instanceof TrampaCaer){
            trampaCaida  = a
        }
        if(!trampaCaida.activa){
            space.addPostStepCallback( () => {
                trampaCaida.activar();
             } )
        }
        trampaCaida.activa = true;
        this.collisionSueloConJugador(arbitrer, space);
    },
    collisionTrampaDisparoJugador: function(arbitrer, space){
        trampaDisparo = arbitrer.body_b.userData;
        a = arbitrer.body_a.userData;
        if( !trampaDisparo  instanceof TrampaDisparo){
            trampaDisparo  = a
        }

        if(!trampaDisparo.activa){
            space.addPostStepCallback( () => {
                trampaDisparo.activar();
            } )
        }
        trampaDisparo.activa = true;

    },
    colisionTrampaRalentizar: function(arbitrer, space){
        this.jugador.ralentizar(true);
    },
    finColisionTrampaRalentizar: function(arbitrer, space){
        this.jugador.ralentizar(false);
    },
    collisionCuerdaJugador: function(arbitrer, space){

        if(this.jugador.puntoAnclaje == null){
            this.jugador.puntoAnclaje = pinjoint;
            collision_p = arbitrer.contacts[0].p;
            var pinjoint = new cp.SlideJoint(arbitrer.body_a, arbitrer.body_b, arbitrer.body_a.p, collision_p, 0, 2);
            var pinjoint2 = new cp.PivotJoint(arbitrer.body_a, arbitrer.body_b, collision_p, collision_p);
            pinjoint.errorBias = 0.99;
            pinjoint2.errorBias = 0.99;

            space.addPostStepCallback( () => {
                space.addConstraint(pinjoint)
                space.addConstraint(pinjoint2)
            } );
            this.jugador.saltosAcutales = 0;
            this.jugador.trepar();
            this.jugador.puntoAnclaje = pinjoint;
            this.jugador.puntoAnclaje2 = pinjoint2;
        }

    },
    finCollisionCuerdaJugador: function(arbitrer, space){
        if( this.jugador.estado != this.jugador.estadoTrepando && this.jugador.puntoAnclaje!= null ){
            this.space.addPostStepCallback( () => {
                this.space.removeConstraint(this.jugador.puntoAnclaje)
                this.space.removeConstraint(this.jugador.puntoAnclaje2)
                this.jugador.puntoAnclaje = null;
                this.jugador.puntoAnclaje2 = null;

            } );
            this.jugador.estado = this.jugador.estadoSaltando
        }
    },
    collisionJugadorPuerta: function(arbitrer, space){
            if(this.jugador.llavesRecogidas>=3 && nivelActual<nivelMaximo){
                nivelActual++ // Habria que comprobar que no se supere el nivel maximo, pero en verdad como el ultimo nivel no tiene llaves pos da igual
                var puntos = this.getParent().getChildByTag(idCapaControles).etiquetaPuntos.getString();;
                jugadorAntiguo = this.jugador;
                cc.director.runScene(new NextLevelLayer(puntos));
            }
        },
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
