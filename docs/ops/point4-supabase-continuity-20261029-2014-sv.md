# Punto 4 — continuidad de Leo y seis agentes (29-10-2026, 20:14 SV)

**ESTADO RECTOR:** CERRADO PROVISIONALMENTE, SIN CERTIFICACIÓN. Sin cliente real no hay aceptación final. Esta revisión es auditoría de solo lectura y preservación documental; no crea trabajo, no ejecuta tick, no altera cuota, pausas, jobs, credenciales ni despliegues.

## Fuentes leídas en este control
- Supabase `udispwzwrebjkanudcoy`: `cron.job`, `cron.job_run_details`, `private.fabrica_scheduler_config`, `private.fabrica_scheduler_receipts`, definiciones actuales de `private.fabrica_scheduler_tick()` y `private.fabrica_scheduler_reconcile()`, índices de unicidad, agregados y secuencia del error de transporte. Lectura de logs de Postgres (ventana 00:13–02:13 UTC) mediante la fuente de logs.
- Fábrica, complemento `agent_status`: instantánea de 65 trabajos, cuota, salud y últimos ciclos con UUID.
- GitHub `Rick2818/Fabrica-de-Agentes-IA`: `AGENTS.md` y **contenido individual** de los siete YAML bajo `.github/workflows`.
- Automations: comprobación privada de la programación existente `Respaldo de pendientes Fábrica IA` (ID `6adbf94d28e8819189c0516c6068457a`).
- Navegador: intento de listar pestañas rechazado por falta de contexto de navegador. Esto **no demuestra** que la fuente nativa de Sites sea inaccesible; la fuente v53 fue recuperada antes. En este control no se inspeccionó el artefacto nativo desplegado.

## Evidencia operativa (instantánea 2026-10-30 02:14:35 UTC / 29-10 20:14 SV)
- Un solo job Supabase Cron observado: `jobid=1`, `jobname=fabrica-queue`, `* * * * *`, `active=true`, comando `select private.fabrica_scheduler_tick();`. Configuración `enabled=true`, `not_before=null`, `last_error=null`.
- `cron.job_run_details`: **1857** ejecuciones SQL, **1857** `succeeded`, última iniciada `2026-10-30 02:14:00.026494+00`. El SQL verde **no es** entrega `done`.
- `private.fabrica_scheduler_receipts`: **1136** filas y **1136 UUID distintos**, **1134 verificadas**, **9 `site_status=done` históricos verificados**. Dos no verificadas: un `network_error` antiguo y el ciclo más reciente aún en conciliación normal. `awaiting=1`, `stale(>2 min)=0`. No hay evidencia de nueva entrega funcional.
- Último UUID de ciclo del Site `9425a0ae-1a94-4768-a473-c51b5f358df0`, `scheduled_at=1793326440037` (02:14 UTC), origen `supabase-cron`, `status=idle`, `pending=0`. Coincide con el UUID del recibo SQL reciente, todavía pendiente de conciliación en la instantánea. `idle` **no equivale** a `done`.
- Site vía complemento: **65 trabajos** (60 `done`, 2 `failed` históricos, 3 `cancelled`), cero pendientes; cuota **20/20**. Sin trabajo activo ni lease visible en la instantánea; no se fuerza consumo adicional.
- Los siete YAML: `agent-runner.yml`, `diagnostic-a-scheduler.yml`, `diagnostic-b-conditions.yml`, `diagnostic-c-actor.yml`, `factory-regression.yml`, `training-regression.yml`, `verify-training.yml`. **Ninguno contiene disparador `schedule`**. Algunos contienen `push`/`pull_request` de pruebas y `workflow_dispatch`; no son un segundo cron de cola.
- Respaldo horario: `is_enabled=true`; último registro `2026-10-30T01:49:07Z`, estado `no_update`. No se invocó ni se modificó; `no_update` no prueba procesamiento.

## Transporte, exclusión, pausas, reintentos e idempotencia
- El timeout previo se conserva como **resultado desconocido**: ciclo `301f7d3c-d7d0-4d74-86de-072dc18f64f4` de `2026-10-30 00:38:00.034 UTC`, `error_code=network_error`, `verified=false`, sin HTTP status ni recibo de Site para ese UUID. **No** imputar `done` ni reintentar ese UUID manualmente.
- El siguiente ciclo verificable fue a `00:45 UTC`, `26d7280f-22c6-49e4-8a07-29a58248b63e`, HTTP 200, `verified=true`, `idle`; ciclos posteriores también `idle`. Recuperación de transporte observada, no certificación de recuperación de un trabajo en curso.
- `private.fabrica_scheduler_tick()` usa `pg_try_advisory_xact_lock(1432658222,51)`, `FOR UPDATE` sobre configuración, `not_before`, espera recibo anterior y genera UUID único por solicitud. `private.fabrica_scheduler_reconcile()` valida origen/proyecto/programación/UUID/fecha/estado, respeta `next_at`, difiere cinco minutos en errores y no transforma recibos ausentes en éxito. Índices únicos sobre `cycle_id` y `request_id`. Inspección estática y datos observados **no** sustituyen prueba aislada de carrera/reintento.
- Logs Postgres de la ventana revisada muestran inicios periódicos de `fabrica_scheduler_tick()`; no se obtuvo evidencia adicional del resultado nativo del timeout desde esos logs. No se deben interpretar mensajes de inicio como ejecución de trabajo.

## Versiones, modelos y pendientes
- `AGENTS.md` preserva Site, límites, seguridad y separación del proyecto. Fuente v53 recuperada anteriormente: commit `5be977154cc15c9511787d22e28b7367e6f00467`, 122 pruebas históricas aprobadas; **no repetidas** aquí.
- El complemento conserva una nota de despliegue v58 `succeeded`, pero **no se leyó el hash del artefacto nativo desplegado en esta revisión**. No se activó v54 ni otra versión.
- Sondas sintéticas previas: Gemini 2.5 principal y respaldo HTTP 404; tercera alternativa HTTP 200. No hubo nuevas sondas (cuota 20/20). Fallback ante error real, continuidad de los seis agentes y aceptación con cliente real **no certificados**.
- Pendientes para validación final: comparar fuente nativa y versión efectivamente desplegada; ejecutar pruebas **aisladas, sin alterar producción**, de concurrencia, pausas, idempotencia/reintentos y recuperación de transporte; correlacionar el UUID de timeout si existe recibo nativo conservado; E2E verificable por cada especialidad; aceptación final con cliente real.

**Decisión:** sin regresión nueva demostrada que justifique modificar producción. No tocar ejecutor principal, respaldo, jobs, cuota, fechas, pagos, correo, terceros ni otros proyectos. Mantener punto 4 CERRADO PROVISIONALMENTE, SIN CERTIFICACIÓN.
