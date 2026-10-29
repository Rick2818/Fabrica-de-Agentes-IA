# Fábrica de Agentes IA — Punto 4: control de continuidad (28 oct 2026, ~22:12 SV)

## Alcance y seguridad
- Site original: `appgprj_6adbf0c05a0c8191b2ca585b76f5e862`; repositorio `Rick2818/Fabrica-de-Agentes-IA`, rama `main`.
- Programador principal: `supabase:udispwzwrebjkanudcoy:fabrica-queue`; respaldo horario existente: `6adbf94d28e8819189c0516c6068457a` (ejecutor distinto).
- Solo lectura de Supabase SQL, logs, GitHub y estado MCP de la Fábrica. No se invocó `fabrica_scheduler_tick()` ni `run_pending_tasks`; no se modificaron Site, cuotas, fechas, secretos, tareas, locks ni cron. Sin comunicaciones ni gastos.
- `AGENTS.md` consultado en main, SHA de blob `9cc3c0f8d3ae365f0802145b2d279839d7a8e4e2`: exige preservar el Site y distinguir disparos manuales de programación.

## Evidencia primaria: 29 oct 2026 ~04:12 UTC (28 oct ~22:12 SV)
1. `cron.job`: exactamente una fila, `jobid=1`, `jobname=fabrica-queue`, `active=true`, `schedule=* * * * *`, `command=select private.fabrica_scheduler_tick();`.
2. `cron.job_run_details` para jobid=1: **535** ejecuciones, **535 succeeded**, **0** en otros estados; última `2026-10-29 04:12:00.064484+00` (runid 535). Son éxitos **SQL**, no procesamiento `done`; **+59** ejecuciones respecto de la revisión ~21:14 SV (476).
3. `private.fabrica_scheduler_config`: `enabled=true`, `not_before=2026-10-29 07:01:00+00` (29 oct 01:01 SV), `last_error=null`. El plazo sigue en el futuro: no se forzó el tick.
4. `private.fabrica_scheduler_receipts`: una fila, `cycle_id=97d77278-26db-4069-ad2c-059b2fe6402e`, `scheduled_at=2026-10-28 19:18:00.18+00`, `request_id=1`, `checked_at=2026-10-28 19:18:10.748285+00`, `http_status=200`, `verified=true`, `site_status=quota`, `error_code=null`. **0 recibos done** atribuibles al principal.
5. Cruce con `net._http_response`: HTTP 200, `timed_out=false`, `error_msg=null`. JSON: `run.status=quota`, `receipt.source=supabase-cron`, `receipt.job_id=null`, `receipt.supabase.run_id=97d77278-26db-4069-ad2c-059b2fe6402e`, `schedule_id=supabase:udispwzwrebjkanudcoy:fabrica-queue`, `scheduled_at=1793215080180`, `next_at=1793257260000`. Coincidencia de UUID y cron verificada; sin tarea completada.
6. Estado vivo del complemento Fábrica: cuota **20/20**; **6 queued**, **1 waiting** por cuota; seis queued con `attempts=0`, los siete sin lease activo (`lease_until=0`). `health.supabase_runner.status=quota`; `health.autonomy.status=waiting`; `deferred_until=1793257260000`. Las seis pruebas sintéticas históricas `done` de Leo, Mila, Vera, Alma, Nico y Lía corresponden a MCP/respaldo, no al cron principal. No se crearon pruebas nuevas durante cuota agotada.
7. Funciones instaladas `private.fabrica_scheduler_tick` y `private.fabrica_scheduler_reconcile` inspeccionadas: `pg_try_advisory_xact_lock(1432658222,51)`, `FOR UPDATE`, guarda `not_before`, espera de recibo pendiente, verificación de `cycle_id`, `schedule_id`, `run_id`, estado y `job_id`, diferimiento de errores. `pg_locks` no tenía locks advisory al consultar. Es revisión estática y puntual; **no** prueba concurrencia, recuperación o idempotencia E2E.
8. Los seis YAML de `.github/workflows` se leyeron en main: **ninguno** contiene `on.schedule`. Cuatro tienen solo `workflow_dispatch`; dos suites tienen `push` y `workflow_dispatch`. Un verde de push/manual no acredita schedule.
9. Logs unificados consultados en ventana `2026-10-28T18:00:00Z` a `2026-10-29T04:13:00Z`: `postgres_logs=1286`, `pgbouncer_logs=30`. Son conteos por origen, no prueba de ausencia de fallos semánticos.
10. Se consultó el estado operativo del Site por el complemento, **no** la fuente viva del editor de Sites. Acceso directo al editor y comparación de artefacto activo siguen pendientes; la URL pública tampoco pudo abrirse mediante lectura web. No se reemplazó código ni se reutilizó copia antigua.

## Consultas reproducibles (lectura solamente)
```sql
select jobid,jobname,schedule,active,command from cron.job;
select count(*) total,count(*) filter(where status='succeeded') succeeded,
       count(*) filter(where status<>'succeeded') non_succeeded,max(start_time) latest
from cron.job_run_details where jobid=1;
select enabled,not_before,last_error from private.fabrica_scheduler_config;
select cycle_id,scheduled_at,request_id,checked_at,http_status,verified,site_status,error_code
from private.fabrica_scheduler_receipts order by scheduled_at desc;
select s.cycle_id,s.site_status,h.status_code,h.timed_out,h.error_msg,h.content
from private.fabrica_scheduler_receipts s left join net._http_response h on h.id=s.request_id;
select locktype,mode,granted,objid,classid from pg_locks where locktype='advisory';
```

## Dictamen
**Punto 4 NO certificado.** Continuidad SQL y exclusividad de cron verificadas, con respeto al diferimiento y correlación del único recibo `quota`. Falta una entrega `done` auténtica iniciada por Supabase Cron después del reset natural, con UUID, recibo, `job_id` y tarea final concordantes y sin duplicación. Falta certificar concurrencia, locks, reintentos, pausas, recuperación, idempotencia y las seis especialidades de punta a punta en el Site vigente. No es seguro modificar cuotas ni forzar ejecuciones ahora.

Referencias: [AGENTS.md](https://github.com/Rick2818/Fabrica-de-Agentes-IA/blob/main/AGENTS.md), [workflows](https://github.com/Rick2818/Fabrica-de-Agentes-IA/tree/main/.github/workflows), [auditoría anterior](https://github.com/Rick2818/Fabrica-de-Agentes-IA/blob/main/docs/ops/point4-supabase-continuity-20261028-2114-sv.md).
