# Fábrica de Agentes IA — Punto 4: continuidad, 2026-11-01 11:10 CST

**Estado rector:** CERRADO PROVISIONALMENTE, SIN CERTIFICACIÓN. Auditoría aislada de solo lectura. No es la estación 4 del diseño ni el issue #4.

## Corte, fuente y resultados

- Corte SQL consistente: **2026-11-01 17:10:27 UTC** (11:10:27 El Salvador). Proyecto Supabase `udispwzwrebjkanudcoy`.
- `cron.job`: jobid=1, `fabrica-queue`, `* * * * *`, `active=true`, `select private.fabrica_scheduler_tick();`. No se invocó manualmente.
- `cron.job_run_details`: **5,633** `succeeded`, **0** otros estados. El éxito SQL no acredita trabajo `done` ni entrega.
- `private.fabrica_scheduler_receipts`: **4,890** recibos; **4,884** `verified=true`; **5** `network_error` históricos, sin incremento. En los últimos 90 minutos: **89** `verified=true, site_status=idle`; **0** `verified=true, site_status=done`.
- Distribución histórica aproximada al corte: 9 recibos `done` verificados, 4 `waiting`, 2 `error`, 1 `busy`, 1 `quota`; los `done` históricos no son entregas nuevas ni certificación E2E.
- Último ciclo conciliado al corte: `29ac6b61-cfd9-46e9-bf33-675fca14bd91` (17:09 UTC), `verified=true`, `site_status=idle`, HTTP 200. Coincide con el ciclo previo del Site. El ciclo posterior `ab06d65d-ace8-49d2-a0c5-58b5c2522152` (17:10 UTC) figura como `idle` en `agent_status`, pero aún no estaba conciliado en SQL al corte: **pendiente, no aprobado**.
- **0** UUID `cycle_id` duplicados, **0** `request_id` duplicados, **0** recibos pendientes de cotejo con más de tres minutos. Índices únicos: `fabrica_scheduler_receipts_pkey(cycle_id)` y `fabrica_scheduler_receipts_request_id_key(request_id)`.
- `private.fabrica_scheduler_config`: `enabled=true`, `not_before=NULL`, `last_error=NULL`. La función SQL contiene `pg_try_advisory...`, `FOR UPDATE`, correlación `run_id` y `not_before`: inspección estática, no prueba dinámica.
- `agent_status` del Site: **60** trabajos `done`, **2** `failed` históricos, **3** `cancelled`, **0** pendientes. Cuota **0/20**. `health.supabase_runner` `idle` y `pending=0` con ciclo `ab06d65d-ace8-49d2-a0c5-58b5c2522152` de 17:10 UTC.
- Respaldo horario ChatGPT `6adbf94d28e8819189c0516c6068457a`: `is_enabled=true`; último `recorded_status=no_update` (última ejecución registrada 16:37 UTC). No equivale a procesamiento nuevo ni debe competir con el principal.
- `AGENTS.md` leído. Los **7** workflows de `.github/workflows` se leyeron individualmente; **ninguno** contiene un disparador `schedule:`. Hay `workflow_dispatch`, `push` y `pull_request`.
- Logs unificados Supabase, ventana **15:39–17:09 UTC**: 218 entradas `postgres_logs` y 6 `pgbouncer_logs`; el filtro textual de `event_message` no devolvió entradas con la cadena `ERROR`. Es un filtro limitado, no una prueba de ausencia universal de errores. Una consulta exploratoria de esta auditoría falló por usar `created_at` en vez de `checked_at`; se corrigió sin alterar datos.
- Los seis ejercicios `synthetic-six-20261028-{leo,mila,vera,alma,nico,lia}` se cotejaron individualmente: todos `done` con recibos de modelo, HTTP 200 y `context_mode=isolated`. Son ejercicios sintéticos de análisis, **no** fabricación ni entrega E2E.
- Modelos: `gemini-2.5-flash` y `gemini-2.5-flash-lite` tienen antecedentes HTTP 404; tercero `gemini-3.5-flash-lite` HTTP 200 en prueba sintética. No se ha demostrado recuperación real del fallback.
- La función SQL apunta a `https://agente-ricardo-revision-rick.glassybell1025.chatgpt.site`; una nota del Site registra v58 y `https://agente-ricardo-revision-rick.rick271711.chatgpt.site`. **No se dispone aquí de acceso nativo de administración de Sites para cotejar despliegue efectivo, fuente y alias; no afirmar discrepancia ni reparación.** La fuente original v53 recuperada (commit `5be977154cc15c9511787d22e28b7367e6f00467`, 122 pruebas históricas) permanece referencia; no se sobrescribió. La versión 54 no se activó.

## Pendientes para validación final

1. Cotejo nativo de Sites: versión desplegada, fuente activa, URL/alias, endpoint y recibos de fabricación/entrega. No confundir nota histórica con verificación actual.
2. Pruebas **dinámicas aisladas** de concurrencia, locks, reintentos, idempotencia, pausas, recuperación, `not_before` y fallback. Los chequeos estáticos no las aprueban.
3. Investigación causal de cinco `network_error` históricos y HTTP 404 de modelos primario y respaldo, sin consumir cuota o forzar ticks.
4. Evidencia E2E específica de aprobación, fabricación, aprovisionamiento y entrega, sin correos ni terceros; luego aceptación final por cliente real cuando exista.

**Acciones:** solo lecturas de GitHub, Supabase, tablero y logs, más este documento de auditoría. No se cambiaron ejecutores, disparadores, código de producción, Site, versiones, cuota, fechas, trabajos, pagos ni correos. Mantener el punto 4 cerrado provisionalmente, sin certificación.
