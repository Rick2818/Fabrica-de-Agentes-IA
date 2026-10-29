# Fábrica de Agentes IA — Punto 4 — auditoría de continuidad 2026-10-29 03:05 SV

## Alcance y corte
Auditoría de solo lectura al 2026-10-29 09:05–09:06 UTC (03:05–03:06 America/El_Salvador) del proyecto Supabase `udispwzwrebjkanudcoy`, Site `appgprj_6adbf0c05a0c8191b2ca585b76f5e862` mediante complemento `agent_status`, `AGENTS.md`, seis workflows de GitHub y logs. **No** se invocó `fabrica_scheduler_tick()`, `run_pending_tasks`, ni se crearon trabajos, cambios de cuota, fechas, disparadores, Site o credenciales. El editor fuente vigente de Sites sigue sin lectura directa: el complemento acredita estado funcional, no equivalencia de fuentes.

## Cron y continuidad observada
- `cron.job`: **un solo job activo**, `jobid=1`, `fabrica-queue`, `* * * * *`, comando `select private.fabrica_scheduler_tick();`.
- `cron.job_run_details`: **828** ejecuciones `succeeded` desde 2026-10-28 19:18 UTC; última a 09:05 UTC; **+56** frente a 772 de la auditoría anterior. No se equipara `succeeded` a procesamiento `done`.
- `private.fabrica_scheduler_receipts`: **115** ciclos, **115** UUID distintos y **115** `request_id` distintos, +57 recibos desde la revisión anterior. Distribución: **9** `verified=true,site_status=done`, **2** `error`, **4** `waiting`, **1** `quota`, **98** `idle`, **1** sin conciliar al corte (09:06 UTC). Los `error` siguen con `error_code=null`, brecha de trazabilidad histórica ya identificada. El recibo pendiente corresponde al minuto actual, no prueba fallo de conciliación.
- Verificación SQL contra `net._http_response` de los nueve `done`: **9/9** con `receipt.source=supabase-cron`, `receipt.supabase.schedule_id=supabase:udispwzwrebjkanudcoy:fabrica-queue`, `receipt.supabase.run_id=cycle_id`, `receipt.job_id=run.id`, `run.status=done`, HTTP 200 y `verified=true`. **Cero trabajos con dos `done` verificados**. Dos recibos recientes `idle` también mostraron UUID coincidente, HTTP 200, pero no cuentan como entregas.
- **No hay nuevas entregas `done`** desde el corte 02:10 SV; las nueve son las mismas (seis especialidades + tres trabajos técnicos).
- Configuración: `enabled=true`, `not_before=null`, `last_error=null`. No se alteraron cuota ni ventanas de reintento.
- `pg_locks`: ningún advisory lock observado en la lectura puntual; **no certifica** ausencia de carreras.
- Funciones instaladas: `fabrica_scheduler_tick` MD5 `7fb25848caa91dc78eb0f469659f691d`, `fabrica_scheduler_reconcile` MD5 `78a1057460b103ae1cddfb5d5e0339f0`. Se observan guardias `enabled`, `not_before`, `FOR UPDATE`, `pg_try_advisory_xact_lock`, y manejo `response_missing`/reintento en el código. Constraints: PK `cycle_id`, UNIQUE `request_id`. Son protecciones estáticas; falta prueba de concurrencia, pausa/reanudación y fallo de transporte.
- Logs unificados 08:10–09:05 UTC: **132** `postgres_logs`, **3** `pgbouncer_logs`. Los conteos no son prueba de ejecución funcional.

## Estado del Site y seis especialidades
`agent_status`: **64** trabajos históricos, **59 done**, **2 failed**, **3 cancelled**, **0 pendientes**. Cuota **15/20**. `health.supabase_runner` registró ciclo `d8be1ea4-7f48-4dc3-a121-f53f15a3a6fa` de 09:06 UTC, estado `idle`, `pending=0`, `source=supabase-cron`. Ese UUID coincide con el recibo SQL pendiente de conciliación al corte, por lo que **no se marca como `done` ni como fallo**.

Persisten seis prácticas `done` del principal (ver matriz con IDs y UUID en la [auditoría 02:10 SV](point4-supabase-continuity-20261029-0210-sv.md)): Leo/Ventas, Mila/Servicio al cliente, Vera/Finanzas, Alma/Química y Farmacia, Nico/Logística y Lía/Mercadeo. Las seis tareas históricas `synthetic-six-20261028-*` también figuran `done`, pero tienen `execution_source=mcp` o `scheduled-mcp`, **no** `supabase-cron`; no se confunden orígenes. Recuperaciones verificadas anteriormente: trabajo técnico, Alma y Nico mediante reintentos, sin `done` duplicados.

`AGENTS.md` en `main` conserva la asignación canónica **Alma = Química y Farmacia; Lía = Mercadeo**. El informe generado por un objetivo anterior las confunde; su estado `passed` no certifica corrección semántica ni paridad con Dots.

## GitHub y separación de ejecutores
Leídos los seis workflows actuales en `main`: `agent-runner.yml`, `diagnostic-a-scheduler.yml`, `diagnostic-b-conditions.yml`, `diagnostic-c-actor.yml`, `training-regression.yml`, `verify-training.yml`. **Ninguno contiene evento `schedule`**. `agent-runner.yml` solo `workflow_dispatch`; las suites de regresión admiten `push` y `workflow_dispatch`. Un `cloud_runner` histórico en el complemento contiene `event=schedule`, pero es evidencia histórica y **no** habilitación actual de GitHub. El respaldo horario de ChatGPT sigue habilitado, separado del cron principal; no se invocó para evitar competir.

## Decisión
**Autonomía de ejecución de las seis especialidades: demostrada previamente con nueve recibos `done` E2E; continuidad de cron y conciliación: observada de nuevo; certificación integral del punto 4: PENDIENTE.** Sin nuevas entregas ni bloqueo que requiera corrección segura inmediata. Para certificación integral faltan lectura directa de la fuente vigente del editor Sites y pruebas controladas de exclusión bajo carrera, pausa/reanudación, caída de transporte, recibo ausente y recuperación en producción, sin interferir con la cola ni crear otro ejecutor. No sustituir el Site por una copia antigua; no forzar cuota, fechas o ticks.

Fuentes: lecturas directas Supabase SQL/logs y complemento Fábrica IA en esta auditoría; [AGENTS.md](../../AGENTS.md); [workflows](../../.github/workflows); [auditoría 02:10 SV](point4-supabase-continuity-20261029-0210-sv.md).
