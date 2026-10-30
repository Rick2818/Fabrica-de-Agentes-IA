# Fábrica de Agentes IA — Punto 4 — control de continuidad
**Corte:** 2026-10-30, 12:08 America/El_Salvador (18:08 UTC, aproximadamente).
**Decisión rectora:** CERRADO PROVISIONALMENTE, SIN CERTIFICACIÓN. Este control no reabre el cierre ni acredita aceptación real.

## Evidencia consultada directamente, solo lectura

- **Supabase proyecto** `udispwzwrebjkanudcoy`, ACTIVE_HEALTHY. `cron.job`: jobid=1, `fabrica-queue`, expresión `* * * * *`, `active=true`, comando `select private.fabrica_scheduler_tick();`. No se invocó el tick.
- **`cron.job_run_details`:** 2,810 ejecuciones del job, 2,810 con estado SQL `succeeded`, ninguna con otro estado; último inicio 2026-10-30 18:07:00.032397+00 y final 18:07:00.042759+00. **Esto demuestra éxito SQL, no entrega funcional.**
- **`private.fabrica_scheduler_receipts`:** 2,072 recibos y 2,072 UUID de ciclo distintos; 2,067 `verified=true`, cinco no verificados, 2,050 `site_status=idle`, nueve `verified=true AND site_status=done`, cuatro `error_code=network_error` históricos (primer evento 2026-10-30 00:38 UTC; último 05:54 UTC). Cuatro no verificados de más de dos minutos corresponden a esos errores históricos, no a nuevos trabajos pendientes. No se observó nuevo `done` frente al corte anterior.
- **Correlación del ciclo más reciente:** UUID `e05e0109-db85-4d1e-b409-06b279de1c5d`, programado 18:07:00.039+00. En el momento de la consulta SQL, `checked_at/http_status/site_status` aún eran nulos y `verified=false`; en la lectura independiente del Site, `health.supabase_runner.supabase.run_id` coincidió exactamente con ese UUID y `health.autonomy.primary.last_cycle.status=idle`, con inicio/fin del Site. **No se atribuye `verified=true` antes de la conciliación SQL.** El ciclo anterior `f808ef15-f01e-4fd9-91d7-3c6f744ea358` sí figuró `verified=true`, HTTP200 y `idle`.
- **Configuración:** `private.fabrica_scheduler_config` con `enabled=true`, `not_before=NULL`, `last_error=NULL`. Índices únicos presentes para `cycle_id` (PK) y `request_id`. Hash MD5 de funciones sin cambio respecto al control anterior: `fabrica_scheduler_tick=7fb25848caa91dc78eb0f469659f691d`; `fabrica_scheduler_reconcile=78a1057460b103ae1cddfb5d5e0339f0`. La definición del tick menciona bloqueo advisory y `not_before`; la reconciliación menciona `not_before`. **Presencia de código/índices no equivale a prueba dinámica de concurrencia, reintento ni idempotencia.**
- **Site original vía complemento conectado:** 65 encargos: 60 `done`, dos `failed` históricos y tres `cancelled`; cero pendientes, cero leases activos, sin reintentos en cola. Uso 0/20. `automation.enabled=true`, `health.autonomy.status=recent`, primario `supabase:udispwzwrebjkanudcoy:fabrica-queue`, último ciclo `idle`, sin `next_run_at` ni `deferred_until` actual. `done` histórico de un encargo no prueba fabricación ni aceptación de cliente.
- **Logs unificados Supabase:** en ventana 2026-10-30 17:08–18:08 UTC se contaron 144 `postgres_logs` y tres `pgbouncer_logs`; no se observó fuente de trazas del runtime del Site en esa agrupación. Los cuatro `network_error` históricos no tienen causa raíz demostrada por estos logs.
- **GitHub `main` y `AGENTS.md`:** se leyeron los siete workflows: `agent-runner.yml`, `diagnostic-a-scheduler.yml`, `diagnostic-b-conditions.yml`, `diagnostic-c-actor.yml`, `factory-regression.yml`, `training-regression.yml`, `verify-training.yml`. **Ninguno contiene disparador `schedule`**; `workflow_dispatch` y eventos CI no acreditan ejecución cron. `AGENTS.md` exige preservar el Site y distinguir ejecución manual de programada.
- **Respaldo existente:** `Respaldo de pendientes Fábrica IA` (ID `6adbf94d28e8819189c0516c6068457a`) consultado con Automations.peek: `is_enabled=true`; último run registrado `e9fe9865-a5c8-832b-86c8-8c4dffa58b43`, estado `no_update`, inicio 2026-10-30 17:18:22.658316Z, fin 17:18:23.145164Z. Sin `latest_result` correlacionable: no inferir ejecución de cola ni entrega.
- **Modelos:** estado histórico de pruebas sintéticas del Site: primario `gemini-2.5-flash` HTTP404, respaldo `gemini-2.5-flash-lite` HTTP404, tercero `gemini-3.5-flash-lite` HTTP200. No hubo prueba nueva de fallback completo ni se atribuye éxito funcional por HTTP200.
- **Fuente nativa:** se preserva como antecedente el commit Site v53 `5be977154cc15c9511787d22e28b7367e6f00467` y las 122 pruebas históricas aprobadas en worktree. No se dispuso en este control de una herramienta nativa de Sites para comparar el despliegue actualmente servido con esa fuente; **no afirmar comparación nueva**. v54 permanece sin activar conforme a la instrucción rectora.

## Pendientes sin aprobación ni certificación

1. Diagnóstico causal con trazas internas del Site de los cuatro `network_error`/timeouts.
2. Pruebas sintéticas aisladas y dinámicas de concurrencia, locks, reintentos, idempotencia, pausa, recuperación y respeto de `not_before`; no alterar cuotas ni fechas de trabajos reales.
3. Recorrido sintético E2E con recibo de procesamiento `done` y UUID correlacionado; distinguirlo de la aceptación de cliente.
4. Fallback E2E funcional con evidencia de modelo seleccionado y respuesta final; no inferirlo de HTTP200.
5. Comparación nativa entre fuente y versión efectivamente desplegada del Site, sin desplegar v54 ni reemplazar fuente.
6. Validación y aceptación de un cliente real, cuando exista.

**Acciones:** solo lecturas de Supabase, GitHub, Site y Automations. Sin escrituras SQL, sin ticks forzados, sin nuevos ejecutores, sin modificación de Site/producción, sin contactos, pagos ni gastos. Este documento es el único registro durable nuevo de la auditoría. No se encontró una regresión nueva comprobada que justifique cambiar el runtime.

**Resultado:** PUNTO 4 CERRADO PROVISIONALMENTE, SIN CERTIFICACIÓN.
