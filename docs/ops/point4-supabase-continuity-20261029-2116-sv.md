# Fábrica de Agentes IA — Punto 4, control 2026-10-29 21:16 SV

**Estado rector: CERRADO PROVISIONALMENTE, SIN CERTIFICACIÓN.** Este punto es autonomía/continuidad del ejecutor de Leo y seis agentes; no es la estación 4 del diseño ni GitHub issue #4. No hay cliente real para aceptación final. Auditoría de solo lectura: no se disparó tick, no se creó tarea, no se alteró cuota, not_before, cron, código ni despliegue.

## Fuentes y momento
- Proyecto Supabase `udispwzwrebjkanudcoy`, consultas SQL de solo lectura a `cron.job`, `cron.job_run_details`, `private.fabrica_scheduler_config`, `private.fabrica_scheduler_receipts`, índices y definiciones de `private.fabrica_scheduler_tick()` y `private.fabrica_scheduler_reconcile()`. Instantánea principal de 2026-10-30 03:14 UTC; una lectura posterior observa el ciclo 03:15 UTC en conciliación normal.
- Logs PostgreSQL entre 02:15 y 03:16 UTC: mensajes de inicio del cron, **no** evidencia de trabajo `done`.
- Site `appgprj_6adbf0c05a0c8191b2ca585b76f5e862` mediante `Fábrica de Agentes IA.agent_status`; se contrastó `health.autonomy.last_scheduled_cycle` y `health.supabase_runner` con UUID SQL.
- GitHub `Rick2818/Fabrica-de-Agentes-IA`: lectura de `AGENTS.md` y los siete YAML individuales de `.github/workflows`.
- Automatización existente `Respaldo de pendientes Fábrica IA` (`6adbf94d28e8819189c0516c6068457a`) consultada sin ejecutarla ni modificarla.

## Cron, cola y recibos
- Único job SQL observado: `jobid=1`, `fabrica-queue`, `* * * * *`, activo, `select private.fabrica_scheduler_tick();`. Configuración: `enabled=true`, `not_before=null`, `last_error=null`.
- `cron.job_run_details`: **1917** registros, **1917 succeeded**, 0 fallos SQL; última ejecución 03:14:00 UTC. El estado SQL `succeeded` no acredita procesamiento `done`.
- `private.fabrica_scheduler_receipts`: **1196** filas y **1196 UUID distintos**, **1194 verified**, **2 sin verificar** al corte: 1 error histórico de red y 1 ciclo reciente en conciliación; **9 `site_status=done` verificados históricos**, sin entrega funcional nueva. `idle_verified=1177`; 1 sin verificar con más de dos minutos, identificado como incidente histórico. Conteo basado en la instantánea 03:14 UTC, sujeto al avance normal del cron.
- UUID SQL `931df756-b225-4dc1-b0e3-fb5f13b8734d` (03:14 UTC), `request_id=1197`, fue conciliado con `http_status=200`, `verified=true`, `site_status=idle` en lectura posterior. El mismo UUID figura en el recibo nativo `health.supabase_runner` y en `last_scheduled_cycle` del Site, con `source=supabase-cron`, `status=idle`, `pending=0`. **HTTP 200/idle no es entrega done.**
- En la lectura posterior aparece UUID `19b477f3-ee5d-44c1-bf18-5ebbcae753a1` programado a 03:15 UTC, todavía `checked_at=null`; no se clasifica como error.
- Site: 65 trabajos, 60 `done`, 2 `failed` históricos, 3 `cancelled`; **0 pendientes**. No se observaron leases activos en los trabajos retornados. Cuota **20/20**; no se ejecutaron pruebas sintéticas nuevas ni se forzó `tick`.

## Recuperación, idempotencia y límites
- Incidente sin resolución de resultado: UUID `301f7d3c-d7d0-4d74-86de-072dc18f64f4`, 2026-10-30 00:38 UTC, `request_id=1047`, `verified=false`, `error_code=network_error`, sin HTTP ni recibo Site comprobable. Mantener **resultado desconocido**, no convertirlo en `done` ni reintentar manualmente el UUID.
- Los ciclos posteriores tienen recibos `idle` verificados, lo cual acredita recuperación de transporte para nuevas solicitudes, **no** recuperación E2E de un trabajo en curso.
- Inspección estática de funciones SQL: `pg_try_advisory_xact_lock(1432658222,51)`, `FOR UPDATE` de configuración, espera `awaiting_receipt`, respeto a `not_before`, diferimiento de 5 minutos ante errores, `next_at` remoto, conciliación por origen/proyecto/schedule/UUID/fecha/estado y manejo de `response_missing` después de 2 minutos. Índices únicos en `cycle_id` y `request_id`. Hashes MD5 de definiciones observadas: `tick=7fb25848caa91dc78eb0f469659f691d`, `reconcile=78a1057460b103ae1cddfb5d5e0339f0`. **No** se ejecutaron ensayos de carrera, pausa o reintento.
- GitHub: `agent-runner.yml`, `diagnostic-a-scheduler.yml`, `diagnostic-b-conditions.yml`, `diagnostic-c-actor.yml`, `factory-regression.yml`, `training-regression.yml`, `verify-training.yml`; ninguno contiene `schedule`. `push`, `pull_request` y `workflow_dispatch` de pruebas no son un segundo cron de cola.
- Respaldo horario `is_enabled=true`; último registro `no_update` iniciado 2026-10-30 02:52:48 UTC. `no_update` no equivale a ejecución de cola; no fue invocado.

## Fuente, modelos y validación final
- `AGENTS.md` leído. Fuente nativa v53 recuperada anteriormente en commit `5be977154cc15c9511787d22e28b7367e6f00467`; **122 pruebas históricas aprobadas** en su worktree, no repetidas en esta auditoría.
- Nota persistida del Site informa despliegue v58 `succeeded` y hash fuente `207466f651085ed04ec5ed0cc3cdc1628b17f3a6`, pero no se verificó aquí el artefacto nativo efectivamente servido. Acceso al navegador conectado devolvió error de contexto; esto **no** niega la recuperación nativa de Sites ni autoriza sustituir código. No se activó v54.
- Sondas sintéticas previas de modelos: `gemini-2.5-flash` y `gemini-2.5-flash-lite` devolvieron HTTP 404; alternativa `gemini-3.5-flash-lite` respondió HTTP 200. El fallback ante fallo real del proveedor no está certificado. Con cuota 20/20 no se realizaron sondas nuevas.
- Pendientes **no aprobados**: inspección nativa y comparación con despliegue exacto; pruebas aisladas de concurrencia, pausas, idempotencia/reintentos y recuperación de transporte; conciliación del UUID de timeout si surge recibo conservado; evidencia E2E por las seis especialidades; aceptación final de cliente real.
- Decisión: no hay regresión nueva confirmada que justifique cambio productivo. Mantener cron principal y respaldo sin interrupción, y punto 4 **CERRADO PROVISIONALMENTE, SIN CERTIFICACIÓN**.
