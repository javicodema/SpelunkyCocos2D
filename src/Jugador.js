var estadoCaminando = 1;
var estadoSaltando = 2;
var estadoImpactado = 3;
var estadoMontado = 4;
var estadoIdle = 5;
var estadoAgachado = 6;
var estadoTrepando = 7;
var estadoMontadoCaminando = 8;
var estadoMontadoSaltando = 9;

var Jugador = cc.Class.extend({
    estado: estadoCaminando,
    shapeAbajo:null,
    animacion:null,
    aSaltarBajando:null,
    aSaltarSubiendo:null,
    aCaminar:null,
    aIdle: null,
    aMontado:null,
    aMontadoCam:null,
    aMontadoSal:null,
    aAgachado: null,
    aMovEscalera: null,
    gameLayer:null,
    sprite:null,
    shape:null,
    body:null,
    vidas:5,
    llavesRecogidas:0,
    puntuacion:0,
    bombas:0,
    llaves:0,
    arma:null,
    spriteSaltoBajando: null,
    spriteSaltoSubiendo: null,
    bonificadorSalto:1,
    bonificadorVelocidad:200,
    velocidad: 300,
    velocidadTrepando:500,
    potenciaSalto:1000,
    maxSaltos: 2,
    saltosAcutales: 0,
    retardoSalto: 300,
    ultimoSalto: 0,
    penaliacionRalentizado: 200,
    ralentizado: false,
    montura:null,
    ctor:function (gameLayer, posicion) {
        this.gameLayer = gameLayer;

        // Crear Sprite - Cuerpo y forma
        this.sprite = new cc.PhysicsSprite("#jugador_caminar1.png");
        // Cuerpo dinámico, SI le afectan las fuerzas
        this.body = new cp.Body(5, cp.momentForBox(1,
            this.sprite.getContentSize().width,
            this.sprite.getContentSize().height));
        this.body.setPos(posicion);
        //body.w_limit = 0.02;
        this.body.setAngle(0);
        this.body.mass = 1;
        this.sprite.setBody(this.body);

        // Se añade el cuerpo al espacio
        gameLayer.space.addBody(this.body);

        this.body.userData = this;

        // forma 16px más pequeña que la imagen original
        this.shape = new cp.BoxShape(this.body,
            this.sprite.getContentSize().width,
            this.sprite.getContentSize().height);
        this.shape.setCollisionType(tipoJugador);
        // forma dinamica1
        gameLayer.space.addShape(this.shape);
        // añadir sprite a la capa
        gameLayer.addChild(this.sprite,99);


        // Crear animación
        var framesAnimacion = [];
        for (var i = 1; i <= 5; i++) {
            var str = "jugador_caminar" + i + ".png";
            var frame = cc.spriteFrameCache.getSpriteFrame(str);
            framesAnimacion.push(frame);
        }
        var animacion = new cc.Animation(framesAnimacion, 0.1);
        var actionAnimacionBucle =
            new cc.RepeatForever(new cc.Animate(animacion));

        this.aCaminar = actionAnimacionBucle;
        this.aCaminar.retain();

        var framesAnimacionSaltarBajando = [];
        framesAnimacionSaltarBajando.push(cc.spriteFrameCache.getSpriteFrame("jugador_salto_bajando.png"));
        var animacionSaltarBajando = new cc.Animation(framesAnimacionSaltarBajando, 0.2);
        this.aSaltarBajando = new cc.RepeatForever(new cc.Animate(animacionSaltarBajando));
        this.aSaltarBajando.retain();

        var framesAnimacionSaltarSubiendo = [];
        framesAnimacionSaltarSubiendo.push(cc.spriteFrameCache.getSpriteFrame("jugador_salto_subiendo.png"));
        var animacionSaltarSubiendo = new cc.Animation(framesAnimacionSaltarSubiendo, 0.2);
        this.aSaltarSubiendo  = new cc.RepeatForever(new cc.Animate(animacionSaltarSubiendo));
        this.aSaltarSubiendo.retain();

        var framesAnimacionMontarCaminando = [];
        for (var i =1; i <= 6; i++) {
            if(i!=2){
                var str = "horse" + i + ".png";
                var frame = cc.spriteFrameCache.getSpriteFrame(str);
                framesAnimacionMontarCaminando.push(frame);
            }
        }
        var animacion = new cc.Animation(framesAnimacionMontarCaminando, 0.1);
        var actionAnimacionBucle =
            new cc.RepeatForever(new cc.Animate(animacion));

        this.aMontadoCam = actionAnimacionBucle;
        this.aMontadoCam.retain();

        var framesAnimacionMontarS= [];
        for (var i =2; i <= 2; i++) {
            var str = "horse" + i + ".png";
            var frame = cc.spriteFrameCache.getSpriteFrame(str);
            framesAnimacionMontarS.push(frame);
        }
        var animacionMontS= new cc.Animation(framesAnimacionMontarS, 0.2);
        this.aMontadoSal  =
            new cc.RepeatForever(new cc.Animate(animacionMontS));

        this.aMontadoSal.retain();

        var framesAnimacionMontar= [];
        for (var i =1; i <= 1; i++) {
                var str = "horse" + i + ".png";
                var frame = cc.spriteFrameCache.getSpriteFrame(str);
                framesAnimacionMontar.push(frame);
        }
        var animacionMont= new cc.Animation(framesAnimacionMontar, 0.2);
        this.aMontado  =
            new cc.RepeatForever(new cc.Animate(animacionMont));

        this.aMontado.retain();

        var framesAnimacionAgachado = [];
        for (var i = 1; i <= 2; i++) {
            var str = "jugador_agachado" + i + ".png";
            var frame = cc.spriteFrameCache.getSpriteFrame(str);
            framesAnimacionAgachado.push(frame);
        }
        var animacionAgachado = new cc.Animation(framesAnimacionAgachado, 0.2);
        this.aAgachado  =
            new cc.RepeatForever(new cc.Animate(animacionAgachado));
        this.aAgachado.retain();

        var framesAnimacionMovEscalera = [];
        for (var i = 1; i <= 2; i++) {
            var str = "jugador_mov_escalera" + i + ".png";
            var frame = cc.spriteFrameCache.getSpriteFrame(str);
            framesAnimacionMovEscalera.push(frame);
        }
        var animacionMovEscalera = new cc.Animation(framesAnimacionMovEscalera, 0.2);
        this.aMovEscalera  =
            new cc.RepeatForever(new cc.Animate(animacionMovEscalera));
        this.aMovEscalera.retain();

        var framesAnimacionImpactado = [];
        for (var i = 1; i <= 2; i++) {
            var str = "jugador_impactado" + i + ".png";
            var frame = cc.spriteFrameCache.getSpriteFrame(str);
            framesAnimacionImpactado.push(frame);
        }
        var animacionImpactado = new cc.Animation(framesAnimacionImpactado, 0.5);
        this.aImpactado =
            new cc.Repeat( new cc.Animate(animacionImpactado) , 2  );
        this.aImpactado.retain();

        var framesAnimacionImpactado = [];
        for (var i = 1; i <= 2; i++) {
            var str = "jugador_impactado" + i + ".png";
            var frame = cc.spriteFrameCache.getSpriteFrame(str);
            framesAnimacionImpactado.push(frame);
        }
        var animacionImpactado = new cc.Animation(framesAnimacionImpactado, 0.5);
        this.aImpactado =
            new cc.Repeat( new cc.Animate(animacionImpactado) , 2  );
        this.aImpactado.retain();


        var framesAnimacionIdle= [];
        for (var i = 1; i <= 2; i++) {
            var str = "jugador_idle" + i + ".png";
            var frame = cc.spriteFrameCache.getSpriteFrame(str);
            framesAnimacionIdle.push(frame);
        }
        var animacionIdle = new cc.Animation(framesAnimacionIdle, 0.2);
        this.aIdle  =
            new cc.RepeatForever(new cc.Animate(animacionIdle));
        this.aIdle.retain();
        var mitadAncho = this.sprite.getContentSize().width/2;
        var mitadAlto = this.sprite.getContentSize().height/2;

        this.shapeAbajo = new cp.PolyShape(this.body,
            [ -mitadAncho, -mitadAlto, mitadAncho, -mitadAlto+20] ,
            cp.v(0,0) );

       // this.shapeAbajo.setSensor(true);
        this.shapeAbajo.setCollisionType(tipoJugAbajo);
        gameLayer.space.addShape(this.shapeAbajo);


        // ejecutar la animación
        this.sprite.runAction(actionAnimacionBucle);
    },
    saltar: function(){
        // solo salta si está caminando o idle
        if( Date.now() - this.ultimoSalto > this.retardoSalto && this.saltosAcutales++ < this.maxSaltos){
            this.ultimoSalto = Date.now();
            if(this.montura==null) this.estado = estadoSaltando;
            else this.estado = estadoMontadoSaltando;
            this.body.vy = 0;
            this.body.applyImpulse(cp.v(0, this.potenciaSalto), cp.v(0, 0));
        }
    }
    ,actualizar: function (){
        //Cambiar la orientación del PJ
        if( this.body.vx > 0 ) {
            this.sprite.scaleX = 1;
        }
        else if ( this.body.vx < 0 ){
            this.sprite.scaleX = -1
        }

        switch ( this.estado ){
            case estadoImpactado:
                if (this.animacion != this.aImpactado){
                    this.animacion = this.aImpactado;
                    this.sprite.stopAllActions();
                    this.sprite.runAction(
                        cc.sequence(
                            this.animacion,
                            cc.callFunc(this.finAnimacionImpactado(), this) )
                    );
                }
                break;
            case estadoSaltando:
                if( this.body.vy > 0 ){
                    if (this.animacion != this.aSaltarSubiendo){
                        this.animacion = this.aSaltarSubiendo
                        this.sprite.stopAllActions();
                        this.sprite.runAction(this.animacion);
                    }
                }
                if( this.body.vy < 0 ){
                    if (this.animacion != this.aSaltarBajando){
                        this.animacion = this.aSaltarBajando
                        this.sprite.stopAllActions();
                        this.sprite.runAction(this.animacion);
                    }
                }
                break;
            case estadoCaminando:
                if (this.animacion != this.aCaminar){
                    this.animacion = this.aCaminar
                    this.sprite.stopAllActions();
                    this.sprite.runAction(this.animacion);
                }
                break;
            case estadoAgachado:
                if (this.animacion != this.aAgachado){
                    this.animacion = this.aAgachado
                    this.sprite.stopAllActions();
                    this.sprite.runAction(this.animacion);
                }
                break;
            case estadoTrepando:
                if (this.animacion != this.aMovEscalera){
                    this.animacion = this.aMovEscalera
                    this.sprite.stopAllActions();
                }

                if( Math.abs(this.body.vy) > 1 && this.aniacionTreparActiva != false) {
                    //Esta parado
                    this.sprite.runAction(this.animacion);
                    this.animacionTreparActiva = true;

                }else {
                    //bajando o subiendo
                    this.sprite.stopAllActions();
                    this.animacionTreparActiva = false;
                }
                break;
            case estadoIdle:
                if (this.animacion != this.aIdle){
                    this.animacion = this.aIdle
                    this.sprite.stopAllActions();
                    this.sprite.runAction(this.animacion);
                }
                break;
            case estadoMontado:
                if (this.animacion != this.aMontado){
                    this.animacion = this.aMontado;
                    this.sprite.stopAllActions();
                    this.sprite.runAction(this.animacion);
                }
                break;
            case estadoMontadoCaminando:
                if (this.animacion != this.aMontadoCam){
                    this.animacion = this.aMontadoCam;
                    this.sprite.stopAllActions();
                    this.sprite.runAction(this.animacion);
                }
                break;
            case estadoMontadoSaltando:
                if (this.animacion != this.aMontadoSal){
                    this.animacion = this.aMontadoSal;
                    this.sprite.stopAllActions();
                    this.sprite.runAction(this.animacion);
                }
                break;
        }
    },
    tocaSuelo: function() {
        this.saltosAcutales=0
        if (this.estado != estadoCaminando || this.estado != estadoIdle) {
            if( this.body.vx > -1 && this.body.vx < 1){
                if(this.montura==null) this.estado = estadoIdle;
                else this.estado=estadoMontado;
            }
            else{
                if(this.montura==null) this.estado = estadoCaminando;
                else this.estado=estadoMontadoCaminando;
            }
        }
    },
    trepar: function() {
        if(this.estado != estadoTrepando){
            this.estado = estadoTrepando;
        }
    }
    ,
    finTrepar: function() {
        if(this.estado == estadoTrepando){
            if(this.montura==null)this.estado = estadoCaminando;
            else this.estado=estadoMontadoCaminando;
        }
    },
    impactado: function(){
        if(this.montura!=null){
           this.desmontar();
        }
        if(this.estado != estadoImpactado){
            this.estado = estadoImpactado;
        }
        this.vidas--;
        /*if(this.vidas<=0){
            cc.director.runScene(new MenuScene());
        }*/
    },
    agachado: function(){
        if(this.estado != estadoAgachado){
            this.estado = estadoAgachado;
        }
    },
    moverIzquierda: function(){
        if( this.estado==estadoAgachado && Math.abs(this.body.vx) < this.velocidad + this.bonificadorVelocidad ){
            //Bonus de velocidad agachado
            this.body.applyImpulse(cp.v( -( this.velocidad+this.bonificadorVelocidad - this.body.vx ) , 0), cp.v(0, 0));
        }

        else if(Math.abs(this.body.vx) < this.velocidad ){
            this.body.applyImpulse(cp.v( -( this.velocidad - this.body.vx)  , 0), cp.v(0, 0));
        }
    },
    moverDerecha: function(){
        if( this.estado==estadoAgachado && Math.abs(this.body.vx) > this.velocidad + this.bonificadorVelocidad ){
            //Bonus de velocidad agachado
            this.body.applyImpulse(cp.v(  this.velocidad+this.bonificadorVelocidad - this.body.vx  , 0), cp.v(0, 0));
        }

        else if(Math.abs(this.body.vx) < this.velocidad ){
            this.body.applyImpulse(cp.v(  this.velocidad - this.body.vx  , 0), cp.v(0, 0));
        }
    },
    treparArriba: function(){
        this.body.vy = 0;
        if( Math.abs(this.body.vy) < this.velocidadTrepando){
            //Bonus de velocidad agachado
            this.body.applyImpulse(cp.v(0, this.velocidadTrepando - this.body.vy  ), cp.v(0, 0));
        }
    },
    treparAbajo: function(){
        this.body.vy = 0;
        if( Math.abs(this.body.vy) < this.velocidadTrepando){
            //Bonus de velocidad agachado
            this.body.applyImpulse(cp.v(0, -this.velocidadTrepando - this.body.vy  ), cp.v(0, 0));
        }
    },
    finAnimacionImpactado: function() {
        if (this.estado == estadoImpactado) {
            if(this.montura==null) this.estado = estadoCaminando;
            else this.estado = estadoMontadoCaminando;
        }
    }, montar: function(montura){
            this.estado = estadoMontado;
            this.montura=montura;
            this.potenciaSalto+=800;
            this.bonificadorVelocidad+=300;
    }, desmontar: function(){
        this.montura=null;
        this.potenciaSalto-=800;
        this.bonificadorVelocidad-=300;
    },
    ralentizar: function(ralentizar){
        if( !this.ralentizado && ralentizar){
            this.ralentizado = true;
            this.velocidad -= this.penaliacionRalentizado;
        }
        else if( this.ralentizado && !ralentizar ){
            this.ralentizado = false;
            this.velocidad += this.penaliacionRalentizado;
        }
    }
    });
