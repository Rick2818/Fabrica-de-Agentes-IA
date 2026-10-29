# Fábrica de Agentes IA — Punto 4: auditoría de continuidad (28 oct 2026, 20:09 SV)

## Identidad y límites
- Site objetivo: `appgprj_6adbf0c05a0c8191b2ca585b76f5e862`; repositorio `Rick2818/Fabrica-de-Agentes-IA` (`main`).
- Ejecutor principal: `supabase:udispwzwrebjkanudcoy:fabrica-queue`. El respaldo horario `Respaldo de pendientes Fábrica IA` procesa su propia cola y no es evidencia de entregas del cron principal.
- Auditoría de solo lectura: sin llamar `private.fabrica_scheduler_tick()`, sin `run_pending_tasks`, sin cambios en Site, cuota, `not_before`, secretos, jobs, tareas ni workflows.

## Observación directa a las 20:09 SV (29 oct 02:09 UTC)
1. Proyecto Supabase `udispwzwrebjkanudcoy`: `ACTIVE_HEALTHY`.
2. `cron.job`: un solo registro pertinente activo, `jobid=1`, `fabrica-queue`, cada minuto (`* * * * *`), comando `select private.fabrica_scheduler_tick();`.
3. `cron.job_run_details`: **412 ejecuciones SQL succeeded**, **0 con otro estado**, desde 28 oct 19:18 UTC hasta 29 oct 02:09 UTC. Último `runid=412`, `return_message=1 row`. Son invocaciones SQL, NO entregas de trabajos.
4. `private.fabrica_scheduler_config`: `enabled=true`, `last_error=null`, `not_before=2026-10-29 07:01:00+00` (29 oct 01:01 SV).
5. `private.fabrica_scheduler_receipts`: **1** recibo, `cycle_id=97d77278-26db-4069-ad2c-059b2fe6402e`, `request_id=1`, `http_status=200`, `verified=true`, `site_status=quota`, `error_code=null`, `checked_at=2026-10-28T19:18:10.748285Z`. **0 recibos `done`**.
6. Cruce directo con `net._http_response`: HTTP 200, `timed_out=false`, `error_msg=null`, `receipt.source=supabase-cron`, `receipt.supabase.run_id=97d77278-26db-4069-ad2c-059b2fe6402e`, `schedule_id=supabase:udispwzwrebjkanudcoy:fabrica-queue`, `run.status=quota`, `run.id=null`, `receipt.job_id=null`, `receipt.pending=1`, `receipt.next_at=1793257260000`. Correlación de ciclo válida, pero NO hay trabajo terminado atribuible al cron.
7. Complemento Fábrica, estado observable: cuota `20/20`; **6 queued, 1 waiting**; `health.supabase_runner.status=quota` y `health.autonomy.status=waiting`; último ciclo Supabase conserva UUID y estado `quota`. Existen entregas sintéticas históricas `done` de los seis agentes y entregas `done` del respaldo, pero sus fuentes NO son el cron principal. No hay leases activos en los siete pendientes observados.
8. Código SQL instalado: `private.fabrica_scheduler_tick` usa `pg_try_advisory_xact_lock(1432658222,51)`, bloqueo `FOR UPDATE`, `not_before` y espera por recibo pendiente. `private.fabrica_scheduler_reconcile` verifica UUID, proveedor, `schedule_id`, horario, estado y `job_id` para `done`, y gestiona fallos/rediferimiento. Implementación inspeccionada; no constituye prueba E2E de exclusión mutua, idempotencia ni recuperación.
9. GitHub `main`: lectura individual de los seis workflows `agent-runner.yml`, `diagnostic-a-scheduler.yml`, `diagnostic-b-conditions.yml`, `diagnostic-c-actor.yml`, `training-regression.yml` y `verify-training.yml`. Ninguno contiene `on.schedule`. Los dos de entrenamiento permiten `push`; todos permiten `workflow_dispatch`. Los verdes manuales o históricos no certifican el cron.
10. `AGENTS.md` vigente revisado. El complemento permite observar el Site, pero no leer la fuente vigente del editor Sites ni confirmar identidad binaria con el repositorio.
11. Logs unificados, ventana 28 oct 18:00–29 oct 02:10 UTC: `postgres_logs=987` y `pgbouncer_logs=24` en la consulta inicial; el campo `log_attributes['error_severity']` aparece vacío en la consulta de severidades y no permite afirmar ausencia de fallos semánticos.

## Consultas de reproducción (solo lectura)
```sql
select jobid,jobname,schedule,active,command from cron.job;
select runid,status,start_time,end_time,return_message from cron.job_run_details where jobid=1 order by start_time desc limit 8;
select * from private.fabrica_scheduler_config;
select cycle_id,scheduled_at,request_id,checked_at,http_status,verified,site_status,error_code from private.fabrica_scheduler_receipts order by scheduled_at desc;
-- Cruce de respuesta: s.request_id=h.id entre private.fabrica_scheduler_receipts s y net._http_response h.
```

## Dictamen
**Punto 4 NO certificado.** Hay 412 ticks SQL correctos y un único ciclo HTTP correlacionado, pero el resultado fue `quota`, no `done`. La ausencia de nuevas solicitudes mientras `not_before` está en el futuro es diferimiento esperado. No hay justificación para forzar un tick, alterar cuota o corregir código a ciegas. Falta observar, tras el restablecimiento natural, un ciclo Supabase `done` con `cycle_id`, `job_id`, recibo y estado de tarea coincidentes; luego comprobar exclusión mutua, reintentos, pausa y recuperación E2E, y leer la fuente vigente del Site.

Referencias: [AGENTS.md](https://github.com/Rick2818/Fabrica-de-Agentes-IA/blob/main/AGENTS.md), [workflows](https://github.com/Rick2818/Fabrica-de-Agentes-IA/tree/main/.github/workflows), [auditoría anterior](https://github.com/Rick2818/Fabrica-de-Agentes-IA/blob/main/docs/ops/point4-supabase-continuity-20261028-1915-sv.md).
