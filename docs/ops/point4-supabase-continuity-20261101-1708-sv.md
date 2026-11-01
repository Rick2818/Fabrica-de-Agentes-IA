# Fábrica IA — Punto 4: continuidad Supabase/Site — 2026-11-01 17:08 CST

## Alcance y decisión rectora
Punto 4 **CERRADO PROVISIONALMENTE, SIN CERTIFICACIÓN** (instrucción 2026-10-29). Auditoría de solo lectura; no crear ejecutores, no disparar ticks, no alterar cuota, `not_before`, trabajos, fuentes, versiones, despliegues ni cuentas de terceros. No confundir este punto con estación 4 o issue #4. Fuente original de Site asociada a v53: commit `5be977154cc15c9511787d22e28b7367e6f00467`, 122 pruebas de servidor previamente aprobadas; no se repitieron hoy. v54 guardada sin activación por esta auditoría.

## Observaciones directas (corte SQL 2026-11-01 23:07 UTC)
- Proyecto Supabase `udispwzwrebjkanudcoy`: `ACTIVE_HEALTHY`.
- `cron.job`: un trabajo `fabrica-queue` (`jobid=1`), `* * * * *`, `active=true`, comando `select private.fabrica_scheduler_tick();`. `private.fabrica_scheduler_config`: `enabled=true`, `not_before=null`, `last_error=null`.
- `cron.job_run_details`: **5,990** ejecuciones; **5,990** `succeeded`; 90 ejecuciones en últimos 90 minutos. Éxito SQL no significa trabajo de agente `done`.
- `private.fabrica_scheduler_receipts`: **5,247** filas; **5,241** `verified=true`, seis no verificadas (cinco `network_error` históricos y una pendiente al corte); **5,224** `idle` verificados y **nueve** `done` verificados (acumulados). En ventana de 90 minutos: 90 filas, 89 `idle` verificados, cero `done` y cero errores nuevos.
- Integridad: cero UUID de ciclo duplicados, cero recibos verificados con HTTP distinto de 200, cero verificados sin `site_status`, cero sin cotejar vencidos más de tres minutos. Índices únicos en `cycle_id` y `request_id`.
- Conciliado: `f32019d3-e2c5-48a1-a75b-7df9c39481a8`, programado 23:06 UTC, comprobado 23:07 UTC, HTTP 200, `verified=true`, `site_status=idle`. El ciclo `4171a965-df5c-4b69-80ef-8eed9f57bb54` de 23:07 UTC aparecía `idle` en recibo del Site pero **sin cotejo SQL** al corte; no se aprueba. En lectura posterior, ciclo `f9988078-b0d3-442d-80f1-a5eadf0ac3d1` de 23:08 UTC aparece `idle` en Site, pendiente de conciliación SQL al momento de la lectura.
- Inspección estática: `private.fabrica_scheduler_tick` incluye referencia a `not_before` y `pg_try_advisory...`; `private.fabrica_scheduler_reconcile` incluye `not_before`. Esto no equivale a prueba dinámica de exclusión, pausas, idempotencia o recuperación.
- Logs Supabase consultados entre 21:30 y 23:07 UTC: 232 registros `postgres_logs`, seis `pgbouncer_logs`; filtro de `event_message` con `error`/`fatal` no devolvió coincidencias. No equivale a demostrar ausencia de fallos en otras fuentes/campos.

## Site y GitHub
- Conector del Site: 60 jobs `done`, dos `failed` históricos, tres `cancelled`, **cero pendientes**, `stalled=false`, cuota 0/20. Ciclos recientes con `source=supabase-cron`, `status=idle` y UUID concordante. Los 60 `done` históricos del Site no equivalen a 60 recibos `done` del cron.
- Seis prácticas históricas de Leo (Ventas), Mila (Servicio), Vera (Finanzas), Alma (Química/farmacia), Nico (Logística) y Lía (Mercadeo): `done` con evidencia de modelo, `execution_source=supabase-cron`, `context_mode=isolated`; no se generaron prácticas nuevas en este control. No son recibos de fabricación/entrega/aceptación.
- `AGENTS.md` leído desde `main`; identidades canónicas confirmadas. Los documentos históricos del issue #4 que intercambian Alma/Lía no corrigen `AGENTS.md`.
- Se leyeron los siete YAML de `.github/workflows` en `main`: **ninguno tiene `schedule:`**. `agent-runner.yml` solo `workflow_dispatch`; otros admiten push/PR/manual según archivo, sin cron GitHub.
- Automatizaciones: principal auditor Punto 4 y respaldo horario de pendientes **ambos habilitados** (consulta a Automations); no se modificaron. El último registro de respaldo no demuestra entrega nueva.
- Estado del despliegue exacto y fuente **actual** del Site: no se pudo cotejar mediante interfaz nativa de Sites en esta ejecución; el conector de estado no expone esa operación. Nota histórica del Site menciona v58, pero no se toma como verificación fresca de despliegue. No activar v54 ni sustituir fuente vigente.

## Bloqueos y gates de validación
1. Ejecutar **en entorno aislado**, sin afectar cola real, pruebas dinámicas de lock/concurrencia, recuperación tras caída, reintentos, idempotencia, pausas y respeto de `not_before`; guardar recibos por caso.
2. Verificar nativamente el SHA/versión desplegada del Site y sus URL vigentes, contrastándolo con la fuente original recuperada; preservar audiencia, datos y trabajos.
3. Modelos: comprobación histórica en Site: `gemini-2.5-flash` primario HTTP404 y `gemini-2.5-flash-lite` respaldo HTTP404; tercer modelo tuvo HTTP200 en prueba sintética. No declarar recuperados los dos primeros ni confundir fallback simulado con incidente real resuelto.
4. Requerir recibos independientes de aprobación, fabricación, cabina y entrega E2E antes de afirmar recorrido funcional; la aceptación final con cliente real sigue pendiente. No trasladar el bloqueo del pedido #4 del punto 5 a una reapertura administrativa del punto 4.
5. No declarar SLA 24/7 ni certificación por `cron succeeded`, HTTP200, `idle`, `done` de texto o pruebas locales.

## Cambios de este control
**Solo documentación durable**. No hubo cambios en ejecutores, código, producción, cron, disparadores, modelos, cuotas, fechas, jobs, correos, pagos ni versiones. No se encontró regresión operativa nueva que justifique intervención inmediata.
