# Fábrica de Agentes IA — Punto 4: auditoría de continuidad, 2026-11-01 13:10 CST

**Estado rector:** CERRADO PROVISIONALMENTE, SIN CERTIFICACIÓN. Auditoría de solo lectura, sin ejecutar cola, sin modificar producción ni crear un segundo disparador. No es estación 4 del diseño ni GitHub issue #4.

## Evidencia directa de esta ejecución

- **Corte:** consulta SQL con `now()=2026-11-01 19:10:00.915668+00` (13:10 El Salvador). Supabase `udispwzwrebjkanudcoy` reportó `ACTIVE_HEALTHY`.
- **Cron principal:** `cron.job` tiene un único job `fabrica-queue`, `jobid=1`, `active=true`, `* * * * *`, comando `select private.fabrica_scheduler_tick();`. No se invocó el tick manualmente.
- **SQL cron:** `cron.job_run_details`: **5,753** `succeeded` acumulados, **0** otros estados; **90** `succeeded` en 90 minutos; último inicio `2026-11-01 19:10:00.019602+00`. El éxito SQL no acredita procesamiento funcional `done`.
- **Recibos Supabase:** `private.fabrica_scheduler_receipts`: **5,010** total, **5,004** `verified=true`, **5** `network_error` históricos (entre 2026-10-30 00:38 y 2026-10-31 14:57 UTC), **89** `verified=true/site_status=idle` y **0** `done` en 90 minutos. **0** UUID `cycle_id` duplicados, **0** `request_id` duplicados, **0** recibos sin `checked_at` vencidos más de 3 minutos.
- **Comparación con 12:12 CST:** +59 `succeeded`, +59 recibos y +59 recibos verificados. Los cinco errores históricos no aumentaron. El número de ejecuciones SQL no debe equipararse a entregas.
- **Ciclo conciliado:** `c75e1c2a-390d-4ff8-b073-397c328a1828` (19:09 UTC) `verified=true`, `site_status=idle`, `http_status=200`, `error_code=NULL`, `checked_at=19:10:00.029402 UTC`. **Ciclo pendiente al corte:** `adaf0b52-90bf-4742-84c4-963747a7fa20` (19:10 UTC), `checked_at=NULL`, `verified=false`. El tablero Site reportó `idle` con este mismo UUID y `source=supabase-cron`; no se marcó conciliado.
- **Configuración:** `private.fabrica_scheduler_config` tiene `enabled=true`, `not_before=NULL`, `last_error=NULL`. Índices únicos presentes en `cycle_id` y `request_id`.
- **Revisión estática SQL:** `private.fabrica_scheduler_tick` utiliza `pg_try_advisory_xact_lock`, `FOR UPDATE`, rechazo de solicitudes pendientes, lectura de credenciales Vault, UUID por ciclo y respeto de `not_before`; `fabrica_scheduler_reconcile` contrasta proveedor, proyecto, schedule, UUID, timestamp, estados y recibos, y aplica pausa de 5 minutos ante fallos. Inspección estática, **no** prueba dinámica de locks, recuperación, idempotencia o reintentos.
- **Site mediante complemento conectado `agent_status`:** 65 trabajos: **60** `done`, **2** `failed` históricos, **3** `cancelled`, **0** pendientes; uso **0/20**; `health.supabase_runner.status=idle`, `pending=0`, UUID `adaf0b52-90bf-4742-84c4-963747a7fa20`, origen `supabase-cron`. La verificación del Site no equivale a conciliación SQL ni a aceptación del cliente.
- **Seis prácticas sintéticas:** Leo, Mila, Vera, Alma, Nico y Lía, IDs `synthetic-six-20261028-*`, continúan `done`, cada una con `evidence` JSON de modelo HTTP 200, SHA-256 y `context_mode=isolated`. Son ejercicios de respuesta, **no** recibos E2E de aprobación, fabricación, aprovisionamiento, entrega o aceptación.
- **Modelos:** checks sintéticos históricos: `gemini-2.5-flash` HTTP 404, `gemini-2.5-flash-lite` HTTP 404, `gemini-3.5-flash-lite` HTTP 200. No se efectuó nuevo llamado al proveedor; fallback integral **no certificado**.
- **Respaldo horario:** Automations.peek de `6adbf94d28e8819189c0516c6068457a` devuelve `is_enabled=true`, último `recorded_status=no_update`, run `243329c1-2ff8-8326-9d8b-6c15092ebf83`. No se ejecutó respaldo desde esta auditoría.
- **GitHub:** `AGENTS.md` consultado en `main`. Se enumeraron y leyeron individualmente los **7** archivos de `.github/workflows/`: `agent-runner.yml`, `diagnostic-a-scheduler.yml`, `diagnostic-b-conditions.yml`, `diagnostic-c-actor.yml`, `factory-regression.yml`, `training-regression.yml`, `verify-training.yml`. **Ninguno** contiene disparador `schedule`; `agent-runner.yml` solo `workflow_dispatch`. Otros workflows usan `push`/`pull_request` para pruebas, no schedule del runner.
- **Logs Supabase:** ventana 2026-11-01 17:10–19:10 UTC, `postgres_logs=290`, `pgbouncer_logs=6`; filtro textual `error/fatal/panic` sobre `event_message` devolvió 0. No equivale a ausencia universal de fallos.

## Fuente, discrepancias y límites

- Fuente nativa histórica Site v53: commit `5be977154cc15c9511787d22e28b7367e6f00467`, **122 pruebas de servidor aprobadas históricamente** sobre worktree. No se sustituyó código. La v54 se conserva sin activarla por estos resultados.
- Referencia histórica de v58 y dos URLs de Site (`agente-ricardo-revision-rick.rick271711.chatgpt.site` y `agente-ricardo-revision-rick.glassybell1025.chatgpt.site`). El cron SQL apunta a la segunda. **No hubo acceso nativo de administración de Sites en esta ejecución** para verificar versión desplegada, alias y código activo; fallo del navegador conectado por falta de contexto de extensión no prueba que la fuente nativa sea inaccesible.
- `AGENTS.md` fija Alma=Química/Farmacia y Lía=Mercadeo. Una nota histórica del tablero las etiqueta de otra forma; no se cambió identidad, especialidad ni recibo, pendiente cotejo nativo.
- No se realizaron pruebas dinámicas aisladas nuevas ni llamadas sintéticas nuevas. No hay evidencia nueva de fabricación/entrega `done` ni de cliente real.

## Pendientes para validación final

1. Acceso nativo de Sites para cotejar despliegue efectivo, fuente, alias, runner y recibos de una misma orden.
2. Pruebas dinámicas aisladas de concurrencia, locks, reintentos, idempotencia, pausas, recuperación y respeto de `not_before`, sin forzar tick ni cuota.
3. Investigar causa de cinco `network_error` y los HTTP 404 primario/respaldo; demostrar fallback real con evidencia segura.
4. Recibos E2E verificables de aprobación, fabricación, aprovisionamiento y entrega sintética; después aceptación con cliente real. No confundir pruebas analíticas `done` con E2E.

**Acciones:** lecturas de Supabase, logs, complemento Site, GitHub y respaldo; escritura de este informe de auditoría. No se cambiaron ejecutores, versiones, producción, triggers, cuota, `not_before`, trabajos, correos, pagos, cuentas o terceros. **Punto 4 permanece CERRADO PROVISIONALMENTE, SIN CERTIFICACIÓN.**
