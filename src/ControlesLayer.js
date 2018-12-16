var ControlesLayer = cc.Layer.extend({
    etiquetaVidas:null,
    etiquetaBombas:null,
    etiquetaPuntos:null,
    etiquetaLlaves:null,
    tecladas_pulsadas: null,
    ctor:function () {
        this._super();
        var size = cc.winSize;

        this.teclas_pulsadas = []

        this.etiquetaPuntos = new cc.LabelTTF("Puntos: 0", "Helvetica", 20);
        this.etiquetaPuntos.setPosition(cc.p(size.width - 90, size.height - 20));
        this.etiquetaPuntos.fillStyle = new cc.Color(255, 255, 255, 0);
        this.addChild(this.etiquetaPuntos);

        this.etiquetaVidas = new cc.LabelTTF("Vidas: 3", "Helvetica", 20);
        this.etiquetaVidas.setPosition(cc.p(70, size.height - 20));
        this.etiquetaVidas.fillStyle = new cc.Color(255, 255, 255, 0);
        this.addChild(this.etiquetaVidas);

        this.etiquetaBombas = new cc.LabelTTF("Bombas: 0", "Helvetica", 20);
        this.etiquetaBombas.setPosition(cc.p(180, size.height - 20));
        this.etiquetaBombas.fillStyle = new cc.Color(255, 255, 255, 0);
        this.addChild(this.etiquetaBombas);

        this.etiquetaLlaves = new cc.LabelTTF("Llaves: 0", "Helvetica", 20);
        this.etiquetaLlaves.setPosition(cc.p(80, size.height - 50));
        this.etiquetaLlaves.fillStyle = new cc.Color(255, 255, 255, 0);
        this.addChild(this.etiquetaLlaves);


        // Registrar Mouse Down
        cc.eventManager.addListener({
            event: cc.EventListener.MOUSE,
            onMouseDown: this.procesarMouseDown.bind(this)
        }, this);

        cc.eventManager.addListener({
            event:cc.EventListener.KEYBOARD,
            onKeyPressed: this.procesarPulsacionesTeclado.bind(this)

        }, this)

        cc.eventManager.addListener({
            event:cc.EventListener.KEYBOARD,
            onKeyReleased: this.procesarSoltarPulsacionTeclado.bind(this)
        }, this)

        this.scheduleUpdate();
        return true;
    },
    update:function (dt) {

    },
    procesarPulsacionesTeclado:function(key, event){
        switch(key){
            case(37):
                //Flecha Izquierda
                this.teclas_pulsadas.mov_izquierdo = true;
                break;
            case(38):
                //Flecha Arriba
                this.teclas_pulsadas.arriba = true;
                break;
            case(39):
                //Flecha Derecha
                this.teclas_pulsadas.mov_derecho = true;
                break;
            case(40):
                //Flecha abajo
                this.teclas_pulsadas.abajo = true;
                break;

            case(65):
                //A
                this.teclas_pulsadas.mirar_izquierda = true;
                break;
            case(87):
                //W
                this.teclas_pulsadas.mirar_arriba = true;
                break;
            case(68):
                //D
                this.teclas_pulsadas.mirar_derecha = true;
                break;
            case(83):
                //S
                this.teclas_pulsadas.mirar_abajo = true;
                break;

            case(32):
                //Espacio
                this.teclas_pulsadas.saltar = true;
                break;
            case(88):
                //X
                this.teclas_pulsadas.ataque = true;
                break;
            case(90):
                //Z
                this.teclas_pulsadas.lanzar_objeto = true;
                break;

            case(80):
                //P
                this.teclas_pulsadas.pausa = true;
                break;

        }
    },
    procesarSoltarPulsacionTeclado:function(key, event){
        switch(key){
            case(37):
                //Flecha Izquierda
                this.teclas_pulsadas.mov_izquierdo = false;
                break;
            case(38):
                //Flecha arriba
                this.teclas_pulsadas.arriba = false;
                break;
            case(39):
                //Flecha Derecha
                this.teclas_pulsadas.mov_derecho = false;
                break;
            case(40):
                //Flecha abajo
                this.teclas_pulsadas.abajo = false;
                break;

            case(65):
                //A
                this.teclas_pulsadas.mirar_izquierda = false;
                break;
            case(87):
                //W
                this.teclas_pulsadas.mirar_arriba = false;
                break;
            case(68):
                //D
                this.teclas_pulsadas.mirar_derecha = false;
                break;
            case(83):
                //S
                this.teclas_pulsadas.mirar_abajo = false;
                break;

            case(32):
                //Espacio
                this.teclas_pulsadas.saltar = false;
                break;
            case(88):
                //X
                this.teclas_pulsadas.ataque = false;
                break;
            case(90):
                //Z
                this.teclas_pulsadas.lanzar_objeto = false;
                break;

            case(80):
                //P
                this.teclas_pulsadas.pausa = false;
                break;
        }
    },
    procesarMouseDown:function(event) {

    }, actualizarVida:function(vidas){
        this.etiquetaVidas.setString("Vidas: "+vidas);
    }, actualizarBombas:function(bombas){
        this.etiquetaBombas.setString("Bombas: "+bombas);
    }, actualizarPuntos:function(puntos){
        this.etiquetaPuntos.setString("Puntos: "+puntos);
    }, actualizarLlaves:function(llaves){
        this.etiquetaLlaves.setString("Llaves: "+llaves);
    }

});
