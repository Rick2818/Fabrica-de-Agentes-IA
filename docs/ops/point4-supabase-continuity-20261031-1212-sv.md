# Punto 4 — auditoría de continuidad, 2026-10-31 12:12 SV

## Estado rector
**CERRADO PROVISIONALMENTE, SIN CERTIFICACIÓN.** Exclusivamente Fábrica de Agentes IA. Site `appgprj_6adbf0c05a0c8191b2ca585b76f5e862`; repositorio `Rick2818/Fabrica-de-Agentes-IA`; Supabase `udispwzwrebjkanudcoy`. No confundir punto 4 con estación 4 ni issue #4. La fuente histórica v53, commit `5be977154cc15c9511787d22e28b7367e6f00467`, tuvo 122 pruebas de servidor aprobadas en su worktree, **sin demostrar identidad con la versión desplegada**. La versión 54 guardada no se activó.

## Supabase — lectura directa (corte 18:11–18:12 UTC)
- `cron.job`: **un** job `fabrica-queue` (id 1), activo, `* * * * *`, comando `select private.fabrica_scheduler_tick();`. `private.fabrica_scheduler_config`: `enabled=true`, `not_before=NULL`, `last_error=NULL`.
- `cron.job_run_details`: **4,254** ejecuciones SQL `succeeded`, **0** otros estados al corte inicial de las 18:11 UTC; la ejecución siguiente (runid 4255, 18:12 UTC) también terminó `succeeded`. La ejecución SQL por sí sola no acredita procesamiento de tareas.
- `private.fabrica_scheduler_receipts`: **3,511** recibos, **3,505** `verified=true`, **5** `network_error` históricos, **9** `site_status=done` históricos. En la última hora: 60 recibos, 59 verificados, 0 `done`, 0 errores nuevos. El recibo más reciente estaba en conciliación normal.
- Último UUID conciliado: `ad04027d-3559-4c77-9d4e-21b51e76acc9`, programado a 18:10 UTC, conciliado 18:11:00 UTC, HTTP 200, `verified=true`, `site_status=idle`. Siguiente UUID `ff068f90-d274-4a48-bbce-bd77270bca7c`, programado 18:11 UTC, coincidía con el ciclo Site `idle` y tenía HTTP 200 en `net._http_response` (id 3512), pero `checked_at=NULL` y `verified=false` al corte. **No marcarlo verificado anticipadamente**.
- 0 recibos no verificados con más de tres minutos y sin `error_code`. **3,511 UUID distintos y 3,511 request_id distintos**; índices únicos en ambos campos. Estos índices no sustituyen pruebas de concurrencia o idempotencia dinámicas.
- Hashes de funciones SQL: `fabrica_scheduler_tick=7fb25848caa91dc78eb0f469659f691d`; `fabrica_scheduler_reconcile=78a1057460b103ae1cddfb5d5e0339f0`. Inspección estática: `not_before` referenciado en ambas; `pg_try_advisory` en tick. No se forzó tick.
- El último `network_error` es UUID `7a6ca346-b178-4869-baec-136c47c47bb8`, 2026-10-31 14:57 UTC (08:57 SV), request_id 3323. `net._http_response` confirma `timed_out=true`, timeout de 55,000 ms. Cinco errores de transporte acumulados; causa de latencia del Site no demostrada. Los ciclos posteriores recuperaron respuestas verificadas.
- Logs unificados 17:11–18:11 UTC: 144 entradas `postgres_logs` y 3 `pgbouncer_logs`; conteo por fuente no demuestra ausencia de errores ni explica el timeout.

## Site — conector operativo, sin inspección nativa de fuente
- `agent_status`: **65 trabajos: 60 done, 2 failed históricos, 3 cancelled, 0 pendientes**. Sin leases activos, sin trabajos vencidos para reintento; cuota **0/20**.
- `automation.enabled=true`; identidad principal `supabase:udispwzwrebjkanudcoy:fabrica-queue`. `health.supabase_runner.status=idle`, `pending=0`, `health.autonomy.primary.recent=true`. UUID del ciclo más reciente `ff068f90-d274-4a48-bbce-bd77270bca7c` coincide con recibo SQL aún pendiente de conciliación.
- Los seis IDs `synthetic-six-20261028-{leo,mila,vera,alma,nico,lia}` figuran `done` con evidencia de ejecución de **prácticas de texto sintéticas anteriores**. No son nuevos ensayos de esta auditoría ni prueban fabricación/entrega E2E, autonomía integral o aceptación del cliente.
- Modelos declarados: `gemini-2.5-flash` primario, `gemini-2.5-flash-lite` respaldo y `gemini-3.5-flash-lite` tercero. Pruebas históricas sintéticas HTTP 404, 404 y 200, respectivamente. No se realizaron nuevas llamadas de modelo ni se certificó fallback.
- Metadatos operativos guardados identifican versión 58, fuente `207466f651085ed04ec5ed0cc3cdc1628b17f3a6` y URL `https://agente-ricardo-revision-rick.rick271711.chatgpt.site`. Son **metadatos del Site**, no inspección nativa actual de su código efectivamente desplegado.

## GitHub y respaldo
- `AGENTS.md` leído en `main`: preservar el Site original, fuente y datos; separar certificación de pruebas; usar `worker/runtime.mjs` y pruebas de servidor antes de editar runtime.
- Se leyeron individualmente los **siete workflows** actuales en `.github/workflows`: **ninguno** tiene disparador `schedule`. `agent-runner.yml` es manual (`workflow_dispatch`) y conserva `SITE_ORIGIN=https://agente-ricardo-revision-rick.glassybell1025.chatgpt.site`, distinto de la URL de los metadatos v58; **no ejecutarlo manualmente hasta conciliación nativa**.
- Respaldo horario `6adbf94d28e8819189c0516c6068457a`: `is_enabled=true` por `Automations.peek`, último intento registrado `no_update`. No se invocó ni modificó; `no_update` no prueba que haya procesado un trabajo.
- En esta sesión no hubo acción nativa de lectura de fuente de Sites; **no se afirma que la fuente sea irrecuperable**: v53 se recuperó antes mediante acceso nativo. Falta comparar nativamente código/URL/versión de despliegue vigente, sin sustituir código ni activar v54.

## Diferencia contra 11:07 SV
- SQL `succeeded`: **4,190 → 4,254** (+64 al corte 18:11 UTC).
- Recibos **3,447 → 3,511** (+64); verificados **3,441 → 3,505** (+64).
- Errores `network_error`: **5 → 5**. `site_status=done`: **9 → 9**. Trabajos Site **60/2/3/0**, sin variación. No se identificó nueva entrega ni regresión operativa en esta muestra.

## Pendientes no aprobados ni certificados
1. Comparación **nativa** de fuente, URL, configuración y versión del Site realmente desplegado contra GitHub y fuentes históricas; resolver discrepancia de URL manual sin alterar Site.
2. Pruebas dinámicas **aisladas** de locks/concurrencia, idempotencia, pausa, `not_before`, reintentos, recuperación persistente y fallback. No tocar cuotas ni fechas reales.
3. Diagnóstico causal de los cinco `network_error`, especialmente el timeout de 55 segundos.
4. Recorrido E2E **sintético** de los seis agentes con recibos de fabricación y entrega operativos, separado de la **aceptación final de cliente real**, todavía inexistente.

**Acciones:** consultas de solo lectura a Supabase, Site, GitHub, logs y respaldo; únicamente escritura de este documento de evidencia en GitHub. No se ejecutaron pruebas sintéticas nuevas ni se modificaron producción, Site, modelos, cuotas, `not_before`, ejecutores, disparadores, trabajos, pagos, mensajes ni terceros. **Punto 4 permanece cerrado provisionalmente, sin certificación.**
