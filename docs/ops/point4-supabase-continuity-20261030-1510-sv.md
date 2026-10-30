# Fábrica de Agentes IA — Punto 4 — control de continuidad (solo lectura)
**Corte de datos:** 2026-10-30 15:10:16 America/El_Salvador (21:10:16 UTC).
**Estado rector:** CERRADO PROVISIONALMENTE, SIN CERTIFICACIÓN. La ausencia de cliente real no reabre el cierre administrativo. No confundir con estación visual 4 ni GitHub issue #4.

## Evidencia obtenida en este control
- **Supabase Cron:** proyecto `udispwzwrebjkanudcoy`, un job principal `cron.job`: `jobid=1`, `fabrica-queue`, `* * * * *`, `active=true`, `select private.fabrica_scheduler_tick();`. Configuración `enabled=true`, `not_before=NULL`, `last_error=NULL`. Se consultó, no se ejecutó tick manual.
- **Cron SQL:** 2,993 ejecuciones `succeeded` (última 21:10:00 UTC), +63 desde el corte de las 14:07. El resultado SQL exitoso NO equivale a trabajo de Site `done`.
- **Recibos SQL:** 2,255 filas, 2,255 UUID de ciclo únicos y 2,255 `request_id` únicos, 2,250 `verified=true`, 9 `verified AND site_status='done'` históricos, 2,233 `idle`, 4 `waiting`, 2 `error`, 1 `quota`, 1 `busy`, 5 con `site_status=NULL`. 65 recibos durante últimos 65 minutos. 4 `network_error` históricos no verificados y 1 recibo reciente sin conciliar; 4 sin verificar con más de dos minutos, todos incidentes históricos. No hay nuevos errores de transporte observados.
- **Conciliación:** el UUID `2ec283b9-d85c-4a4e-b1ec-8348814ae14c` (21:09 UTC) está `verified=true`, HTTP200, `site_status=idle` en SQL y coincide con ciclo `idle` en `health.autonomy.cycles` del Site. El UUID más reciente `e937964f-1681-4418-aa27-f587a7c0116a` (21:10 UTC) coincide con el ciclo Site `idle`, pero `checked_at=NULL` y `verified=false` en SQL al corte. Ninguno equivale a entrega nueva `done`.
- **Site vía complemento nativo Fábrica:** 65 trabajos: 60 `done`, 2 `failed`, 3 `cancelled`; cero pendientes. Sin leases activos ni reintentos vencidos. `health.supabase_runner.status=idle`, `health.autonomy.status=recent`, `automation.enabled=true`, `usage=0/20`, `next_run_at=NULL`. No se creó trabajo ni se ejecutó prueba sintética nueva.
- **Respaldo horario:** automatización `Respaldo de pendientes Fábrica IA` `6adbf94d28e8819189c0516c6068457a` habilitada; último run registrado `8f8c702a-a810-8326-8965-b1c6a952634c`, estado `no_update`, 20:18:40–20:18:42 UTC, sin `latest_result`. No inferir procesamiento real de ese estado.
- **GitHub:** `AGENTS.md` leído. Siete archivos YAML de `main` inspeccionados individualmente; cero `on.schedule`: `agent-runner.yml`, `diagnostic-a-scheduler.yml`, `diagnostic-b-conditions.yml`, `diagnostic-c-actor.yml`, `factory-regression.yml`, `training-regression.yml`, `verify-training.yml`. `agent-runner.yml` solo `workflow_dispatch`; los demás usan eventos manuales o push/PR según corresponda.
- **Integridad SQL:** índices únicos `fabrica_scheduler_receipts_pkey(cycle_id)` y `fabrica_scheduler_receipts_request_id_key(request_id)`. Hash de `private.fabrica_scheduler_tick` `7fb25848caa91dc78eb0f469659f691d`; hash de `private.fabrica_scheduler_reconcile` `78a1057460b103ae1cddfb5d5e0339f0`; iguales al control anterior. La inspección estática de `tick` detecta `pg_try_advisory_xact_lock` y `not_before`; `reconcile` referencia `not_before`, `verified`, `request_id` y `network_error`. No es prueba dinámica de bloqueo, recuperación o idempotencia.
- **Logs:** consulta de 20:05 a 21:10 UTC: 156 `postgres_logs`, 3 `pgbouncer_logs`; sin `function_edge_logs` ni trazas internas de Site en el resumen. Causa raíz de los cuatro `network_error` históricos no demostrada.
- **Modelos:** permanecen los resultados sintéticos históricos: primario `gemini-2.5-flash` HTTP404, respaldo `gemini-2.5-flash-lite` HTTP404, tercero `gemini-3.5-flash-lite` HTTP200. No hubo nuevo ensayo ni se certificó fallback E2E.
- **Fuente Site:** antecedente rector: fuente original v53 recuperada, commit `5be977154cc15c9511787d22e28b7367e6f00467`, 122 pruebas de servidor previamente aprobadas. No se obtuvo acceso nativo de Sites al código del despliegue vigente en este control; no se realizó comparación ni despliegue. La instrucción sobre v54 guardada sin desplegar se conserva sin reinterpretarla.

## Pendientes, no aprobados
1. Diagnóstico causal de los cuatro timeouts con trazas internas de Site.
2. Pruebas dinámicas aisladas de concurrencia, locks, idempotencia, pausas, reintentos, recuperación y respeto de `not_before`.
3. Prueba E2E sintética con `done` real y recibos de Site y Supabase correlacionados por UUID, separada de aceptación del cliente.
4. Fallback E2E verificando modelo efectivo de respuesta, no solo HTTP200.
5. Comparación nativa del código Site desplegado con la fuente v53, sin sustituir código ni activar v54.
6. Aceptación final con cliente real cuando exista.

**Intervención:** lecturas de Supabase, complemento Fábrica, GitHub y Automations, más este documento de evidencia. Sin SQL de escritura, cambios de código, cron manual, ejecución de cola, nuevos ejecutores, modificación de cuotas/fechas, despliegues, correos, terceros o pagos. No se ha demostrado regresión nueva. **Punto 4: CERRADO PROVISIONALMENTE, SIN CERTIFICACIÓN.**
