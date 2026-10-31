# Punto 4 — auditoría de continuidad, 2026-10-31 14:15 SV

## Estado rector y alcance
**CERRADO PROVISIONALMENTE, SIN CERTIFICACIÓN.** Solo Fábrica de Agentes IA. Site original `appgprj_6adbf0c05a0c8191b2ca585b76f5e862`; repositorio `Rick2818/Fabrica-de-Agentes-IA`; Supabase `udispwzwrebjkanudcoy`. No confundir punto 4 con estación visual 4 ni issue #4. La fuente nativa v53 se había recuperado previamente (identificador `5be977154cc15c9511787d22e28b7367e6f00467`) y se habían aprobado 122 pruebas de servidor sobre un worktree de esa fuente: **evidencia histórica aportada, no repetida ni extrapolada al despliegue vigente**. La versión 54 permanece fuera del alcance de despliegue.

## Evidencia directa — corte 2026-10-31 20:15:31 UTC
- `cron.job`: único `fabrica-queue` id=1, `* * * * *`, `active=true`, comando `select private.fabrica_scheduler_tick();`.
- `cron.job_run_details`: **4,378** ejecuciones `succeeded` (última 20:15:00 UTC); **0** otros estados al primer corte 20:14 UTC. SQL exitoso no acredita trabajo procesado.
- `private.fabrica_scheduler_receipts`: **3,635** recibos, **3,629** `verified=true`, **9** `site_status=done` históricos, **5** `network_error` históricos. Últimos 60 minutos consultados a las 20:14 UTC: **60** recibos, **59** verificados, **0** `done`.
- Último ciclo conciliado al corte: `5ed8e023-99d4-41fc-ab09-9f28b743e5c9` (20:14 UTC), request_id=3635, HTTP 200, `verified=true`, `site_status=idle`. El Site muestra ese UUID en `health.autonomy.last_scheduled_cycle` durante la lectura inicial; la lectura posterior del Site ya muestra el ciclo 20:15.
- Ciclo posterior `f4d424fb-a84f-443b-8807-9281e54cfc84` (20:15 UTC), request_id=3636: Site `source=supabase-cron`, `status=idle`; **al corte SQL `checked_at=NULL`, `verified=false`**. No declararlo conciliado todavía. Ninguno de los dos ciclos representa entrega nueva.
- Control de integridad: **0** UUID de ciclo duplicados, **0** request_id duplicados, **0** recibos sin conciliar con más de tres minutos sin `error_code`. Índices únicos `fabrica_scheduler_receipts_pkey(cycle_id)` y `fabrica_scheduler_receipts_request_id_key(request_id)` presentes.
- Configuración `private.fabrica_scheduler_config`: `enabled=true`, `not_before=NULL`, `last_error=NULL`. No se forzaron ticks, cuotas, fechas ni reintentos.
- Funciones sin cambios frente a 13:15 SV: `fabrica_scheduler_tick` MD5 `7fb25848caa91dc78eb0f469659f691d`; `fabrica_scheduler_reconcile` MD5 `78a1057460b103ae1cddfb5d5e0339f0`. La lectura estática detecta referencia a `not_before` en ambas y advisory lock en `tick`; **no es prueba dinámica de concurrencia o pausa**.
- Cinco errores `network_error` históricos: 2026-10-31 14:57 UTC, 2026-10-30 05:54, 05:17, 03:53 y 00:38 UTC. No hay error nuevo en la última hora. El timeout de 55 s del evento 14:57 UTC fue investigado en un control anterior; no se infiere la misma causa para los demás.
- Logs unificados, ventana 19:15–20:14:59 UTC: **144** `postgres_logs`, **3** `pgbouncer_logs`. Este recuento no prueba ausencia de errores de aplicación.

## Site y seis agentes — lectura del conector
- `agent_status`: **65** trabajos, **60 done, 2 failed, 3 cancelled, 0 pendientes**; **0** leases activos y **0** reintentos vencidos en la muestra. Cuota **0/20**.
- `automation.enabled=true`, principal `supabase:udispwzwrebjkanudcoy:fabrica-queue`, `health.autonomy.primary.recent=true`, ciclos recientes `idle`, sin `deferred_until`. El ciclo Site de 20:15 UTC coincide en UUID con el recibo SQL todavía pendiente de conciliación.
- Seis tareas `synthetic-six-20261028-{leo,mila,vera,alma,nico,lia}`: todas `done`, evidencia de modelo HTTP 200 y respuesta de texto; **prácticas históricas, no E2E de fabricación/entrega ni aceptación de cliente**. No se ejecutaron nuevas pruebas sintéticas.
- Chequeos de modelo históricos: primario `gemini-2.5-flash` HTTP 404, respaldo `gemini-2.5-flash-lite` HTTP 404, tercero `gemini-3.5-flash-lite` HTTP 200. Las seis prácticas históricas usaron `gemini-3.6-flash`; no se certifica el fallback actual por esos recibos.
- **Discrepancia a conciliar, no corregir a ciegas**: `AGENTS.md` vigente asigna Alma=Química/Farmacia y Lía=Mercadeo, pero ciertas fichas históricas del Site usan Alma=Mercadeo y Lía=Legal/documental. La diferencia de etiquetas no demuestra por sí sola error de enrutamiento actual. Preservar recibos históricos.

## GitHub, respaldo y fuente nativa
- Leídos directamente los **siete** archivos actuales de `.github/workflows/`: `agent-runner.yml`, `diagnostic-a-scheduler.yml`, `diagnostic-b-conditions.yml`, `diagnostic-c-actor.yml`, `factory-regression.yml`, `training-regression.yml` y `verify-training.yml`. **Ninguno contiene `schedule:`**. `agent-runner.yml` es solo `workflow_dispatch` y conserva `SITE_ORIGIN=https://agente-ricardo-revision-rick.glassybell1025.chatgpt.site`. La URL distinta del Site original consignada en controles previos debe conciliarse nativamente antes de ejecutar manualmente.
- Respaldo horario `6adbf94d28e8819189c0516c6068457a`: `is_enabled=true`; último run id `33c3cc0e-6044-8333-8269-fbc769279306`, `recorded_status=no_update`, `latest_result=null`. No atribuirle entrega, error ni una ejecución de la cola sin recibo.
- Se consultó la Biblioteca para localizar el Site original, pero los resultados identificables como Site corresponden a **otro project_id** `appgprj_6ae3492415ec8191be7751f17efe3260`; **no usarlo como fuente del original**. La fuente nativa original v53 sí fue recuperada históricamente; **en esta pasada no se pudo comparar la fuente nativa de la versión desplegada**. El identificador v53 tampoco es un commit recuperable del repositorio GitHub (consulta GitHub 422), lo que no invalida su procedencia nativa de Sites.

## Comparación con 13:15 SV
- SQL `succeeded`: **4,318 → 4,378 (+60)**.
- Recibos: **3,575 → 3,635 (+60)**; verificados **3,569 → 3,629 (+60)**.
- `network_error`: **5 → 5**; `site_status=done`: **9 → 9**; Site **60/2/3/0**, sin cambio. No hay regresión nueva confirmada en estas lecturas.

## Pendientes — no aprobar sin evidencia
1. Acceso nativo al Site original desplegado: versión exacta, URL, código actual y mapa de seis perfiles; comparar sin reemplazar fuente ni activar v54.
2. Pruebas dinámicas **aisladas** de locks, concurrencia, idempotencia, pausas, `not_before`, recuperación, reintentos y fallback. La inspección estática y los recibos `idle` no sustituyen estas pruebas.
3. Diagnóstico causal de los cinco errores de transporte y latencia del Site; solo uno tiene timeout 55 s demostrado.
4. Recorrido E2E sintético con orden persistida, aprobación, fabricación, QA, agente/cabina y entrega ficticia con recibos ligados a un mismo identificador; aceptación final de cliente real **pendiente**.

**Acciones de esta pasada:** lecturas directas de Supabase, Site mediante complemento, GitHub, logs y respaldo; creación de este informe durable. No se creó un segundo ejecutor, tarea, disparador o encargo; no se hicieron llamadas de modelo, envíos, pagos ni contacto con terceros; no se alteraron Site, producción, modelos, cuotas, fechas, versiones, código funcional o trabajos. **Punto 4 permanece cerrado provisionalmente y sin certificación.**
