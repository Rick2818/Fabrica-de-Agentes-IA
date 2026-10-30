# Fábrica de Agentes IA — Punto 4: control de continuidad (2026-10-30, 10:16 El Salvador)

**ESTADO RECTOR: CERRADO PROVISIONALMENTE, SIN CERTIFICACIÓN.** Sin cliente real para aceptación final. Este control se limitó a lecturas de Supabase, estado del complemento de la Fábrica, GitHub y respaldo; no ejecutó cola ni cambió producción.

## Evidencia verificada

- **Ámbito:** Site original `appgprj_6adbf0c05a0c8191b2ca585b76f5e862`, Supabase `udispwzwrebjkanudcoy` (`ACTIVE_HEALTHY`), repositorio `Rick2818/Fabrica-de-Agentes-IA`. Se leyó `AGENTS.md` y los siete workflows de `main`.
- **Cron real:** único job `fabrica-queue` (jobid 1), `* * * * *`, `active=true`, comando `select private.fabrica_scheduler_tick();`. Corte 2026-10-30 16:16 UTC: **2,699 ejecuciones SQL `succeeded`**; ninguna de otro estado en `cron.job_run_details`. Son **70 ejecuciones adicionales** frente al control de las 09:06 SV (2,629). `1 row` es resultado SQL, **no** evidencia de trabajo `done`.
- **Recibos Supabase:** al corte 16:16 UTC, **1,961 recibos y 1,961 UUID únicos**, **1,956 verificados** y cinco sin verificar; son **70 recibos adicionales** frente a 1,891 a las 09:06. Distribución: 1,939 `idle` verificados, nueve `done` históricos, cuatro `waiting`, dos `error`, uno `quota`, uno `busy`, cuatro `network_error` sin verificar y un ciclo nuevo aún sin conciliación. No hay nuevas entregas funcionales `done`.
- **Correlación de UUID:** ciclo `d2045619-fdb2-4220-beb1-efb6c30f8a05` programado 16:16:00.055 UTC: en Supabase todavía `verified=false`, `site_status=null` al primer corte. En el complemento `agent_status` figura con el mismo UUID, `source=supabase-cron`, estado `idle`, terminado en el Site a las 16:16:02 UTC. Coincidencia de UUID y ciclo `idle` **no equivale** a conciliación SQL ni entrega. El ciclo anterior `01c4e746-926d-4078-9ff1-997ba2025e00` sí estaba conciliado: `verified=true`, HTTP200, `site_status=idle`.
- **Site y cola:** 65 trabajos históricos: 60 `done`, dos `failed`, tres `cancelled`, **cero pendientes**. Cuota **0/20**. `health.supabase_runner.status=idle`, `pending=0`, `next_at=null`; `health.autonomy.stalled=false`. Los 60 trabajos `done` del Site son distintos de los nueve recibos cron `done`.
- **Pausas/diferimiento:** `private.fabrica_scheduler_config.enabled=true`, `not_before=null`, `last_error=null`. Sin manipular cuota ni fechas. `fabrica_scheduler_tick` contiene `pg_try_advisory_xact_lock`, `FOR UPDATE` y `not_before`; `fabrica_scheduler_reconcile` contiene `not_before`. MD5 de funciones: `tick=7fb25848caa91dc78eb0f469659f691d`; `reconcile=78a1057460b103ae1cddfb5d5e0339f0`, iguales al control previo. Índices únicos sobre `cycle_id` y `request_id` presentes. Son comprobaciones estáticas, **no** pruebas de carreras, reintentos o recuperación.
- **Transporte:** los cuatro `network_error` históricos sin recibo Site verificable siguen siendo `301f7d3c-d7d0-4d74-86de-072dc18f64f4`, `e557300e-1fa9-4015-97f7-4d831ff2b450`, `4dd8d3fe-9de6-40e8-8af7-de813e230d1b` y `904c6e64-4e73-4aea-a569-a11ab7234cd1`. **Ningún incidente nuevo** desde el control previo. No inferir `done` de ausencia de error posterior.
- **Logs:** ventana 2026-10-30 00:00–16:15 UTC: 2,349 `postgres_logs` y 48 `pgbouncer_logs`; no se mostraron trazas nativas de Site (`edge_logs` o `function_edge_logs`) en la consulta. Registros PostgreSQL muestran inicio de `cron job 1`, pero no causa de los cuatro timeouts.
- **GitHub:** los siete workflows leídos individualmente: `agent-runner.yml`, `diagnostic-a-scheduler.yml`, `diagnostic-b-conditions.yml`, `diagnostic-c-actor.yml`, `factory-regression.yml`, `training-regression.yml`, `verify-training.yml`. **Ninguno contiene `schedule:`**. `agent-runner` solo `workflow_dispatch`; CI `push`/`pull_request` no es cron. No se disparó GitHub Actions.
- **Respaldo:** automatización `Respaldo de pendientes Fábrica IA` habilitada. Último registro consultado: 2026-10-30 15:30:51–15:30:53 UTC, estado `no_update`, sin salida atribuible. No se reconfiguró ni ejecutó manualmente. Que no aparezca como ciclo reciente del Site no demuestra avería.
- **Modelos:** pruebas sintéticas anteriores en el Site muestran `gemini-2.5-flash` HTTP404, `gemini-2.5-flash-lite` HTTP404 y `gemini-3.5-flash-lite` HTTP200. No se hizo una prueba E2E nueva de fallback; HTTP200 de modelo aislado no demuestra recuperación integral.
- **Fuente/versiones:** la fuente nativa original de Site asociada a v53 se recuperó previamente (commit Site `5be977154cc15c9511787d22e28b7367e6f00467`, 122 pruebas históricas de servidor aprobadas en worktree). **No hubo acceso nativo directo al despliegue/código actual del Site en este control**; no se declara paridad. v54 permanece guardada sin desplegar según estado rector; no se activó.

## Pendientes de validación (no aprobados)

1. Diagnóstico causal de cuatro timeouts con trazas nativas Site y conciliación por UUID.
2. Pruebas aisladas de concurrencia, locks, reintentos, idempotencia, pausa, `not_before`, recuperación y fallback sin alterar cuota o trabajos reales.
3. Recorrido E2E sintético con recibo `done` correlacionado, diferenciándolo de aceptación real.
4. Contraste de la fuente nativa Site vigente contra el despliegue real, sin reemplazar código ni activar v54.
5. Aceptación con cliente real cuando exista.

**Decisión:** sin regresión nueva comprobada que requiera corrección en producción. Conservar el ejecutor Supabase y respaldo existentes; no crear cron o ejecutor competidor. Punto 4 **cerrado provisionalmente, sin certificación**.
