# Continuidad y avisos de Agente Ricardo

## Mecanismo en producción

El servidor conserva trabajos, fechas, resultados, cuotas y leases en D1. El navegador consulta avances; abrir, refrescar o mantener visible la página ya no dispara automáticamente la cola. Un encargo nuevo inicia su primer trabajo desde el servidor y los siguientes los retoma la programación. El botón «Ejecutar un pendiente ahora» es una intervención manual explícita y no certifica autonomía.

La programación principal revisa cada hora, al minuto 46, en America/El_Salvador. El supervisor comprueba su estado cada hora, al minuto 12. Son dos programaciones de ChatGPT, no procesos instalados en la laptop. La recuperación usa las mismas operaciones y la misma base; no agrega agentes, modelos ni servicios de pago.

El supervisor compara el registro real del programador con el estado del agente. Si el principal se detiene sin solicitar una autorización y Rick mantiene habilitado el trabajo, reactiva esa misma programación y comprueba el resultado. Puede recuperar pendientes ante una interrupción o retraso mayor a 90 minutos. No elude conexiones, autorizaciones ni pausas elegidas por Rick.

## Recibos y límites de la evidencia

`agent_cycles` registra cada llamada de ejecución, incluso una cola vacía: identificador del ciclo, programación declarada, ruta, trabajo, estado y fechas. El identificador debe contrastarse con `last_run.id` del programador nativo. Un origen declarado o un HTTP 200 de Gemini por sí solos no acreditan una ejecución programada. La actividad del navegador no cuenta como latido del programador.

Se considera reciente un ciclo completado dentro de 90 minutos. Una comprobación real que encuentra la programación deshabilitada, fallida o pidiendo intervención genera un aviso persistente. Las esperas futuras y por cuota se conservan; no se adelantan tareas para lograr una prueba. Los ciclos vacíos no consumen solicitudes de Gemini.

## Entrega de avisos

`notifications` contiene avisos de objetivos y encargos terminados, bloqueos e interrupciones. Los identificadores estables evitan duplicados. La bandeja «Avisos» recupera el mismo estado desde cualquier dispositivo autorizado.

- `announced_at`: el programador preparó el aviso para su respuesta en ChatGPT. No demuestra que llegó una notificación push ni que Rick lo leyó.
- `read_at`: acuse explícito mediante «Marcar como leído» en la bandeja autenticada. Los ejecutores MCP no pueden acreditar lectura humana mediante su herramienta de anuncio.
- Las pruebas automatizadas de lectura verifican el mecanismo; no se presentan como lectura de Rick.

Un bloqueo debe indicar el dato que falta. El objetivo no se transforma en una entrega exitosa ni se pierde. Las solicitudes y avisos permanecen disponibles después de cerrar la página.

## Controles y operación

«Pausar trabajo programado» conserva la cola y evita que el programador y su supervisor ejecuten trabajo. «Retomar trabajo programado» vuelve a permitirlo; la siguiente comprobación puede recuperar una programación detenida. Pausar un objetivo afecta únicamente ese objetivo. Los controles del proveedor de programación siguen siendo independientes.

Los límites del MVP se conservan: 20 intentos de IA al día en la app, máximo ocho intentos por objetivo y una corrección. No habilitar facturación ni aumentar estos límites para obtener una certificación. La recuperación de cuota y de errores transitorios debe terminar el mismo trabajo sin duplicarlo.

## Pruebas de esta entrega

34 pruebas locales con SQL real cubren concurrencia, fechas de tareas y objetivos, cuotas, reintentos, cancelación, reinicio, avisos persistentes, deduplicación, separación anuncio/lectura, aislamiento de las rutas y respeto de una pausa elegida por Rick. Gemini se simula en esas pruebas; no sustituyen ejecuciones reales del programador.

Para acreditar producción se cruzan los registros nativos con los recibos del agente y los resultados guardados. La prueba en marcha usa dos entregas con fechas futuras y un objetivo que debe bloquearse porque falta su documento. El navegador de revisión permanece cerrado durante esos trabajos. No es posible observar desde aquí el estado físico de la laptop de Rick.

Los resultados finales y las limitaciones se agregan a `DOTS-REQUISITOS.md` cuando exista evidencia. No declarar continuidad indefinida ni recepción de push sin pruebas.

## Alcance que sigue pendiente

Rick mantiene como requisitos del personaje hablar, cantar y bailar. Están registrados para la siguiente etapa; no se declaran implementados en esta entrega de continuidad.
