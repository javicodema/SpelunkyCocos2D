var res = {
    menu_sprite:"res/menu_sprite.png",
    boton_jugar_png : "res/boton_jugar.png",

    //Animaciones jugador
    jugador_caminar_png : "res/jugador/jugador_caminar.png",
    jugador_caminar_plist : "res/jugador/jugador_caminar.plist",
    jugador_agachado_png : "res/jugador/jugador_agachado.png",
    jugador_agachado_plist : "res/jugador/jugador_agachado.plist",
    jugador_salto_bajando_png : "res/jugador/jugador_salto_bajando.png",
    jugador_salto_bajando_plist : "res/jugador/jugador_salto_bajando.plist",
    jugador_salto_subiendo_png : "res/jugador/jugador_salto_subiendo.png",
    jugador_salto_subiendo_plist : "res/jugador/jugador_salto_subiendo.plist",
    jugador_mov_escalera_png : "res/jugador/jugador_mov_escalera.png",
    jugador_mov_escalera_plist : "res/jugador/jugador_mov_escalera.plist",
    jugador_idle_png : "res/jugador/jugador_idle.png",
    jugador_idle_plist : "res/jugador/jugador_idle.plist",

    //De aquí abajo son de prueba
    tiles32_png: "res/mapas/tiles32.png",
    mapa_prueba_tmx: "res/mapas/mapa1.tmx",
};

var g_resources = [];
for (var i in res) {
    g_resources.push(res[i]);
}