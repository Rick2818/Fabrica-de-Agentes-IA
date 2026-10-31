# Punto 4 — auditoría de continuidad, 2026-10-31 10:13 SV

## Estado rector
**CERRADO PROVISIONALMENTE, SIN CERTIFICACIÓN.** Solo Fábrica de Agentes IA, Site `appgprj_6adbf0c05a0c8191b2ca585b76f5e862`, repositorio `Rick2818/Fabrica-de-Agentes-IA`, Supabase `udispwzwrebjkanudcoy`. No reabrir por ausencia de cliente real. No confundir con estación 4 ni issue #4. La fuente original v53 recuperada (commit `5be977154cc15c9511787d22e28b7367e6f00467`, 122 pruebas históricas) no demuestra identidad con el Site actualmente desplegado. La versión 54 sigue sin activar.

## Control directo de Supabase (consultas de solo lectura, corte 16:12–16:13 UTC)
- Proyecto `udispwzwrebjkanudcoy` con estado `ACTIVE_HEALTHY`.
- `cron.job`: **un único** job `fabrica-queue` (id 1), `active=true`, expresión `* * * * *`, comando `select private.fabrica_scheduler_tick();`. No se creó ni ejecutó un tick manual.
- `cron.job_run_details`: **4,135** ejecuciones `succeeded` al primer corte; 60/60 `succeeded` en la última hora consultada. Esto acredita la llamada SQL, **no** una entrega del Site.
- `private.fabrica_scheduler_receipts`: **3,392** recibos con **3,386** `verified=true`, **5** `network_error` históricos y **9** `site_status=done` históricos. Distribución: 3,369 `idle`, 9 `done`, 5 `network_error`, 4 `waiting`, 2 `error`, 1 `quota`, 1 `busy` y 1 aún sin estado. En la última hora: 60 recibos, 59 verificados, 0 errores nuevos y **0 `done` nuevos**.
- Último ciclo conciliado al primer corte: `959d8a79-7803-4913-8c6e-e05a85e08a35` (16:11 UTC), `http_status=200`, `verified=true`, `site_status=idle`. El ciclo `b8279f1b-d482-43a0-85ff-8e2f0b4a5d0a` (16:12 UTC) constaba `idle` en Site, pero sin conciliación SQL aún al corte. **No** llamarlo `done`.
- Cero recibos sin `checked_at` con antigüedad mayor a tres minutos; índices únicos presentes en `cycle_id` y `request_id` (3,392 valores distintos cada uno).
- `private.fabrica_scheduler_config`: `enabled=true`, `not_before=NULL`, `last_error=NULL`. Hashes SQL: `fabrica_scheduler_tick=7fb25848caa91dc78eb0f469659f691d`; `fabrica_scheduler_reconcile=78a1057460b103ae1cddfb5d5e0339f0`. No se alteraron.
- Los cinco `network_error` son históricos. Último: `7a6ca346-b178-4869-baec-136c47c47bb8`, 2026-10-31 14:57 UTC (08:57 SV), previamente documentado como timeout `pg_net` de 55 segundos en el control 09:08. No se detectó un sexto error. La causa de latencia remota no está demostrada.

## Contraste con el Site (conector operativo, no inspección nativa de fuente)
- `agent_status`: 65 trabajos, **60 `done`, 2 `failed` históricos, 3 `cancelled`, 0 pendientes**. Sin leases activos ni reintentos vencidos visibles; cuota 0/20.
- `automation.enabled=true`, identidad principal `supabase:udispwzwrebjkanudcoy:fabrica-queue`; `health.supabase_runner.status=idle`, `pending=0`, `health.autonomy.primary.recent=true`. UUID `b8279f1b-d482-43a0-85ff-8e2f0b4a5d0a` coincide con el último ciclo Site; su conciliación SQL era pendiente al corte. `idle` no prueba procesamiento `done`.
- Probes sintéticos **históricos** de modelos: `gemini-2.5-flash` HTTP 404, `gemini-2.5-flash-lite` HTTP 404, `gemini-3.5-flash-lite` HTTP 200. No se repitieron; no demuestran fallback confiable.
- No hubo nuevas pruebas sintéticas E2E de fabricación/entrega ni aceptación de cliente.

## GitHub, instrucciones y respaldo
- `AGENTS.md` leído en `main`: preservar Site y datos, evitar paridad/certificación no probada, distinguir programación real de ejecución manual, y exigir pruebas y recibos.
- Los siete workflows existentes fueron leídos individualmente: `agent-runner.yml`, `diagnostic-a-scheduler.yml`, `diagnostic-b-conditions.yml`, `diagnostic-c-actor.yml`, `factory-regression.yml`, `training-regression.yml`, `verify-training.yml`. **Ninguno** contiene `on.schedule`. `agent-runner.yml` usa `workflow_dispatch`, no schedule. La URL manual `SITE_ORIGIN=https://agente-ricardo-revision-rick.glassybell1025.chatgpt.site` requiere comparación nativa con la versión efectivamente desplegada; no se ejecutó manualmente.
- Automatización de respaldo `6adbf94d28e8819189c0516c6068457a`: `is_enabled=true` comprobado mediante `Automations.peek`; último run registrado `no_update` a las 15:18:50 UTC. No se modificó ni disparó.
- Logs de Supabase: ventana 14:00–16:15 UTC, 320 `postgres_logs` y 6 `pgbouncer_logs`. No contienen por sí solos diagnóstico causal del timeout remoto.

## Variación respecto al control de 09:08 SV
- SQL `succeeded`: 4,070 → **4,135** (+65).
- Recibos: 3,327 → **3,392** (+65); verificados 3,321 → **3,386** (+65).
- `network_error`: **5 → 5** (sin errores nuevos). `site_status=done`: **9 → 9** (sin nuevas entregas). Site: **60/2/3/0** sin variación.
- No se observó regresión nueva que exija intervención inmediata; no declarar certificación.

## Pendientes NO aprobados ni certificados
1. Comparación **nativa de Sites** del código, URL, versión y configuración realmente desplegados, contra fuente recuperada y GitHub. El conector operativo no proporciona lectura nativa de fuente. No sustituir el código ni desplegar v54.
2. Pruebas dinámicas **aisladas** de locks/concurrencia, idempotencia, reintentos, pausas, `not_before`, recuperación persistente y fallback. Índices, hashes y ciclos `idle` son evidencia parcial, no sustitutos.
3. Investigación causal de la latencia del timeout del 31-10 08:57 SV y cuatro fallos anteriores, sin alterar cuotas, fechas, timeout ni ejecutores en producción.
4. Recorrido E2E verificable con recibos operativos de los seis agentes y, por separado, aceptación final con cliente real cuando exista.

**Acciones:** consultas read-only a Supabase, Site, GitHub, logs y respaldo; solo documentación durable en GitHub. Sin nuevos jobs, ticks, envíos, pagos, cambios de cuota, cambios de Site, despliegues ni pruebas sintéticas que interfieran con producción. **Punto 4 cerrado provisionalmente, sin certificación.**
