# Punto 4 — continuidad Supabase y auditoría de solo lectura — 2026-10-31 05:09 SV

## Estado rector
**CERRADO PROVISIONALMENTE, SIN CERTIFICACIÓN.** No existe cliente real para aceptación final; la ausencia de cliente no reabre el cierre administrativo. Exclusivamente Fábrica de Agentes IA, Site `appgprj_6adbf0c05a0c8191b2ca585b76f5e862`, Supabase `udispwzwrebjkanudcoy`. Esta revisión no altera runtime, cola, versiones, cuotas, programación ni ejecutores.

## Evidencia directa (31-10-2026, corte 11:09:44 UTC / 05:09:44 SV)
1. **Programación principal**: `cron.job` contiene `jobid=1`, `jobname=fabrica-queue`, `schedule=* * * * *`, `active=true`. `private.fabrica_scheduler_config`: `enabled=true`, `not_before=NULL`, `last_error=NULL`. La última ventana de dos horas tiene 120 ejecuciones `succeeded`. En el histórico, **3,832** ejecuciones SQL `succeeded`; la terminación de SQL no demuestra trabajo `done`.
2. **Recibos persistidos**: `private.fabrica_scheduler_receipts`: **3,094** filas, **3,089** `verified=true`, **9** `site_status=done` históricos, **4** `error_code=network_error` históricos. Estados al corte: 3,072 `idle`, 9 `done`, 4 `waiting`, 2 `error`, 1 `quota`, 1 `busy`, 5 sin `site_status`. Los cinco no verificados incluyen cuatro errores históricos y el ciclo reciente aún sin conciliar. **0** `cycle_id` duplicados, **0** `request_id` duplicados, **0** pendientes de conciliación con más de tres minutos. Índices únicos `fabrica_scheduler_receipts_pkey(cycle_id)` y `fabrica_scheduler_receipts_request_id_key(request_id)` presentes.
3. **Correlación Site–SQL**: UUID `179f1acb-a5ee-49c6-b69e-d2a9e039b047` (11:08 UTC) coincide con el ciclo `source=supabase-cron` observado en `agent_status` y fue conciliado a las 11:09 UTC con HTTP 200, `verified=true`, `site_status=idle`. El siguiente UUID `a8e5ba3d-95c5-4bb1-92a3-12e1f0ffa9bf` (11:09 UTC) aparece `idle` en el Site, pero tenía `checked_at=NULL` al corte: **conciliación pendiente**, no un fallo confirmado ni entrega.
4. **Estado operativo Site**: `agent_status` reporta `automation.enabled=true`, `health.autonomy.primary.recent=true`, `health.supabase_runner.status=idle`, `pending=0`, `next_at=NULL`; **60 trabajos `done`, 2 `failed` históricos, 3 `cancelled`, 0 pendientes/activos**. Uso de modelo **0/20**. `health.autonomy.backup.recent=false` solo refleja ausencia de ciclo reciente del respaldo en la ventana del Site, **no** una desactivación del respaldo.
5. **Respaldo horario**: `Automations.peek` confirma que `Respaldo de pendientes Fábrica IA` (`6adbf94d28e8819189c0516c6068457a`) sigue **habilitado**. Último intento registrado 11:04:39 UTC, `recorded_status=no_update`; no prueba entrega. No se ejecutó ni duplicó trabajo.
6. **GitHub**: `AGENTS.md` leído. Se leyeron individualmente los **7 workflows** actuales de `main` (`agent-runner`, `diagnostic-a/b/c`, `factory-regression`, `training-regression`, `verify-training`). **Ninguno** contiene `on.schedule`; disparadores manuales o de push/PR no equivalen a schedule.
7. **Integridad de funciones**: hashes MD5 sin cambios frente al control anterior: `private.fabrica_scheduler_tick=7fb25848caa91dc78eb0f469659f691d` y `private.fabrica_scheduler_reconcile=78a1057460b103ae1cddfb5d5e0339f0`. Identificadores comparativos, no prueba funcional.
8. **Logs**: ventana 09:00–11:09 UTC, 310 entradas `postgres_logs` y 6 `pgbouncer_logs`. En 10:00–11:10 UTC, el filtro por `ERROR`, `timeout` o `failed` sobre `event_message` no devolvió coincidencias; esto **no** excluye fallos fuera del filtro ni explica los cuatro `network_error` históricos.
9. **Modelos**: historial de pruebas sintéticas anterior (no repetidas): `gemini-2.5-flash` principal HTTP 404, `gemini-2.5-flash-lite` respaldo HTTP 404 y `gemini-3.5-flash-lite` tercero HTTP 200. La disponibilidad del tercero no certifica fallback automático de punta a punta.

## Comparación con control anterior (04:11 SV)
- SQL `succeeded`: **3,773 → 3,832** (+59).
- Recibos: **3,035 → 3,094** (+59); verificados **3,030 → 3,089** (+59).
- `done` histórico: **9 → 9**, sin entrega funcional nueva; errores `network_error`: **4 → 4**.
- Site: **60 done, 2 failed, 3 cancelled, 0 pendientes** sin cambios.

## Brechas explícitas, no aprobadas
- Comparación **nativa** de código y versión efectivamente desplegada del Site con la fuente v53 recuperada (commit `5be977154cc15c9511787d22e28b7367e6f00467`). El conector `agent_status` informa estado operativo pero no expone código nativo desplegado; la herramienta de acceso nativo Sites no estuvo disponible en esta ejecución. Las **122 pruebas** previas de servidor en worktree v53 no prueban identidad de producción. **No desplegar v54 guardada** por estos resultados.
- Pruebas dinámicas **aisladas** de concurrencia, locks, idempotencia, pausas, `not_before`, reintentos, recuperación persistente y fallback; **no realizadas**. No forzar tick ni alterar fechas/cuota para aparentar progreso.
- Causa raíz de cuatro `network_error` históricos; no acreditada.
- Prueba E2E con recibos por cada uno de los **seis agentes** y autonomía funcional comprobada, separando pruebas sintéticas de aceptación del cliente. **Pendiente**.
- Aceptación final con cliente real. **Pendiente; cierre provisional intacto**.

## Acciones y límites
Solo lecturas a Supabase, Site y GitHub, y consulta del respaldo. Se crea este documento como evidencia durable; **ningún cambio a producción, ejecutores, horarios, cuotas, datos, versiones, tareas ni contactos externos**. No se detectó regresión nueva que requiera intervención inmediata. Los ciclos `idle` y los SQL verdes no son certificación.
