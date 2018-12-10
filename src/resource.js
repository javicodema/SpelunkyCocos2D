var res = {
    menu_sprite:"res/menu_sprite.png",
    boton_jugar_png : "res/boton_jugar.png",
    jugador_caminar_png : "res/jugador/jugador_caminar.png",
    jugador_caminar_plist : "res/jugador/jugador_caminar.plist",


    //De aquí abajo son de prueba
    tiles32_png: "res/mapas/tiles32.png",
    mapa_prueba_tmx: "res/mapas/mapa1.tmx",
};

var g_resources = [];
for (var i in res) {
    g_resources.push(res[i]);
}