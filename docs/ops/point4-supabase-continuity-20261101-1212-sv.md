# Fábrica de Agentes IA — Punto 4: continuidad, 2026-11-01 12:12 CST

**Estado rector:** CERRADO PROVISIONALMENTE, SIN CERTIFICACIÓN. Auditoría de solo lectura, sin crear ni ejecutar un segundo trabajador. No corresponde a la estación 4 del diseño ni al issue #4.

## Evidencia consultada

- Corte SQL principal: 2026-11-01 18:11–18:12 UTC (12:11–12:12 El Salvador). Supabase proyecto `udispwzwrebjkanudcoy`, estado del proyecto `ACTIVE_HEALTHY`.
- `cron.job`: único job `fabrica-queue`, id 1, `active=true`, expresión `* * * * *`, comando `select private.fabrica_scheduler_tick();`. No se invocó la función manualmente.
- `cron.job_run_details`: **5,694** `succeeded` acumulados y ningún otro estado; últimos 90 minutos: **90** `succeeded`. El resultado SQL `1 row` no prueba procesamiento `done`.
- `private.fabrica_scheduler_receipts`: **4,951** recibos, **4,945** `verified=true`, **5** errores históricos `network_error` (sin incremento), **0** UUID duplicados y **0** recibos pendientes de conciliación con más de tres minutos. Frente a la auditoría 11:10 CST: +61 ejecuciones SQL y +61 recibos verificados.
- Últimos 90 minutos de recibos: **89** `verified=true,site_status=idle`, **0** `done`, y **1** ciclo sin cotejo aún. El ciclo `53b3c05c-75ce-4d05-8956-8e276cfe9065` de 18:10 UTC quedó `verified=true`, HTTP 200, `site_status=idle`, `error_code=NULL`. El ciclo `cbfe1977-3b2b-499a-89d1-a102dfac4924` de 18:11 UTC figura `idle` en el tablero Site, pero en SQL estaba `checked_at=NULL,verified=false` al corte: **no aprobado aún**.
- `private.fabrica_scheduler_config`: `enabled=true`, `not_before=NULL`, `last_error=NULL`. El código vigente de `fabrica_scheduler_tick/reconcile` contiene advisory lock, `FOR UPDATE`, bloqueo de solicitudes concurrentes pendientes, validación de UUID y campos de recibo, reintentos por error y respeto de `not_before`. Inspección **estática**, no certificación dinámica.
- Índices únicos: `cycle_id` (PK) y `request_id`. Los cinco `network_error` históricos están fechados entre 2026-10-30 y 2026-10-31, sin errores de transporte nuevos detectados en este corte.
- Tablero real del Site mediante `agent_status`: **60** trabajos `done`, **2** `failed` históricos, **3** `cancelled`, **0** pendientes; cuota **0/20**; `health.supabase_runner` indica `idle`, `pending=0`, origen `supabase-cron`, mismo UUID de ciclo 18:11. Esto corrobora `idle` en el Site, pero no sustituye la conciliación SQL.
- Las seis prácticas históricas `synthetic-six-20261028-{leo,mila,vera,alma,nico,lia}` tienen `done`, recibos de modelo HTTP 200 y contexto aislado. Son ejercicios analíticos **sintéticos**, no recibos E2E de aprobación, fabricación, entrega o aceptación de cliente.
- Respaldo horario `6adbf94d28e8819189c0516c6068457a` consultado mediante Automations.peek: `is_enabled=true`, último `recorded_status=no_update`, ejecución 2026-11-01 17:52 UTC. No acredita entrega ni se invocó.
- `AGENTS.md` consultado en `main`. Los siete workflows GitHub se leyeron uno por uno: ninguno tiene `schedule`; `agent-runner.yml` mantiene `workflow_dispatch` únicamente. Otros workflows conservan disparadores `push` o `pull_request`, no programación automática del runner.
- Logs unificados Supabase consultados entre 16:10 y 18:10 UTC: fuentes `postgres_logs` (289) y `pgbouncer_logs` (6). Se observaron eventos de inicio y fin de cron. Filtro textual `error/fatal/panic` sobre `event_message` devolvió cero entradas; este filtro **no** demuestra ausencia universal de errores.
- Observación documental no operativa: `AGENTS.md` identifica Alma como Química/Farmacia y Lía como Mercadeo, mientras que un resultado histórico del tablero de entrenamiento asigna Alma a Mercadeo y Lía a Legal. No se cambiaron nombres, especialidades ni recibos; requiere cotejo con fuente activa antes de cualquier corrección.

## Fuente, versiones y límites

- Fuente original Site v53 recuperada: commit `5be977154cc15c9511787d22e28b7367e6f00467`, 122 pruebas de servidor aprobadas **históricamente**. No se reemplazó ni desplegó código.
- Nota histórica del Site registra v58, deployment `appgdep_6ae3cfc470ac819191fb9c00a7034887` y URL `https://agente-ricardo-revision-rick.rick271711.chatgpt.site`. El SQL y `agent-runner.yml` apuntan a `https://agente-ricardo-revision-rick.glassybell1025.chatgpt.site`. No existe en este entorno acceso nativo de administración de Sites para cotejar despliegue activo, alias y fuente: **no concluir discrepancia operativa** por las dos URL. La consulta al navegador conectado falló por ausencia de contexto de extensión; eso **no** implica que la fuente nativa sea inaccesible.
- Antecedentes de modelos en tablero: primario `gemini-2.5-flash` HTTP 404, respaldo `gemini-2.5-flash-lite` HTTP 404, tercero `gemini-3.5-flash-lite` HTTP 200 en prueba sintética. No se ejecutaron nuevas pruebas con proveedor ni se declaró fallback real validado.
- Versión 54 conservada sin activación por esta auditoría.

## Pendientes antes de validación final

1. Cotejo **nativo** de Sites: versión y fuente realmente activas, URLs/alias, endpoint runner, recibos del Site y vínculo de una misma orden.
2. Pruebas dinámicas **aisladas** de concurrencia, locks, reintentos, idempotencia, pausas, recuperación, `not_before` y fallback, sin forzar tick, modificar cuota o enviar correos.
3. Investigación causal de los cinco `network_error` históricos y de los HTTP 404 de los modelos primario y respaldo.
4. Recibos verificables E2E de aprobación, fabricación, aprovisionamiento y entrega sintética; posteriormente aceptación final de cliente real. No marcar pendientes como aprobados.

**Acciones:** lecturas de GitHub, Supabase, logs, tablero Site y estado del respaldo; creación de este informe durable. No se modificaron Site, runtime, versiones, producción, ejecutores, disparadores, cuota, fechas, trabajos, correos, pagos ni terceros. El punto 4 sigue **cerrado provisionalmente, sin certificación**.
