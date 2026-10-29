# Fábrica de Agentes IA — Punto 4: continuidad de Supabase Cron (28 oct 2026, 19:15 SV)

## Alcance
Auditoría de solo lectura del Site original `appgprj_6adbf0c05a0c8191b2ca585b76f5e862` por el estado observable del complemento Fábrica; Supabase `udispwzwrebjkanudcoy`, `AGENTS.md`, seis workflows de GitHub en `main` y recibos de ejecución. No se forzó `private.fabrica_scheduler_tick()`, no se tocó `not_before`, cuota, credenciales, tareas, Site ni disparadores. El respaldo existente sigue siendo el único encargado de procesar cola fuera del cron principal.

## Evidencia actual
- Proyecto Supabase: `ACTIVE_HEALTHY`. `cron.job` registra un único job activo: `jobid=1`, `jobname=fabrica-queue`, `schedule=* * * * *`, `command=select private.fabrica_scheduler_tick();`.
- `cron.job_run_details`: **358 ticks SQL `succeeded`** desde `2026-10-28 19:18:00+00` hasta `2026-10-29 01:15:00.028634+00` (19:15 SV), **68 más** que a las 18:08 SV. Las filas recientes tienen `return_message=1 row`; eso no prueba ejecución funcional de tareas.
- `private.fabrica_scheduler_receipts`: **1 recibo** y **0 `done` verificados**; `cycle_id=97d77278-26db-4069-ad2c-059b2fe6402e`, `request_id=1`, `http_status=200`, `verified=true`, `site_status=quota`, `error_code=null`, `checked_at=2026-10-28 19:18:10.748285+00`. Ningún recibo sin reconciliar; `cycle_id` único.
- Cruce con `net._http_response`: `status_code=200`, `timed_out=false`, `error_msg=null`, `receipt.source=supabase-cron`, `receipt.supabase.run_id=97d77278-26db-4069-ad2c-059b2fe6402e`, `run.status=quota`, `run.id=null`, `receipt.job_id=null`, `receipt.pending=1`, `receipt.next_at=1793257260000`. UUID coincide; **no hay trabajo `done` atribuible al cron**.
- `private.fabrica_scheduler_config`: `enabled=true`, `last_error=null`, `not_before=2026-10-29 07:01:00+00` = **29 oct 01:01 SV**. La ausencia de nuevas solicitudes HTTP al Site mientras se difiere es comportamiento esperado, no caída.
- Complemento Fábrica: cuota **20/20**; estado de cola **6 `queued`**, **1 `waiting`** por cuota; el último `health.supabase_runner.status=quota`, con el mismo UUID, y `health.autonomy.status=waiting`. Seis pruebas sintéticas históricas `done` tienen otras fuentes y **no** certifican el cron principal. El respaldo presenta ciclos `done` separados; no se les atribuye ejecución Supabase.
- Código SQL instalado: `private.fabrica_scheduler_tick` contiene `pg_try_advisory_xact_lock`, `FOR UPDATE`, guarda `not_before` y evita disparar mientras haya recibos sin conciliar. `private.fabrica_scheduler_reconcile` comprueba proveedor, UUID, horario, estado, `job_id` para `done`, errores y respuestas ausentes. Esto prueba implementación de defensas, **no** concurrencia, idempotencia o recuperación E2E.
- GitHub: seis workflows vigentes leídos de `.github/workflows/`: `agent-runner.yml`, diagnósticos A/B/C, `training-regression.yml`, `verify-training.yml`. **Ninguno contiene `on.schedule`**. Los workflows de entrenamiento aún pueden dispararse por `push` o `workflow_dispatch`, pero no por `schedule`. La API de historial muestra ejecuciones `schedule` antiguas (la más reciente 28 oct 19:35:09 UTC, diagnóstico C), que no representan la configuración actual.
- `AGENTS.md` leído en `main`; exige preservar el Site original y no declarar paridad/autonomía sin pruebas reales. No se logró acceder a la fuente activa del editor Sites: no se afirma identidad binaria entre repositorio y Site.
- Logs unificados Supabase, ventana 28 oct 19:00–29 oct 01:20 UTC: `postgres_logs=857`, `pgbouncer_logs=18`. La consulta de severidades `error/fatal/panic` no devolvió filas, pero el campo puede no estar poblado y **no** demuestra ausencia de errores semánticos.

## Reproducción de lectura
```sql
select jobid,jobname,schedule,active,command from cron.job order by jobid;
select runid,status,start_time,end_time,return_message from cron.job_run_details order by start_time desc limit 12;
select cycle_id,scheduled_at,request_id,checked_at,http_status,verified,site_status,error_code from private.fabrica_scheduler_receipts order by scheduled_at desc;
select singleton,enabled,not_before,last_error from private.fabrica_scheduler_config;
-- Para conciliar: unir private.fabrica_scheduler_receipts.request_id con net._http_response.id
-- y comparar receipt.supabase.run_id con cycle_id, run.status con site_status y job_id.
```
Referencias: [AGENTS.md](https://github.com/Rick2818/Fabrica-de-Agentes-IA/blob/main/AGENTS.md), [workflows](https://github.com/Rick2818/Fabrica-de-Agentes-IA/tree/main/.github/workflows), [historial de Actions](https://github.com/Rick2818/Fabrica-de-Agentes-IA/actions).

## Decisión y próximo control
**PUNTO 4 NO CERTIFICADO.** Hay continuidad comprobada de invocación SQL y un recibo Supabase legítimo `quota`, pero **cero entregas `done` del cron principal**. Falta demostrar con ciclo natural posterior a `not_before` una entrega `done` con `cycle_id`, `job_id`, `run.status`, recibo del Site y estado de tarea coincidentes, sin duplicaciones. Después verificar recuperación, pausa, reintentos e idempotencia E2E y fuente vigente del editor. Respetar cuota y diferimiento; no modificar infraestructura ni crear disparadores en este estado.
