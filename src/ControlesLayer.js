var ControlesLayer = cc.Layer.extend({
    ctor:function () {
        this._super();
        var size = cc.winSize;

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

    }

});
