# Fábrica de Agentes IA — Punto 4 — auditoría de continuidad, 2026-10-29 ~05:07 SV

## Alcance, fuentes y límites

Revisión de solo lectura realizada el 29 de octubre de 2026, aproximadamente entre 11:05 y 11:07 UTC (05:05–05:07 America/El_Salvador), sobre el proyecto Supabase `udispwzwrebjkanudcoy`, complemento Fábrica `agent_status`, GitHub `Rick2818/Fabrica-de-Agentes-IA` y estado del respaldo horario de ChatGPT. Site asociado: `appgprj_6adbf0c05a0c8191b2ca585b76f5e862`. **No hubo acceso de lectura a la fuente vigente del editor Sites**; el complemento solo acredita estado y recibos. No se llamó `run_pending_tasks`, no se invocó `fabrica_scheduler_tick()` manualmente, no se alteraron trabajos, cuotas, fechas, credenciales, código del Site ni disparadores.

## Cron principal y recibos

- `cron.job`: un solo job, `jobid=1`, `fabrica-queue`, activo, cada minuto (`* * * * *`), comando `select private.fabrica_scheduler_tick();`.
- `cron.job_run_details`: **948** ejecuciones `succeeded`, sin otros estados en la consulta, última iniciada **2026-10-29 11:05:00 UTC**. **+49** frente al corte previo de 899. Son ejecuciones SQL, **no** 948 entregas funcionales.
- `private.fabrica_scheduler_receipts`: **234** recibos y 234 UUID/requests únicos en el corte de las 11:05 UTC, **+49** frente a 185. En la lectura inmediatamente posterior ya había **235** recibos, incluido el del minuto 11:06 aún sin conciliar (menos de dos minutos, no se declara fallo). **0 recibos sin conciliar con más de dos minutos** en el primer corte.
- Distribución posterior: 218 `idle`, 9 `done`, 4 `waiting`, 2 `error`, 1 `quota` y 1 todavía sin verificar. Los dos `error` son **estados funcionales** de la respuesta del Site, con HTTP 200 y `verified=true`; `error_code=null` en estos casos es coherente con transporte y formato validados, no una entrega.
- Consulta read-only `JOIN net._http_response`: **9/9 `done`** tienen `verified=true`, HTTP 200, `receipt.source=supabase-cron`, `receipt.supabase.schedule_id=supabase:udispwzwrebjkanudcoy:fabrica-queue`, `receipt.supabase.run_id=cycle_id`, `run.id=receipt.job_id` y `run.status=done`. Son **9 IDs de trabajo distintos**, tres técnicos y seis prácticas. Ningún nuevo `done` desde la auditoría de 04:16 SV. No atribuir los 218 `idle` a trabajos completados.
- Se cotejaron los seis trabajos de práctica con `agent_status`: Leo (Ventas), Mila (Servicio al cliente), Vera (Finanzas), Alma (Química y Farmacia), Nico (Logística) y Lía (Mercadeo) figuran `done`, con `execution_source=supabase-cron`. Reintentos observados en datos históricos: Alma 2 intentos, Nico 5. No se ejecutó una nueva prueba de fallo artificial.

## Cola, cuotas, controles y recuperación

- `agent_status`: 64 trabajos históricos (59 `done`, 2 `failed`, 3 `cancelled`), **0 pendientes**. Cuota **15/20**. Último ciclo del Site `idle`, `pending=0`, `source=supabase-cron` y UUID de ciclo registrado. No se creó trabajo sintético para consumir cuota.
- `private.fabrica_scheduler_config`: `enabled=true`, `not_before=null`, `last_error=null`; no hay diferimiento activo en este corte. No se cambió `not_before`.
- Definiciones SQL inspeccionadas: `fabrica_scheduler_tick` usa `pg_try_advisory_xact_lock(1432658222,51)`, `FOR UPDATE` de configuración, respeta `enabled`, `not_before` y recibo anterior pendiente; genera UUID y envía con `pg_net`. `fabrica_scheduler_reconcile` verifica origen, proyecto, schedule, UUID, marca temporal, estado y job ID, maneja errores de red, HTTP y respuesta faltante, y actualiza `not_before` para recuperación. Restricciones: `PRIMARY KEY(cycle_id)` y `UNIQUE(request_id)`.
- `pg_locks`: sin advisory locks observados al consultar. Esto **no** prueba exclusión mutua bajo concurrencia real. Tampoco se probó pausa/reanudación ni caída de transporte de forma inducida, para no perturbar producción.
- Logs unificados de Supabase, 08:00–11:05 UTC: 444 registros `postgres_logs` y 9 `pgbouncer_logs`. Un filtro textual simple de `event_message` por «error» no devolvió registros; **no** equivale a certificar ausencia de fallos ni a una entrega `done`.

## GitHub y respaldo

- `AGENTS.md` leído desde `main`, confirma seis nombres/especialidades y obligación de preservar Site.
- Inspeccionados los seis workflows de `main`: `agent-runner.yml`, `diagnostic-a-scheduler.yml`, `diagnostic-b-conditions.yml`, `diagnostic-c-actor.yml`, `training-regression.yml`, `verify-training.yml`. **Ninguno tiene `schedule:`**. El runner solo tiene `workflow_dispatch`; las suites pueden ejecutarse por `push` y/o manualmente. Historial de `event=schedule` no prueba disparador vigente.
- Automatización «Respaldo de pendientes Fábrica IA» (`6adbf94d28e8819189c0516c6068457a`) verificada habilitada, último registro de ejecución `completed` a las 09:53:42 UTC. Esta auditoría no activó el respaldo ni creó un ejecutor competidor.
- Nota de calidad histórica: un objetivo generado intercambia las especialidades de Alma y Lía; `AGENTS.md` es la autoridad. No se reescribió el resultado ni se modificaron datos.

## Dictamen

**Autonomía programada de las seis prácticas: demostrada anteriormente y revalidada hoy mediante 9 recibos `done` E2E correlacionados. Continuidad del cron: confirmada hasta el corte, sin nuevas entregas porque la cola está vacía. Certificación integral del punto 4: PENDIENTE.** Persisten dos límites: (1) falta inspección directa de la fuente vigente del editor Sites; (2) faltan pruebas controladas y no invasivas de concurrencia, pausa/reanudación y recuperación de transporte/recibo ausente. La presencia de mecanismos SQL no reemplaza esas pruebas. No hay bloqueo nuevo ni cambio seguro que justifique un parche productivo en este corte.

Fuentes: consultas SQL directas a `cron.job`, `cron.job_run_details`, `private.fabrica_scheduler_config`, `private.fabrica_scheduler_receipts`, `net._http_response`, `pg_proc`, `pg_constraint` y `pg_locks`; consulta de logs Supabase; complemento Fábrica `agent_status`; [AGENTS.md](../../AGENTS.md); [workflows](../../.github/workflows); [auditoría previa 04:16 SV](point4-supabase-continuity-20261029-0416-sv.md).
