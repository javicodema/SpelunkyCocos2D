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
    jugador_impactado_png : "res/jugador/jugador_impactado.png",
    jugador_impactado_plist : "res/jugador/jugador_impactado.plist",
    jugador_idle_png : "res/jugador/jugador_idle.png",
    jugador_idle_plist : "res/jugador/jugador_idle.plist",
    animacion_cuervo_png: "res/enemigoPatrulla/animacion_cuervo.png",
    animacion_cuervo_plist: "res/enemigoPatrulla/animacion_cuervo.plist",
    disparo_png:"res/disparo_jugador2.png",

    //Trampas
    trampa_caer: "res/trampas/trampa_caer.png",
    trampa_tirar_encima: "res/trampas/trampa_tirar_encima.png",
    trampa_disparo: "res/trampas/trampa_disparo.png",

    //Recolectables
    llave: "res/recolectables/llave.png",

    //De aquí abajo son de prueba
    tiles32_png: "res/mapas/tiles32.png",
    tileset_1: "res/mapas/tileset.png",
    //tileset_2: "res/mapas/tileset2.png",
    mapa_prueba_tmx: "res/mapas/mapa1.tmx",
    mapa_1_tmx:"res/mapas/mapaTiled1.tmx"
};

var g_resources = [];
for (var i in res) {
    g_resources.push(res[i]);
}