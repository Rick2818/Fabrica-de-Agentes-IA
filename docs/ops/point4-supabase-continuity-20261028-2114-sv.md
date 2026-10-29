# Fábrica de Agentes IA — Punto 4: control de continuidad (28 oct 2026, ~21:14 SV)

## Alcance y precauciones
- Proyecto original Site: `appgprj_6adbf0c05a0c8191b2ca585b76f5e862`. Repositorio `Rick2818/Fabrica-de-Agentes-IA`, rama `main`.
- Ejecutor principal: `supabase:udispwzwrebjkanudcoy:fabrica-queue`; el respaldo horario existente es otro origen de ciclos y no se cuenta como éxito del principal.
- Esta pasada fue de **solo lectura** sobre Supabase, GitHub y estado observable del complemento Fábrica. No se llamó a `fabrica_scheduler_tick()`, no se alteró `not_before`, cuotas, colas, trabajos, credenciales, Site ni disparadores. No se enviaron comunicaciones.
- `AGENTS.md` fue leído directamente y exige preservar el Site vigente, evitar reconstrucciones desde código anterior y no declarar autonomía sin evidencia de programación real.

## Evidencia primaria al 29 oct 2026 03:13 UTC (~28 oct 21:13 SV)
1. Supabase proyecto `udispwzwrebjkanudcoy`: `ACTIVE_HEALTHY`. En `cron.job`, `jobid=1`, `jobname=fabrica-queue`, `active=true`, `schedule=* * * * *`, `command=select private.fabrica_scheduler_tick();`.
2. `cron.job_run_details`, `jobid=1`: **476** ejecuciones, **476** `succeeded`, **0** en otros estados; intervalo 2026-10-28 19:18 UTC a 2026-10-29 03:13 UTC. `succeeded` significa que la invocación SQL terminó, **no** que terminó una tarea.
3. `private.fabrica_scheduler_config`: `enabled=true`, `last_error=null`, `not_before=2026-10-29 07:01:00+00` (**29 oct 01:01 SV**), todavía futuro en esta revisión.
4. `private.fabrica_scheduler_receipts`: **un solo recibo**; `cycle_id=97d77278-26db-4069-ad2c-059b2fe6402e`, `request_id=1`, `http_status=200`, `verified=true`, `site_status=quota`, `error_code=null`. **0** recibos `done` atribuibles al principal.
5. Cruce `request_id=net._http_response.id`: `status_code=200`, `timed_out=false`, `error_msg=null`. El cuerpo registra `receipt.source=supabase-cron`, `receipt.supabase.run_id=97d77278-26db-4069-ad2c-059b2fe6402e`, `schedule_id=supabase:udispwzwrebjkanudcoy:fabrica-queue`, `run.status=quota`, `receipt.job_id=null`, `next_at=1793257260000`. Correlación HTTP/ciclo verificada; no hubo `job_id` ni procesamiento `done`.
6. Complemento Fábrica, lectura de estado: cuota **20/20**; **6 tareas `queued`**, **1 `waiting`** con espera por cuota; `health.autonomy.status=waiting`, `health.supabase_runner.status=quota`, `deferred_until=1793257260000`. Los siete pendientes tienen `lease_until=0`; las seis tareas en cola tienen `attempts=0`. Existen pruebas sintéticas históricas `done` de los seis agentes, pero sus ciclos son de otros orígenes (MCP/respaldo), no del cron principal.
7. `pg_locks` no mostró bloqueos advisory activos **en el instante de la consulta**. La inspección estática de funciones instaladas detectó `pg_try_advisory_xact_lock` y `FOR UPDATE` en `fabrica_scheduler_tick`, y verificaciones de `not_before`, `cycle_id`, `schedule_id`, `job_id` en `fabrica_scheduler_reconcile`. No equivale a prueba de exclusión mutua o recuperación E2E.
8. Se leyeron individualmente los seis archivos de `.github/workflows/` en `main`: ninguno tiene `on.schedule`. `agent-runner.yml` y diagnósticos son `workflow_dispatch`; dos suites de pruebas también tienen `push`. Los verdes de `push`/manual no se cuentan como `schedule`.
9. Logs unificados en ventana 2026-10-28 19:00 a 2026-10-29 03:15 UTC: fuentes `postgres_logs` 1142 y `pgbouncer_logs` 24; estos conteos por fuente no certifican ausencia de errores semánticos.
10. El estado del complemento contiene una nota histórica sobre pruebas sintéticas en fuente Site v53, pero **esta pasada no obtuvo acceso directo al editor/fuente viva del Site**, ni pudo comparar su artefacto activo con el repositorio. Esa nota no se reetiqueta como prueba E2E de esta ejecución.

## Consultas reproducibles, exclusivamente lectura
```sql
select jobid,jobname,schedule,active,command from cron.job;
select count(*) total, count(*) filter(where status='succeeded') succeeded,
       count(*) filter(where status<>'succeeded') other,
       min(start_time) first_at, max(start_time) last_at
from cron.job_run_details where jobid=1;
select enabled,not_before,last_error from private.fabrica_scheduler_config;
select cycle_id,scheduled_at,request_id,checked_at,http_status,verified,site_status,error_code
from private.fabrica_scheduler_receipts order by scheduled_at desc;
select s.cycle_id,s.site_status,h.status_code,h.timed_out,h.error_msg,h.content
from private.fabrica_scheduler_receipts s
left join net._http_response h on h.id=s.request_id;
```

## Dictamen y siguiente prueba
**Punto 4 NO certificado.** Se comprobó continuidad del cron SQL, correlación del único HTTP y respeto del diferimiento. Falta un ciclo **real de Supabase Cron** después del restablecimiento natural de cuota que deje `done` con `cycle_id`, `job_id`, recibo de Site y estado de tarea concordantes, sin duplicación. También siguen pendientes pruebas E2E de concurrencia, reintento, pausa, recuperación e idempotencia, y verificación directa de la fuente activa de Sites. No forzar ticks ni alterar fechas/cuota para simular éxito.

Referencias: [AGENTS.md](https://github.com/Rick2818/Fabrica-de-Agentes-IA/blob/main/AGENTS.md), [workflows](https://github.com/Rick2818/Fabrica-de-Agentes-IA/tree/main/.github/workflows), [control anterior](https://github.com/Rick2818/Fabrica-de-Agentes-IA/blob/main/docs/ops/point4-supabase-continuity-20261028-2009-sv.md).
