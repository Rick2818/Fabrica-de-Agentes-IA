# Fábrica de Agentes IA — Punto 4 — auditoría 2026-10-29 11:12 SV

## Alcance y metodología
- Exclusivamente Site `appgprj_6adbf0c05a0c8191b2ca585b76f5e862`, repositorio `Rick2818/Fabrica-de-Agentes-IA` y Supabase `udispwzwrebjkanudcoy`.
- Corte principal 2026-10-29 17:12 UTC (11:12 SV); consultas de solo lectura a Supabase, complemento Site, GitHub y tentativa de lectura Browser.
- **Sin escrituras productivas**: no se ejecutó `fabrica_scheduler_tick`, `run_pending_tasks`, ni se alteraron fechas, cuota, trabajos, locks, disparadores, Site o secretos. No se crearon pruebas sintéticas nuevas, para no competir con el ejecutor ni fabricar entregas.
- `AGENTS.md` en main (blob `9cc3c0f8d3ae365f0802145b2d279839d7a8e4e2`) exige preservar Site, separar identidades y no certificar sin pruebas.

## Programación y recibos
- Proyecto Supabase: `ACTIVE_HEALTHY`.
- `cron.job`: **único** job `jobid=1`, `jobname=fabrica-queue`, `schedule=* * * * *`, `active=true`, comando `select private.fabrica_scheduler_tick();`.
- `cron.job_run_details`: **1,315** ejecuciones SQL `succeeded`, **0** con otro estado; primera 2026-10-28 19:18 UTC, última 2026-10-29 17:12 UTC. +61 frente a la auditoría 10:11 SV. Esto acredita ejecución SQL programada, **no** por sí solo entrega `done`.
- `private.fabrica_scheduler_receipts`: **601** filas y UUID únicos, **600** verificadas, **1** ciclo reciente sin conciliar al corte; +61 filas frente al control anterior. Distribución al corte inmediatamente previo (600 filas): **583 idle**, **9 done**, **4 waiting**, **2 error**, **1 quota**, **1 sin conciliar**. La fila 17:11 se concilió a 17:12 como `idle` y se añadió el ciclo 17:12 sin conciliar: **584 idle, 9 done, 4 waiting, 2 error, 1 quota, 1 sin conciliar**. `error_code` no nulo: 0.
- Los **9 done** persisten con `verified=true`, `http_status=200`, `error_code=null`, 9 `cycle_id` y `request_id` distintos; son las mismas entregas históricas, no entregas nuevas.
- Recibo reciente de ciclo `e3f744b0-f8cc-49f7-b7ca-491e3f1490c8` (17:11 UTC) coincide con `net._http_response` HTTP 200, `receipt.source=supabase-cron`, `project_id=udispwzwrebjkanudcoy`, `schedule_id=supabase:udispwzwrebjkanudcoy:fabrica-queue`, `run_id=cycle_id`, `receipt.status=run.status=idle`; `verified=true` en SQL. Ciclo 17:12 `d2a67eec-a618-4f77-b7ff-58baedeccd38`: cuerpo HTTP 200 con correlación y estado `idle`, pero **sin conciliar** en SQL al corte, no se declara verificado ni done.
- Las respuestas HTTP originales de los nueve done ya expiraron en `net._http_response`; subsisten recibos persistidos y evidencias Site. No se afirma relectura de los cuerpos históricos.

## Site y especialidades
- Lectura directa del complemento `agent_status` a las 17:12:43 UTC: **64 trabajos**, **59 done**, **2 failed** históricos, **3 cancelled**, **0 pendientes** y **0 leases activos** en la instantánea. Cuota **15/20**.
- **9 trabajos done con `evidence.execution_source=supabase-cron`**: Leo (Ventas), Mila (Servicio al cliente), Vera (Finanzas), Alma (Química y farmacia), Nico (Logística), Lía (Mercadeo) y 3 técnicos. Nico completó con `attempts=5`, Alma con `attempts=2`; evidencia histórica de reintentos, no prueba inyectada en esta auditoría.
- Las seis pruebas `synthetic-six-20261028-*` están done, pero fuentes `mcp` o `scheduled-mcp`; **no se atribuyen al cron principal**. Son prácticas ficticias, no acciones externas.
- El objeto `health.cloud_runner` del Site conserva un error histórico de GitHub Actions; no contradice el `health.last_run.source=supabase-cron` actual ni se presenta como fallo del cron principal.
- El Site conserva un resultado de auditoría textual que confunde Alma y Lía; las identidades canónicas están en `AGENTS.md` y una nota correctiva de Site. No se reescribieron resultados históricos.

## Locks, reintentos, idempotencia, pausas y recuperación
- Se leyó `pg_get_functiondef` de `private.fabrica_scheduler_tick` y `private.fabrica_scheduler_reconcile`: `pg_try_advisory_xact_lock(1432658222,51)`, `FOR UPDATE` en configuración, guarda `enabled`/`not_before`/recibo pendiente, verificación de origen, proyecto, schedule, UUID, tiempos, estado y job_id, y diferimiento de 5 minutos ante error o respuesta inválida/faltante.
- `private.fabrica_scheduler_config`: `enabled=true`, `not_before=null`, `last_error=null`. Ningún cambio de cuota o de `not_before`.
- Índices únicos en `cycle_id` y `request_id`; **0 duplicados** observados. Instantánea `pg_locks` sin advisory locks activos. Esto **no prueba** exclusión mutua ante concurrencia real.
- Logs unificados 16:00–17:11 UTC: 170 `postgres_logs`, 3 `pgbouncer_logs`, 2 `function_edge_logs` y 2 `function_logs`. No se infiere ausencia de errores solo de conteos o búsquedas textuales.
- No se realizaron nuevas pruebas de concurrencia, pausa/reanudación o fallos de transporte: deben hacerse en entorno aislado o ventana segura, sin afectar trabajos ajenos.

## GitHub y límite de inspección
- Leídos individualmente los seis workflows vigentes en `.github/workflows/`: `agent-runner.yml`, `diagnostic-a-scheduler.yml`, `diagnostic-b-conditions.yml`, `diagnostic-c-actor.yml`, `training-regression.yml`, `verify-training.yml`. **Ninguno declara `schedule`**. El runner es manual `workflow_dispatch`; dos suites también tienen `push`.
- Respaldo horario de Fábrica IA conservado; no se llamó ni se creó segundo ejecutor.
- Intento de inspeccionar la fuente exacta del editor Sites por Browser: `Browser access requires the originating browser context`. **Fuente Site no inspeccionada**; no se presume igualdad con GitHub ni se sustituyó código.

## Dictamen
**Autonomía histórica de procesamiento para las seis especialidades respaldada; punto 4 NO certificado integralmente.** La cola está vacía y no hay un bloqueo productivo nuevo que justifique una corrección. Faltan inspección de la fuente Site vigente y pruebas controladas no disruptivas de concurrencia, pausa/reanudación y recuperación de transporte. No confundir SQL succeeded, HTTP 200, pruebas sintéticas por MCP ni ciclos idle con `done`.

Control anterior: [10:11 SV](point4-supabase-continuity-20261029-1011-sv.md).
