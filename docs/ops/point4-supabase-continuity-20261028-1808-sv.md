# Fábrica IA — Punto 4: auditoría de continuidad (28 oct 2026, 18:08 SV)

## Alcance y método
Control de solo lectura del proyecto Site `appgprj_6adbf0c05a0c8191b2ca585b76f5e862`, del estado observable mediante el complemento Fábrica, de Supabase `udispwzwrebjkanudcoy`, de las funciones SQL instaladas, de `AGENTS.md` y de los seis workflows de `main`. No se ejecutó manualmente `private.fabrica_scheduler_tick()`, no se alteró cuota, `not_before`, trabajos, secretos, Site ni disparadores.

## Evidencia verificada
- Supabase `udispwzwrebjkanudcoy`: proyecto `ACTIVE_HEALTHY`; `cron.job` contiene **un único** job activo, `jobid=1`, `jobname=fabrica-queue`, `schedule=* * * * *`, comando `select private.fabrica_scheduler_tick();`.
- `cron.job_run_details`: **290 ejecuciones SQL**, todas `succeeded`, cero fallidas. Última `runid=290`, `2026-10-29 00:07:00.040156+00` (18:07 SV). Frente a la auditoría de 17:09 SV (232), son **58 ticks adicionales**. `succeeded` y `1 row` solo acreditan invocación SQL.
- `private.fabrica_scheduler_receipts`: **1 recibo**, `cycle_id=97d77278-26db-4069-ad2c-059b2fe6402e`, `request_id=1`, `http_status=200`, `verified=true`, `site_status=quota`, `error_code=null`; **cero recibos `done`**.
- Cruce con `net._http_response`: `status_code=200`, `timed_out=false`, `error_msg=null`, `run.status=quota`, `run.id=null`, `receipt.job_id=null`; UUID y `scheduled_at=1793215080180` coinciden. `next_at=1793257260000`.
- `private.fabrica_scheduler_config`: `enabled=true`, `last_error=null`, `not_before=2026-10-29 07:01:00+00` = **29 oct 01:01 SV**. La espera es legítima; no hubo nueva petición al Site durante el diferimiento.
- Complemento Fábrica: cuota **20/20**; **6 tareas `queued`** (intentos cero) y **1 paso `waiting`** por cuota; `health.supabase_runner.status=quota`, `job_id=null`; `health.autonomy.status=waiting`. Las seis pruebas sintéticas históricas aparecen `done`, pero no son entregas del cron principal. Existen dos ciclos MCP `busy`, que no se atribuyen a Supabase Cron.
- SQL instalado: `private.fabrica_scheduler_tick()` usa `pg_try_advisory_xact_lock`, `FOR UPDATE`, guardia `not_before` y control de recibo pendiente; `private.fabrica_scheduler_reconcile()` verifica proveedor, UUID, horario, estado, `job_id` en `done` y maneja errores/respuestas ausentes. Evidencia de **implementación**, no de carrera/reintento/reanudación probados.
- GitHub `.github/workflows`: `agent-runner.yml`, diagnósticos A/B/C, `training-regression.yml` y `verify-training.yml` **sin `on.schedule`**; el ejecutor GitHub es manual. Los workflows de pruebas pueden activarse por `push`, lo cual no equivale a cron.
- `AGENTS.md` leído: exige preservar el Site y separar las pruebas reales de simulaciones. Se inspeccionó `worker/runtime.mjs` del repositorio para localizar guardias de bloqueo/pausa/reintentos, pero **no se pudo verificar que el editor original de Sites ejecute exactamente esta revisión**.
- Logs unificados de Supabase, ventana 23:00–00:07:30 UTC: 164 eventos `postgres_logs` y 3 `pgbouncer_logs`; estos conteos no prueban procesamiento `done`. El campo `error_severity` no venía poblado y no se infiere ausencia de errores semánticos.

## Decisión
**Punto 4 NO CERTIFICADO**. Se acredita continuidad de SQL cron, configuración de un único disparador principal y correlación del recibo `quota`. No hay una entrega `done` atribuible a Supabase Cron ni prueba directa de concurrencia, idempotencia, reintento y recuperación E2E en el Site original.

## Próxima comprobación
Respetar `not_before` hasta el **29 oct 01:01 SV**. Sin forzar `tick` ni alterar cuota/fechas, comprobar el próximo ciclo natural: `cron.job_run_details`, `private.fabrica_scheduler_receipts`, `net._http_response` y estado/recibo del Site deben concordar en UUID, `job_id` y `done`, sin duplicaciones. Si reaparece `quota`/`deferred`, mantener la espera. Después comprobar bloqueo mutuo, reintentos, pausa y recuperación E2E antes de certificar. No se requiere intervención del usuario en este momento.
