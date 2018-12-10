var ControlesLayer = cc.Layer.extend({
    etiquetaVidas:null,
    etiquetaBombas:null,
    etiquetaPuntos:null,
    etiquetaLlaves:null,
    ctor:function () {
        this._super();
        var size = cc.winSize;

        this.etiquetaPuntos = new cc.LabelTTF("Puntos: 0", "Helvetica", 20);
        this.etiquetaPuntos.setPosition(cc.p(size.width - 90, size.height - 20));
        this.etiquetaPuntos.fillStyle = new cc.Color(255, 255, 255, 0);
        this.addChild(this.etiquetaPuntos);

        this.etiquetaVidas = new cc.LabelTTF("Vidas: 3", "Helvetica", 20);
        this.etiquetaVidas.setPosition(cc.p(10, size.height - 20));
        this.etiquetaVidas.fillStyle = new cc.Color(255, 255, 255, 0);
        this.addChild(this.etiquetaVidas);

        this.etiquetaBombas = new cc.LabelTTF("Bombas: 0", "Helvetica", 20);
        this.etiquetaBombas.setPosition(cc.p(90, size.height - 20));
        this.etiquetaBombas.fillStyle = new cc.Color(255, 255, 255, 0);
        this.addChild(this.etiquetaBombas);

        this.etiquetaLlaves = new cc.LabelTTF("Llaves: 0", "Helvetica", 20);
        this.etiquetaLlaves.setPosition(cc.p(10, size.height - 50));
        this.etiquetaLlaves.fillStyle = new cc.Color(255, 255, 255, 0);
        this.addChild(this.etiquetaLlaves);


        // Registrar Mouse Down
        cc.eventManager.addListener({
            event: cc.EventListener.MOUSE,
            onMouseDown: this.procesarMouseDown.bind(this)
        }, this)

        this.scheduleUpdate();
        return true;
    },
    update:function (dt) {

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
