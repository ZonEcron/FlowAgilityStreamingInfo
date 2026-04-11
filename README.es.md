# Flow Agility Streaming Info V0.7.0

Overlay HTML standalone para retransmisiones de agility canino. Sirve para mostrar en pantalla el guía, el perro, el club, el tiempo, las faltas, los rehúses, el eliminado y las tablas de resultados.

[English](README.md) | [Español](README.es.md)

## Guía Rápida

Si solo quieres arrancar y verlo funcionar:

1. Descarga el proyecto y abre `index.html`.
2. Haz doble clic en una zona vacía.
3. Si vas a usar FlowAgility:
   pega la URL sin `wss://` y pulsa `Connect`.
4. Si vas a usar cronómetro:
   elige la marca, escribe `host:port` y pulsa `Connect`.
5. Si quieres mover textos o tablas:
   pulsa `Enter Edit`.
6. Cuando termines:
   pulsa `Save`.
7. Si quieres una copia de seguridad:
   usa `Export`.

Si vas a conectar un cronómetro local, usa siempre la versión local del HTML. No la de GitHub Pages.

## Índice

1. [Qué Es](#qué-es)
2. [Para Qué Sirve](#para-qué-sirve)
3. [Formas De Uso](#formas-de-uso)
4. [Instalación Rápida](#instalación-rápida)
5. [Primer Arranque](#primer-arranque)
6. [Conexión Con FlowAgility](#conexión-con-flowagility)
7. [Conexión Con Cronómetro Local](#conexión-con-cronómetro-local)
8. [Modo Edición](#modo-edición)
9. [Guardar, Exportar E Importar](#guardar-exportar-e-importar)
10. [Cómo Funciona La Sincronización Entre Ventanas](#cómo-funciona-la-sincronización-entre-ventanas)
11. [Paneles De Debug Y Replay](#paneles-de-debug-y-replay)
12. [Problemas Frecuentes](#problemas-frecuentes)
13. [Consejos De Uso En Competición](#consejos-de-uso-en-competición)
14. [Referencias](#referencias)

## Qué Es

FASI es un único HTML que se abre directamente en el navegador, sin instalar nada más.

Puede trabajar:

- solo con FlowAgility
- solo con cronómetro local
- con FlowAgility y cronómetro a la vez
- sin conexiones, para diseñar la máscara

## Para Qué Sirve

Casos típicos:

- capa gráfica para OBS, vMix u otro software de streaming
- pantalla informativa en pista
- videowall
- ventana de edición en un monitor y ventana limpia de emisión en otro

## Formas De Uso

Hay dos formas principales:

1. Uso online desde GitHub Pages  
   Enlace: `https://zonecron.github.io/FlowAgilityStreamingInfo/`

2. Uso local descargando el proyecto  
   Esta es la opción recomendada si vas a conectar un cronómetro local.

Importante:

- si abres la versión online por `https`, no podrás conectar con un cronómetro local por las restricciones de seguridad del navegador
- para usar cronómetro local, descarga el proyecto completo y abre el archivo `index.html` directamente en tu navegador

## Despliegue Rápida

1. En GitHub, pulsa el botón verde `Code`.
2. Pulsa `Download ZIP`.
3. Descomprime el ZIP en una carpeta.
4. Abre `index.html` con tu navegador.

No hace falta instalar dependencias ni compilar nada.

## Primer Arranque

Cuando abras la página:

1. Haz doble clic sobre una zona vacía.
2. Se abrirá la ventana general.
3. Desde ahí puedes:
   - configurar conexiones
   - cambiar el color del fondo
   - cargar una imagen overlay
   - entrar en modo edición
   - guardar o exportar la configuración

Si no tocas nada, la página muestra datos de ejemplo para poder diseñar la máscara.

## Conexión Con FlowAgility

### Qué Poner En El Campo

En el campo de FlowAgility debes escribir solo la dirección que te da FlowAgility, sin protocolo.

Correcto:

- `flow.example.com/stream/abc123`
- `myserver.com/ws/ring1`

Incorrecto:

- `wss://flow.example.com/stream/abc123`
- `ws://flow.example.com/stream/abc123`
- `https://flow.example.com/...`

### Cómo Conectar

1. Haz doble clic en una zona vacía.
2. En `Flow Agility Connection`, pega la URL.
3. Pulsa `Connect`.

Si todo va bien:

- el estado cambiará a `Connected`
- la pantalla se actualizará con los datos de FlowAgility

### Qué Datos Vienen De FlowAgility

Cuando FlowAgility está conectado, FASI usa FlowAgility como fuente principal para:

- perro
- guía
- club
- faltas
- rehúses
- eliminado
- tabla `Course Results`
- tabla `Combined Results`

## Conexión Con Cronómetro Local

### Qué Poner En El Campo

En el campo del cronómetro debes escribir `host:port`, sin protocolo.

Correcto:

- `192.168.4.1:81`
- `192.168.4.10:8080`

Incorrecto:

- `ws://192.168.4.1:81`
- `http://192.168.4.1:81`
- `192.168.4.1`

### Tipos Soportados

Actualmente este html soporta cronometros de las marcas:

- `ZonEcron`
- `Galican`

### Ejemplos Habituales

- marcador ZonEcron: `192.168.4.1:81`
- app mochila ZonEcron: `localhost:8080` o `192.168.1.43:8080`
**Note:** El puerto de la app puede ir del 8080 al 8100.

### Cómo Conectar

1. Haz doble clic en una zona vacía.
2. Elige el tipo de cronómetro.
3. Escribe `host:port`.
4. Pulsa `Connect`.

### Qué Hace El Cronómetro

Si hay cronómetro conectado:

- el tiempo puede correr en vivo mientras el equipo está en pista
- la velocidad se calcula en tiempo real

Si FlowAgility también está conectado:

- las faltas, rehúses y eliminado salen de FlowAgility
- el cronómetro no pisa esos valores en pantalla

Si FlowAgility no está conectado:

- FASI puede mostrar en pantalla faltas, rehúses y eliminado recibidos del cronómetro

## Modo Edición

El modo edición sirve para cambiar el aspecto y la posición de los elementos.

### Entrar En Modo Edición

1. Haz doble clic en una zona vacía.
2. Pulsa `Enter Edit`.

### Qué Puedes Hacer

En modo edición puedes:

- arrastrar textos y tablas
- cambiar tamaño, color y fondo
- cambiar posición
- cambiar orden de capas
- ocultar elementos
- cambiar textos antes y después del valor

### Cómo Mover Un Elemento

1. Entra en modo edición.
2. Arrastra el elemento con el ratón.

### Cómo Cambiar Propiedades De Un Elemento

1. Entra en modo edición.
2. Haz doble clic sobre el elemento.
3. Cambia lo que necesites.
4. Pulsa `OK` para guardar o `Cancel` para descartar.

### Ventanas De Propiedades

Las ventanas `General` y `Properties` se arrastran desde su barra superior.

Si están abiertas:

- no podrás editar otros elementos hasta cerrarlas

### Opción Hide

Si marcas `Hide` en un elemento:

- no desaparecerá inmediatamente si sigues en modo edición
- al salir de modo edición se aplicará de verdad

Comportamiento especial:

- `ELIMINATED` solo aparece cuando el equipo está eliminado
- `Faults` y `Refusals` se ocultan cuando se muestra `ELIMINATED`

### Deshacer Y Rehacer

En modo edición:

- `Ctrl + Z` deshace
- `Ctrl + Y` rehace
- `Ctrl + Shift + Z` también rehace

Hay historial para las últimas 100 acciones.

## Guardar, Exportar E Importar

### Save

El botón `Save`:

- guarda la configuración actual en el navegador
- mantiene la configuración aunque cierres la página
- sincroniza otras ventanas del mismo navegador

Si guardaste conexiones, al volver a abrir la página intentará reconectar automáticamente.

### Export

El botón `Export`:

- guarda toda la configuración en un archivo `.json`

Úsalo como copia de seguridad.

### Import

El botón `Import`:

- carga una configuración guardada anteriormente

Importante:

- `Import` solo aparece en una ventana sin personalizar o recién reseteada
- en cuanto haces un cambio real en la configuración, ese botón pasa a ser `Export`
- entrar en modo edición por sí solo no cambia el botón
- si quieres volver a importar desde cero, usa `Reset`

### Reset

`Reset` borra la configuración guardada y recarga la página.

## Cómo Funciona La Sincronización Entre Ventanas

Si abres dos ventanas del mismo navegador con la misma página:

- puedes editar en una
- pulsar `Save`
- y la otra se actualizará sola

Esto es útil para:

- tener una ventana de edición
- y otra ventana limpia para emitir

Importante:

- la sincronización depende del almacenamiento local del navegador
- distintos navegadores no comparten esa configuración entre sí

## Paneles De Debug Y Replay

Estos paneles son opcionales. No afectan a la ventana normal si no los activas.

### Debug

Abre la página así:

- `index.html?debug=1`

Sirve para ver:

- estado de las conexiones
- equipo actual y siguiente
- tamaño de las tablas
- log técnico de eventos

### Replay

Abre la página así:

- `index.html?replay=1`

Sirve para:

- cargar fixtures
- avanzar mensaje a mensaje
- detectar automáticamente si el fixture es de Flow, ZonEcron o Galican
- grabar tráfico real para crear fixtures nuevos

### Ambos A La Vez

- `index.html?debug=1&replay=1`

## Problemas Frecuentes

### No Conecta Con FlowAgility

Revisa:

- que hayas puesto la URL sin `wss://`
- que no haya espacios
- que la URL sea la correcta

### No Conecta Con El Cronómetro

Revisa:

- que estés usando la versión local del HTML, no la de GitHub Pages
- que hayas puesto `host:port`
- que hayas elegido el tipo correcto de cronómetro

### He Perdido Mi Diseño

Si no pulsaste `Save`, los cambios no quedan guardados.

Recomendación:

- pulsa `Save` cuando termines
- y además exporta un `.json` de respaldo

### El Botón Import No Aparece

Es normal si ya has tocado la configuración.

Para volver a importar desde cero:

1. pulsa `Reset`
2. vuelve a abrir la ventana general
3. usa `Import`

### No Se Sincronizan Dos Ventanas

Revisa:

- que sean del mismo navegador
- que estén abriendo la misma página
- que hayas pulsado `Save`

### En GitHub Pages No Conecta Al Cronómetro

Es normal. El cronometro local usa `ws` sin cifrado, y no esta permitido ese tipo de conexion desde un `https` como el de GitHub.

Para usar cronómetro:

- descarga el proyecto
- y abre `index.html` localmente

## Consejos De Uso En Competición

Recomendado:

1. Prepara el diseño antes de empezar la prueba.
2. Haz `Save`.
3. Exporta un `.json` de respaldo.
4. Si vas a emitir, usa una ventana para edición y otra para salida limpia.
5. Si aparece un caso raro, abre otra ventana con `?debug=1`.
6. Si necesitas guardar tráfico real para depurar luego, usa `?replay=1` y `Record`.

## Referencias

FlowAgility Streaming API:

- https://github.com/flowagility/streaming

ZonEcron Interfacing:

- https://github.com/ZonEcron/ZonEcron-Interfacing

Web oficial de ZonEcron:

- https://www.zonecron.com
