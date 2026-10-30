# Punto 4 — auditoría de continuidad (2026-10-29 23:08 America/El_Salvador)

**Decisión rectora:** CERRADO PROVISIONALMENTE, SIN CERTIFICACIÓN. No existe aceptación de cliente real. Esta auditoría es de solo lectura; no acredita certificación, no reabre el punto y no equivale a estación 4 del diseño ni al issue #4.

## Alcance y fuentes observadas
- Site original: `appgprj_6adbf0c05a0c8191b2ca585b76f5e862`, consulta mediante complemento `agent_status` (instantánea de 2026-10-30 05:07–05:08 UTC).
- Supabase proyecto `udispwzwrebjkanudcoy`: consultas SQL SELECT a `cron.job`, `cron.job_run_details`, `private.fabrica_scheduler_config`, `private.fabrica_scheduler_receipts`, índices y definiciones de funciones; logs PostgreSQL de 04:00–05:08 UTC.
- GitHub `Rick2818/Fabrica-de-Agentes-IA`: AGENTS.md y contenido de los siete workflows en main.
- Automatización de respaldo `6adbf94d28e8819189c0516c6068457a`: lectura privada de estado (habilitada, último run 2026-10-30 04:45 UTC con `no_update`, no equivale a procesamiento).

## Evidencia actual (corte SQL 2026-10-30 05:08:05 UTC)
- Cron principal `fabrica-queue`, jobid=1, `* * * * *`, `active=true`, comando `select private.fabrica_scheduler_tick();`. `cron.job_run_details`: **2030 ejecuciones**, **2030 SQL succeeded**, 0 fallos SQL en ese job al corte anterior 05:07 UTC. Últimos 75 minutos: 75 succeeded, 0 fallos SQL. Estos estados NO demuestran trabajos `done`.
- Configuración: `enabled=true`, `not_before=null`, `last_error=null`.
- Recibos: **1304** filas, **1301 verified**, **3 no verificadas**, **1304 UUID únicos**, **9 recibos históricos `done`**. Los 3 no verificados son **dos errores históricos `network_error`** (UUID `301f7d3c-d7d0-4d74-86de-072dc18f64f4` 2026-10-30 00:38 UTC; `e557300e-1fa9-4015-97f7-4d831ff2b450` 03:53 UTC) y el ciclo más reciente `04070726-922a-4d6b-b66a-5204855bfbcf` 05:08 UTC aún sin conciliación al instante del corte. Ninguno se declara `done`.
- Recibos recientes conciliados con HTTP 200, `verified=true`, `site_status=idle`: 05:07 UTC UUID `9a17a6d2-f181-4360-836c-239b140d7914`, 05:06 UTC UUID `e154e6fc-1cc8-4f9a-bf92-056376102611`. Los UUID aparecen también en `health.autonomy.cycles` del Site con `source=supabase-cron`, `status=idle`. No hubo entrega funcional nueva.
- Estado Site: 65 jobs históricos, 60 `done`, 2 `failed`, 3 `cancelled`; **0 pendientes**, **0 leases activos** entre los jobs visibles, cuota **20/20**. `health.supabase_runner` reciente `idle` y `pending=0`. Los 60 `done` son trabajos históricos del Site, NO equivalen a 60 recibos `done` de Supabase.
- Modelo principal `gemini-2.5-flash` y backup `gemini-2.5-flash-lite`: sondas sintéticas históricas HTTP 404; tercero `gemini-3.5-flash-lite`: HTTP 200. El fallback de una ejecución real no está certificado. No se consumió cuota en esta auditoría.
- GitHub: **siete workflows**, ninguno contiene trigger `on.schedule`; `agent-runner.yml` solo `workflow_dispatch`. Algunos workflows de CI admiten `push`/`pull_request`, no son el ejecutor periódico.
- `private.fabrica_scheduler_tick()` usa `pg_try_advisory_xact_lock`, bloqueo de fila en config, `not_before` y espera de recibo; `private.fabrica_scheduler_reconcile()` comprueba origen, project_id, schedule_id, UUID, timestamp, estado y job_id antes de marcar `verified`, y aplica pausa de 5 minutos ante errores. Índices UNIQUE en `cycle_id` y `request_id`; 0 UUID duplicados observados. Inspección estática, NO prueba aislada formal de concurrencia.
- Logs de Supabase: se observaron registros de inicio/finalización del cron. Dos errores SQL `column created_at does not exist` a las 05:06–05:07 UTC provinieron de las consultas de auditoría iniciales, corregidas usando `scheduled_at`/`checked_at`; NO se atribuyen al ejecutor.
- Site: existe nota operativa que refiere v58, despliegue `appgdep_6ae3cfc470ac819191fb9c00a7034887` `succeeded` y source `207466f651085ed04ec5ed0cc3cdc1628b17f3a6`; **no se hizo comparación nativa del artefacto desplegado**, por lo que no se acredita paridad exacta con esa nota. Fuente recuperada v53 `5be977154cc15c9511787d22e28b7367e6f00467` y 122 pruebas aprobadas son antecedentes, no reejecutadas. No se activó v54.

## Pendientes / criterio de certificación
1. Acceso nativo al Site y comparación de la fuente efectivamente publicada con su artefacto y regresiones.
2. Pruebas aisladas controladas de concurrencia/locks, pausa `not_before`, reintento, idempotencia y recuperación tras timeout con evidencia E2E; no ejecutadas hoy.
3. Prueba del fallback de modelos con cuota disponible, sin forzar cuota ni llamadas.
4. Aceptación y recibos verificables de cliente real para validación final.

**Acciones:** ninguna modificación de producción, código, cuotas, fechas, ejecutores, cron ni respaldo. No se lanzó `tick` ni se creó trabajo sintético. Se conserva el cierre provisional sin certificación.
