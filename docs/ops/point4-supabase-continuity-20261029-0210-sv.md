# Fábrica de Agentes IA — Punto 4 — auditoría de continuidad 2026-10-29 02:10 SV

## Alcance y metodología
Lecturas directas, sin mutaciones, del proyecto Supabase `udispwzwrebjkanudcoy`, del complemento operativo del Site `appgprj_6adbf0c05a0c8191b2ca585b76f5e862`, de `AGENTS.md`, seis workflows vigentes de GitHub y scripts de pruebas. Comparación de `cron.job`, `cron.job_run_details`, `private.fabrica_scheduler_config`, `private.fabrica_scheduler_receipts`, `net._http_response` y `health.autonomy.cycles`. Se respetó la cola original; no se invocaron `fabrica_scheduler_tick()` ni `run_pending_tasks`, no se encolaron prácticas, ni se alteraron cuotas, fechas, Site, secretos, trabajos o disparadores. La fuente activa del editor Sites no se pudo inspeccionar directamente.

## Resultado comprobado: seis especialidades procesadas por Supabase Cron
A la consulta de 08:09–08:10 UTC del 29 de octubre, `cron.job` tiene **un solo job activo**, `jobid=1`, `fabrica-queue`, `* * * * *`, comando `select private.fabrica_scheduler_tick();`. `cron.job_run_details` registra **772 SQL succeeded** desde 2026-10-28 19:18 UTC, sin otros estados en la ventana; la última consulta de detalles individuales ya mostraba 08:10 UTC. Los SQL succeeded no son entregas.

La tabla de recibos contenía **58 ciclos** (58 UUID y 58 `request_id` distintos), distribuidos en **9 `verified=true,site_status=done`**, 2 `error`, 4 `waiting`, 1 `quota`, 41 `idle`, y 1 sin conciliar. Los nueve `done` fueron contrastados con `net._http_response`: `receipt.source=supabase-cron`, `receipt.supabase.run_id=cycle_id`, `receipt.job_id=run.id`, HTTP 200 y `verified=true`. La consulta agrupada por ID de trabajo no encontró trabajos con más de un `done` verificado.

### Nueve entregas `done` del cron principal (UTC)
| Hora UTC | cycle_id | Trabajo | Tipo |
|---|---|---|---|
| 07:08 | fd712df0-85c8-46f5-8be6-d108667fa6e7 | g-goal-paridad-dots-fabrica-seis-20261028-v1-step-1-r0 | plan de pruebas |
| 07:09 | d2328dfe-5c50-4b0d-9857-abf2601b8a76 | ac4596e9-4ca9-48cf-8316-f99186ee2b97 | Leo, Ventas |
| 07:10 | dfa71c70-8063-4dc4-8429-766ce8e2c305 | afd420ce-0e2e-45a5-8d35-156a7671f35f | Mila, Servicio |
| 07:11 | ad5ed449-3984-4d6d-96d8-2a02b6060228 | beba39da-17e6-4702-b2df-04d483455b00 | Vera, Finanzas |
| 07:20 | 9bdeaacb-1fd0-44be-81cb-c18eec9209eb | e542cf04-5b8f-45df-b6f7-8df9b48873b1 | Alma, Química y Farmacia |
| 07:22 | b723a157-e4ab-46cf-8e2e-a9101f2eddcc | de601482-876e-4e9c-b2e8-4d665faedba3 | Lía, Mercadeo |
| 07:24 | 01212c3e-68f1-48a3-aa58-5be6a2b1efe5 | g-goal-paridad-dots-fabrica-seis-20261028-v1-step-2-r0 | especificación |
| 07:26 | fe1939f8-c5fe-4f08-a8fc-d08a4273e855 | g-goal-paridad-dots-fabrica-seis-20261028-v1-verify-3-r0 | revisión |
| 07:27 | d032ef07-91de-43b1-b27e-aedbac90c22d | dcd4cd45-d65f-41c7-a443-fe228efd480f | Nico, Logística |

La lectura MCP del Site muestra 64 trabajos históricos: 59 `done`, 2 `failed`, 3 `cancelled`, **0 pendientes**, cuota **15/20**. Los seis trabajos de especialidad arriba figuran `done` con `evidence.execution_source=supabase-cron` y resultados persistidos. El estado `health.supabase_runner` a 08:09 UTC informa `idle`, `pending=0`, UUID `c2c91926-ea6e-4ea1-8dee-5c01b3c203cf`; su recibo SQL estaba todavía sin conciliar al corte. Los ciclos posteriores `idle` no se cuentan como trabajos `done`. Las seis prácticas anteriores `synthetic-six-20261028-*` fueron ejecutadas desde otros orígenes, no se les atribuye ejecución del cron principal.

## Recuperación, bloqueo, pausas, idempotencia y observabilidad
- Recuperación real: `step-1` tuvo `error` verificado a 07:01 UTC y `done` a 07:08 UTC. Alma tuvo `waiting` a 07:12 y `done` a 07:20. Nico tuvo `error` a 07:13, `waiting` a 07:21/07:23/07:25 y `done` a 07:27 (cinco intentos según Site). Son reintentos de trabajos originales, no entregas duplicadas.
- `private.fabrica_scheduler_tick()` instalado contiene `pg_try_advisory_xact_lock(1432658222,51)`, `FOR UPDATE`, guardias `enabled`, `not_before` y `checked_at is null`. `fabrica_scheduler_reconcile()` valida origen, UUID, programación, trabajo, tiempos y estado, y difiere cinco minutos ante error; marca `response_missing` si expira respuesta. La PK de `cycle_id` y UNIQUE de `request_id` existen. No había advisory locks concedidos en la consulta puntual; **no demuestra exclusión mutua bajo carrera**.
- `private.fabrica_scheduler_config`: `enabled=true`, `not_before=null`, `last_error=null` después de la recuperación. No se forzó tick, no se adelantaron reintentos ni se manipuló cuota.
- Brecha de diagnóstico: los dos `site_status=error` verificados tienen `error_code=null` aunque el código SQL almacena temporalmente `last_error=worker_error` y lo limpia al recuperarse. Requiere mejorar trazabilidad histórica en cambio separado y probado, sin alterar producción ahora.
- Scripts `scripts/test-agent.mjs` y `scripts/test-cloud-runner.mjs` contienen pruebas locales de exclusión, lease, pausa, cancelación, cuota, recuperación e idempotencia; **se inspeccionó el código, no se ejecutaron las suites en esta auditoría**. Falta prueba controlada de concurrencia, pausa/reanudación y fallo HTTP/recibo ausente sobre el Site publicado.
- `AGENTS.md` define canónicamente **Alma = Química y Farmacia; Lía = Mercadeo**. El texto generado por el objetivo completado mezcla las especialidades (Alma Mercadeo, Lía Legal), por lo que su revisión IA `passed` **no certifica exactitud funcional**. No se reescribió el historial ni la fuente vigente.
- `cron.job` y los seis workflows de GitHub se inspeccionaron directamente: `agent-runner.yml`, `diagnostic-a-scheduler.yml`, `diagnostic-b-conditions.yml`, `diagnostic-c-actor.yml`, `training-regression.yml`, `verify-training.yml`. **Ninguno contiene `on.schedule`**. El runner admite solo `workflow_dispatch`; las suites de regresión también pueden correr por `push`, sin procesar automáticamente la cola.
- Logs unificados Supabase consultados para 07:00–08:10 UTC: 170 entradas `postgres_logs`, 3 `pgbouncer_logs`. El conteo de logs no equivale a éxito funcional ni sustituye los recibos.

## Decisión de certificación
**Certificación parcial, ahora con evidencia autónoma E2E de cola → Site → respuesta → recibo Supabase para las seis especialidades.** La cola se vació naturalmente, el principal siguió activo y los reintentos recuperaron errores sin `done` duplicado observado. **Punto 4 integral NO certificado**: faltan inspección directa de la fuente vigente del editor Sites, pruebas controladas de carrera, pausa/reanudación, recibo ausente/HTTP y recuperación con caída del ejecutor, además de validar la corrección semántica del material generado. No se debe sustituir Site por main ni crear otro ejecutor. No se identificó un bloqueo que justifique parche productivo inmediato.

Fuentes: Supabase consultas de esta auditoría, complemento Site `agent_status`, GitHub `AGENTS.md` y los seis workflows en `main`; auditoría anterior `docs/ops/point4-supabase-continuity-20261029-0112-sv.md`.
