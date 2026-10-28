# Fábrica IA — Punto 4: control de continuidad (28 oct 2026, 17:09 SV)

## Alcance
Auditoría de solo lectura del ejecutor principal Supabase `udispwzwrebjkanudcoy`, recibos SQL/HTTP, estado del complemento Fábrica, `AGENTS.md` y los seis workflows vigentes en `main`. No se ejecutó manualmente `private.fabrica_scheduler_tick()`, no se alteró `not_before`, cuota, credenciales, Site, trabajos ni programadores.

## Evidencia nueva y contraste con 16:09 SV
- Proyecto Supabase: `ACTIVE_HEALTHY`. `cron.job` contiene un solo job: `jobid=1`, `fabrica-queue`, `* * * * *`, `active=true`, `select private.fabrica_scheduler_tick();`.
- `cron.job_run_details`: **232 ejecuciones** del job 1, **0 failed**; última observada después de las 17:08 SV (la lectura anterior registró 231 a las 23:08 UTC). Frente a 171 a las 16:09 SV: **61 ticks SQL adicionales**. `succeeded` / `1 row` prueba invocación SQL, NO entrega IA.
- `private.fabrica_scheduler_receipts`: **1 recibo total**, `verified=true`, `http_status=200`, `site_status=quota`, `error_code=null`, **0 `done` verificados**. `cycle_id=97d77278-26db-4069-ad2c-059b2fe6402e`; `request_id=1`; `scheduled_at=2026-10-28 19:18:00.180Z`.
- Cruce con `net._http_response` del `request_id=1`: `status_code=200`, `timed_out=false`, `error_msg=null`, `run.status=quota`, `receipt.status=quota`, `receipt.job_id=null`. `receipt.supabase.run_id`, `project_id` y `schedule_id` coinciden con el recibo SQL. `run.next_at=1793257260000`. HTTP200 auténtico NO significa `done`.
- `private.fabrica_scheduler_config`: `enabled=true`, `last_error=null`, `not_before=2026-10-29 07:01:00Z` = **29 oct 01:01 SV**. No vencido a esta revisión.
- Estado directo del complemento Fábrica: cuota **20/20**, seis trabajos nuevos `queued` sin intentos y un paso del objetivo E2E `waiting` por cuota. Las seis pruebas históricas `synthetic-six-20261028-{leo,mila,vera,alma,nico,lia}` figuran `done`, pero no se atribuyen al cron principal. `health.autonomy.status=waiting`, `health.supabase_runner.status=quota`, `job_id=null`.
- Revisión no invasiva de funciones SQL: `private.fabrica_scheduler_tick` conserva patrón `pg_try_advisory_xact_lock`, `FOR UPDATE`, guardia `not_before` y correlación `cycle_id/request_id`; `private.fabrica_scheduler_reconcile` contiene verificaciones de recibos, `not_before`, `cycle_id/request_id`. Es **evidencia estática**, no prueba de carrera, idempotencia o recuperación real.
- Los seis workflows leídos de `.github/workflows`: `agent-runner.yml` y diagnósticos A/B/C son `workflow_dispatch` únicamente; `training-regression.yml` y `verify-training.yml` tienen `push`/`workflow_dispatch`; **ninguno tiene `on.schedule`**.
- Logs unificados Supabase consultados para 22:00–23:10 UTC: 172 eventos `postgres_logs` y 3 `pgbouncer_logs`. El conteo de eventos no certifica trabajos `done` ni demuestra ausencia de errores semánticos.
- `AGENTS.md` confirma el requisito de pruebas reales y de conservar el Site original. El complemento muestra metadatos de Site y recibos de ejecución, pero **no se obtuvo lectura directa de la fuente vigente del editor de Sites ni prueba interactiva E2E**.

## Decisión
**Punto 4 NO CERTIFICADO.** La continuidad del disparador SQL está acreditada; no hay aún una entrega `done` desde el programador Supabase. El incremento de ticks sin nuevas solicitudes es coherente con `not_before` y cuota agotada. No corregir artificialmente una espera legítima.

## Próxima prueba permitida
Después de las **01:01 SV del 29 de octubre**, observar naturalmente el próximo tick y exigir `done` con mismo UUID en `cron.job_run_details`, `private.fabrica_scheduler_receipts`, JSON HTTP y recibo del Site, `job_id` coincidente, estado de trabajo `done`, sin duplicados. Verificar también exclusión mutua, reintentos, pausa, recuperación y E2E del Site original antes de certificar autonomía. Si reaparece `quota` o `deferred`, respetar nuevo `not_before`.

No hubo cambios al ejecutor, gasto ni acciones externas.
