# Fábrica de Agentes IA — Punto 4 — auditoría de continuidad 2026-10-29 04:16 SV

## Alcance y método
Lecturas directas realizadas entre 2026-10-29 10:15 y 10:17 UTC (04:15–04:17 America/El_Salvador), exclusivamente en Supabase `udispwzwrebjkanudcoy`, complemento Fábrica `agent_status`, GitHub `Rick2818/Fabrica-de-Agentes-IA` y sus seis workflows en `main`. Proyecto Site asociado: `appgprj_6adbf0c05a0c8191b2ca585b76f5e862`. Sin acceso de lectura al **código fuente actual del editor de Sites**: el complemento expone estado funcional y recibos, no una comparación de fuentes. Ningún tick, `run_pending_tasks`, trabajo, cambio de cuota, modificación de fecha, secreto, Site, disparador o ejecutor fue activado en esta auditoría.

## Programación real y distinción de éxito
- `cron.job`: un único cron principal activo, `jobid=1`, `fabrica-queue`, `* * * * *`, comando `select private.fabrica_scheduler_tick();`.
- `cron.job_run_details` a las 10:16:51 UTC: **899** ejecuciones SQL `succeeded`, **0** con otro estado, última iniciada a las 10:16 UTC. **+71** frente al corte anterior de 828. Esto **no** significa 899 tareas `done`.
- `private.fabrica_scheduler_receipts` a las 10:16 UTC: **185** recibos, **185** UUID distintos, **185** request_id distintos, **9** `verified=true AND site_status='done'`, **1** pendiente de conciliación del minuto actual, **0** pendientes con más de dos minutos. El conteo de recibos creció **+70** respecto de 115; sin entregas `done` nuevas.
- Los nueve `done` fueron revalidados contra `net._http_response`: los nueve tienen HTTP 200, `receipt.source=supabase-cron`, `receipt.supabase.schedule_id=supabase:udispwzwrebjkanudcoy:fabrica-queue`, `receipt.supabase.run_id=cycle_id`, `receipt.job_id=run.id` y `run.status=done`. Nueve IDs de trabajo distintos: tres técnicos y seis prácticas. Cero `cycle_id` repetidos en SQL. El HTTP 200 solo cuenta junto con recibo y `done` correlacionados.
- La distribución consultada a las 10:15 UTC incluyó `idle`, `waiting`, `error`, `quota` y `done`; `error` funcional no equivale a fallo SQL ni se interpreta como entrega. Los dos `site_status=error` históricos tienen `error_code=null` porque el recibo de transporte sí validó; revisar su significado si se desarrolla observabilidad adicional, sin reescribir historia.

## Site, cola, cuotas, locks, reintentos
- `agent_status` devolvió 64 trabajos históricos: 59 `done`, 2 `failed`, 3 `cancelled`, **0 pendientes**. Cuota **15/20**. Último ciclo de Supabase `idle`, `pending=0`, fuente `supabase-cron`, schedule_id y UUID de ciclo explícitos; el UUID del minuto actual no se consideró entrega.
- `private.fabrica_scheduler_config`: `enabled=true`, `not_before=null`, `last_error=null`. Sin diferimiento activo; no se alteraron cuotas ni `not_before`.
- `private.fabrica_scheduler_tick()`: `pg_try_advisory_xact_lock(1432658222,51)`, `FOR UPDATE` de configuración, guardias `enabled`/`not_before`, espera de recibo anterior y envío HTTP con `run_id` UUID. `private.fabrica_scheduler_reconcile()` verifica identidad/origen/estado/UUID/tiempos, maneja errores de red y respuesta ausente, y programa `not_before` cuando procede.
- Constraints reales de recibos: `PRIMARY KEY (cycle_id)` y `UNIQUE (request_id)`. `pg_locks`: 0 advisory locks concedidos y 0 en espera **en el instante consultado**; esto no constituye una prueba de carrera ni de exclusión mutua bajo carga.
- Recuperación por reintentos ya acreditada en auditorías anteriores para trabajos técnicos, Alma y Nico. No se generó una prueba productiva artificial en este corte; la cola vacía no justifica gastar cuota o modificar fechas.
- Logs unificados consultados en ventana 07:00–10:15 UTC: 470 registros `postgres_logs`, 9 `pgbouncer_logs`. Los conteos son telemetría, no entregas funcionales.

## GitHub, nombres y límites de certificación
- Leídos en `main` los seis archivos `.github/workflows/{agent-runner,diagnostic-a-scheduler,diagnostic-b-conditions,diagnostic-c-actor,training-regression,verify-training}.yml`. **Ninguno declara `schedule:`**. `agent-runner.yml` solo admite `workflow_dispatch`; las suites de regresión admiten `push` y/o `workflow_dispatch`, no disparo programado. Un `event=schedule` histórico mostrado por `cloud_runner` no acredita que GitHub conserve un cron actual.
- `AGENTS.md` leído en `main`: Leo/Ventas, Mila/Servicio al cliente, Vera/Finanzas, Alma/Química y Farmacia, Nico/Logística, Lía/Mercadeo. Un resultado de un objetivo técnico histórico confunde Alma con Mercadeo y Lía con Legal; no usarlo como autoridad para renombrar agentes ni declarar corrección semántica.
- El respaldo horario de ChatGPT se mantiene separado; **no** se invocó `run_pending_tasks` para competir con el cron principal.

## Resultado y límites
**Autonomía real de las seis prácticas: previamente demostrada y revalidada por nueve recibos E2E `done` correlacionados. Continuidad del cron: confirmada en esta ventana, sin nuevas entregas. Punto 4: certificación integral PENDIENTE.** Siguen sin prueba directa el código vigente del editor Sites y las pruebas productivas controladas de concurrencia, pausa/reanudación, caída de transporte y recuperación de recibo ausente. No se observó un bloqueo nuevo que autorice parche de producción o duplicación de ejecutores.

Fuentes: consultas SQL y logs directos del proyecto Supabase, complemento `agent_status`, [AGENTS.md](../../AGENTS.md), [workflows](../../.github/workflows), [auditoría previa 03:05 SV](point4-supabase-continuity-20261029-0305-sv.md).
