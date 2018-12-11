var estadoCaminando = 1;
var estadoSaltando = 2;
var estadoImpactado = 3;
var estadoMontado = 4;
var estadoIdle = 5;
var estadoAgachado = 6;
var estadoTrepando = 7;

var Jugador = cc.Class.extend({
    estado: estadoCaminando,
    animacion:null,
    aSaltarBajando:null,
    aSaltarSubiendo:null,
    aCaminar:null,
    aIdle: null,
    aMontado:null,
    aAgachado: null,
    aMovEscalera: null,
    gameLayer:null,
    sprite:null,
    shape:null,
    body:null,
    vidas:3,
    bombas:0,
    llaves:0,
    arma:null,
    spriteSaltoBajando: null,
    spriteSaltoSubiendo: null,
    bonificadorSalto:1,
    bonificadorVelocidad:300,
    velocidad: 300,
    potenciaSalto:1000,
    maxSaltos: 2,
    saltosAcutales: 0,
    retardoSalto: 300,
    ultimoSalto: 0,
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
        this.sprite.setBody(this.body);

        // Se añade el cuerpo al espacio
        gameLayer.space.addBody(this.body);

        // forma 16px más pequeña que la imagen original
        this.shape = new cp.BoxShape(this.body,
            this.sprite.getContentSize().width,
            this.sprite.getContentSize().height);
        this.shape.setCollisionType(tipoJugador);
        // forma dinamica1
        gameLayer.space.addShape(this.shape);
        // añadir sprite a la capa
        gameLayer.addChild(this.sprite,10);


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

        var framesAnimacionMontar = [];
        for (var i = 1; i <= 4; i++) {
            var str = "jugador_montar" + i + ".png";
            var frame = cc.spriteFrameCache.getSpriteFrame(str);
            framesAnimacionMontar.push(frame);
        }
        var animacionMontar = new cc.Animation(framesAnimacionMontar, 0.2);
        this.aMontado  =
            new cc.RepeatForever(new cc.Animate(animacionMontar));

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


        // ejecutar la animación
        this.sprite.runAction(actionAnimacionBucle);
    },
    saltar: function(){
        // solo salta si está caminando o idle
        if( Date.now() - this.ultimoSalto > this.retardoSalto && this.saltosAcutales++ < this.maxSaltos){
            this.ultimoSalto = Date.now();
            this.estado = estadoSaltando;
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
        }
    },
    tocaSuelo: function() {
        this.saltosAcutales=0
        if (this.estado != estadoCaminando || this.estado != estadoIdle) {
            if( this.body.vx > -1 && this.body.vx < 1){
                this.estado = estadoIdle;
            }
            else{
                this.estado = estadoCaminando;
            }
        }
    },
    trepar: function() {
        if(this.estado != estadoAgachado){
            this.estado = estadoTrepando;
        }
    }
    ,
    impactado: function(){
        if(this.estado != estadoImpactado){
            this.estado = estadoImpactado;
        }
    },
    agachado: function(){
        if(this.estado != estadoAgachado){
            this.estado = estadoAgachado;
        }
    },
    moverIzquierda: function(){
        this.body.vx = -this.velocidad
        if(this.estado == estadoAgachado)
            this.body.vx -= this.bonificadorVelocidad;
    },
    moverDerecha: function(){
        this.body.vx = this.velocidad
        if(this.estado == estadoAgachado)
            this.body.vx += this.bonificadorVelocidad;
    },
    finAnimacionImpactado: function() {
        if (this.estado == estadoImpactado) {
            this.estado = estadoCaminando;
        }
    }, montar: function(){
        if(this.estado == estadoCaminando){
            this.estado = estadoMontado;
            //codigo
        }
    }, desmontar: function(){
        if(this.estado == estadoMontado){
            this.estado = estadoCaminando;
        }
    }
    });
