# Continuidad y avisos de Fábrica de Agentes IA

## Mecanismo implementado y estado actual

El servidor conserva trabajos, fechas, resultados, cuotas y leases en D1. El navegador consulta avances; abrir, refrescar o mantener visible la página ya no dispara automáticamente la cola. Un encargo nuevo inicia su primer trabajo desde el servidor y los siguientes los retoma la programación. El botón «Ejecutar un pendiente ahora» es una intervención manual explícita y no certifica autonomía.

La programación anterior de ChatGPT permanece pausada durante la preparación del reemplazo. El supervisor existente se reactivó y se adaptó a GitHub después de liberar el cupo del ejecutor anterior. No hay supervisión recíproca ni debe reactivarse el ejecutor antiguo.

El nuevo workflow de GitHub está preparado para los minutos 7, 22, 37 y 52 de cada hora UTC. Tiene sus dos secretos configurados y AGENT_RUNNER_ENABLED=true. Se comprobó la conexión mediante una ejecución manual real; quedan pendientes la observación del primer evento programado y un trabajo con resultado por esta ruta. Conserva el mismo servidor, base, cuotas y controles; no agrega agentes ni servicios de pago. Ver [runner-package/README.md](runner-package/README.md).

## Recibos y límites de la evidencia

`agent_cycles` registra cada llamada de ejecución, incluso una cola vacía: identificador del ciclo, programación declarada, ruta, trabajo, estado y fechas. El identificador debe contrastarse con `last_run.id` del programador nativo. Un origen declarado o un HTTP 200 de Gemini por sí solos no acreditan una ejecución programada. La actividad del navegador no cuenta como latido del programador.

Se considera reciente un ciclo de ChatGPT completado dentro de 90 minutos, o de GitHub dentro de 45 minutos. Una comprobación real que encuentra la programación deshabilitada, fallida o pidiendo intervención genera un aviso persistente. Las esperas futuras y por cuota se conservan; no se adelantan tareas para lograr una prueba. Los ciclos vacíos no consumen solicitudes de Gemini.

## Entrega de avisos

`notifications` contiene avisos de objetivos y encargos terminados, bloqueos e interrupciones. Los identificadores estables evitan duplicados. La bandeja «Avisos» recupera el mismo estado desde cualquier dispositivo autorizado.

- `announced_at`: el programador preparó el aviso para su respuesta en ChatGPT. No demuestra que llegó una notificación push ni que Rick lo leyó.
- `read_at`: acuse explícito mediante «Marcar como leído» en la bandeja autenticada. Los ejecutores MCP no pueden acreditar lectura humana mediante su herramienta de anuncio.
- Las pruebas automatizadas de lectura verifican el mecanismo; no se presentan como lectura de Rick.

Un bloqueo debe indicar el dato que falta. El objetivo no se transforma en una entrega exitosa ni se pierde. Las solicitudes y avisos permanecen disponibles después de cerrar la página.

## Controles y operación

«Pausar trabajo programado» conserva la cola y evita que el programador y su supervisor ejecuten trabajo. «Retomar trabajo programado» vuelve a permitirlo; permite que un disparador ya habilitado vuelva a ejecutar. No habilita por sí mismo una programación desactivada en su proveedor. Pausar un objetivo afecta únicamente ese objetivo. Los controles del proveedor de programación siguen siendo independientes.

Los límites del MVP se conservan: 20 intentos de IA al día en la app, máximo ocho intentos por objetivo y una corrección. No habilitar facturación ni aumentar estos límites para obtener una certificación. La recuperación de cuota y de errores transitorios debe terminar el mismo trabajo sin duplicarlo.

## Pruebas de esta entrega

35 pruebas locales con SQL real cubren concurrencia, fechas de tareas y objetivos, cuotas, reintentos, cancelación, reinicio, avisos persistentes, deduplicación, separación anuncio/lectura, aislamiento de las rutas y respeto de una pausa elegida por Rick. Gemini se simula en esas pruebas; no sustituyen ejecuciones reales del programador.

Para acreditar producción se cruzan los registros nativos con los recibos del agente y los resultados guardados. La prueba en marcha usa dos entregas con fechas futuras y un objetivo que debe bloquearse porque falta su documento. El navegador de revisión permanece cerrado durante esos trabajos. No es posible observar desde aquí el estado físico de la laptop de Rick.

Los resultados finales y las limitaciones se agregan a `agentes.md` cuando exista evidencia. No declarar continuidad indefinida ni recepción de push sin pruebas.

## Alcance que sigue pendiente

Rick mantiene como requisitos del personaje hablar, cantar y bailar. Están registrados para la siguiente etapa; no se declaran implementados en esta entrega de continuidad.

## Resultado de producción y límite encontrado, 24-10-2026

La ejecución nativa del supervisor `0ab6e49c-d9ac-832a-a547-3336d73fec89` procesó las dos entregas futuras y el bloqueo esperado con el navegador de revisión cerrado. `continuidad-futura-a` terminó después de su fecha prevista. `continuidad-futura-b` recibió HTTP 503 y terminó el mismo trabajo al segundo intento, después de su fecha y de su espera de recuperación. El objetivo `continuidad-bloqueo-real` quedó en `needs_input` porque faltaba el contrato, sin inventar una revisión. Hay comprobantes HTTP 200, hashes y `execution_source=scheduled-mcp`. No quedaron trabajos queued/running/waiting. Esta evidencia corresponde a ChatGPT y al servidor del Site, no a GitHub Actions.

La pausa controlada detectó además un límite de capacidad de **ChatGPT**: al reactivar el ejecutor principal, Automations respondió `too_many_active_automations`, con cinco tareas activas y límite de cinco. El supervisor nuevo ocupaba la plaza liberada durante la prueba. Se archivó únicamente ese supervisor y se restauró el ejecutor principal; el proveedor confirmó `is_enabled=true`. No se modificaron tareas de otros proyectos. La supervisión independiente no puede quedar activa junto al ejecutor con este cupo ocupado. El código de supervisión queda conservado, pero no se declara completo ese punto operativo.

GitHub Actions es un programador distinto. El repositorio público `Rick2818/Fabrica-de-Agentes-IA` contiene el código y el paquete de ejecutor, pero su workflow de producción todavía no se instaló ni se certificó. No atribuir el límite de cinco tareas de ChatGPT a GitHub. Fuentes revisadas: https://docs.github.com/en/actions/reference/limits y https://docs.github.com/en/actions/concepts/billing-and-usage .

Los avisos de entrega, bloqueo e interrupción están persistidos y disponibles en la bandeja. No se acredita lectura de Rick ni recepción de push. Las 35 pruebas locales siguen aprobadas.

## Preparación del reemplazo en GitHub

Validación local: 39 pruebas del servidor con SQL real y 7 del ejecutor con HTTP simulado. Cubren contexto válido/inválido, pausa, identidad del ciclo, privacidad del recibo, límite de fases/llamadas, destino fijo, fechas y presupuesto de tiempo. El build y el artefacto ESM se validaron. Estas pruebas no certifican un workflow real.

Configuración autorizada y realizada: ambos secretos de Actions y variable AGENT_RUNNER_ENABLED=true. Se cruzó la ejecución manual 40144699221 con su recibo en el Site. No declarar recuperación independiente ni avisos push certificados. Los avisos del MVP se guardan en su bandeja; no se acredita lectura humana.

## Activación autorizada y conexión comprobada

Rick autorizó guardar las dos credenciales y habilitar el ejecutor. Los valores no se conservan en este repositorio. La clave limitada se actualizó en Sites y se aplicó mediante el despliegue appgdep_6add4526ed608191b732084a1b2f62ee de la versión 20, revisión de entorno 4.

GitHub: https://github.com/Rick2818/Fabrica-de-Agentes-IA/actions/runs/40144699221 . Evento workflow_dispatch, intento 1, commit 78d2ada618d16dc9032a848e366851b86e8aca21. Inicio 2026-10-24T23:55:56Z, conclusión success. El paso de procesamiento terminó a las 23:56:04Z.

Recibo del Site: source github-actions, run_id 40144699221, intento 1, mismo commit y evento; started_at 1792886163663, completed_at 1792886164506, status idle y pending 0. El consumo de IA siguió en 17/20: no se llamó al modelo durante esta prueba. El tablero apunta a github:1432658222 y conserva enabled=true.

Al registrar esta evidencia, el primer evento schedule y una entrega procesada por GitHub todavía no están comprobados. La prueba manual acredita autenticación, acceso al endpoint y lectura de la cola; no una entrega de IA ni disponibilidad indefinida. El disparador antiguo de ejecución en ChatGPT permanece pausado; el supervisor se adaptó después al nuevo ejecutor de GitHub.

## Supervisión del ejecutor de GitHub

Se reutiliza la programación 6add39eb78f48191a1f6c7dfea32ed45, ahora «Supervisar Fábrica de Agentes IA», con revisión horaria en America/El_Salvador. Su activación fue confirmada; su primera ejecución con estas instrucciones todavía debe observarse. Consulta GitHub y agent_status, contrasta identificadores reales y alerta ante fallos, ciclos atascados o ausencia de recibos programados por más de 90 minutos. Respeta la pausa del tablero y las cuotas. No puede certificar el estado enabled del workflow mediante el conector actual ni reparar permisos o credenciales. No reactiva el ejecutor antiguo ni crea tareas.

Los avisos se preparan en ChatGPT y se conservan en la bandeja del MVP; no se acredita entrega de push ni lectura humana.
