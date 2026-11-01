# Punto 4 — continuidad Supabase (2026-11-01 05:14 SV)

**Estado rector:** CERRADO PROVISIONALMENTE, SIN CERTIFICACIÓN. Auditoría de lectura, sin ejecutar tick, sin crear tareas ni otro cron, sin alterar producción, cuota, fechas, Site ni ejecutores. No confundir punto 4 con estación 4 ni issue #4.

## Evidencia comprobada en esta revisión

- Corte DB **2026-11-01 11:14:02 UTC (05:14:02 El Salvador)**. Proyecto Supabase `udispwzwrebjkanudcoy`.
- `cron.job`: único job `fabrica-queue` (jobid 1), `active=true`, programación `* * * * *`; comando `select private.fabrica_scheduler_tick();`.
- `cron.job_run_details`: **5,277** ejecuciones SQL `succeeded`, cero fallidas históricas según este job; 90 SQL `succeeded` en los últimos 90 minutos al primer corte. **SQL succeeded no equivale a entrega.**
- `private.fabrica_scheduler_receipts`: **4,534** recibos, **4,528** `verified=true`, seis sin verificar (cinco errores `network_error` históricos y un ciclo reciente pendiente). Nueve estados históricos `done` (último el 29 de octubre). En 90 minutos previos al primer corte: 90 recibos, 89 `idle` verificados, cero `done`.
- Ciclo `2dfe8680-7b14-4dec-961a-e0a24c50b8fd` (11:13 UTC) figura en `agent_status.health.supabase_runner` con `source=supabase-cron`, `status=idle`, y en SQL quedó conciliado a las 11:14:00 UTC con HTTP 200, `verified=true`, `site_status=idle`, `error_code=null`. No acredita una entrega.
- Ciclo `15ff36e7-0096-4532-b8ee-a9878e0c99ed` (11:14 UTC) aún estaba sin `checked_at` en el corte 11:14:02 UTC; no se marca verificado. Cero conciliaciones pendientes con más de tres minutos de antigüedad y sin código de error.
- `private.fabrica_scheduler_config`: `enabled=true`, `not_before=null`, `last_error=null`. Cinco `network_error` históricos, sin nuevos errores. Cero UUID duplicados y cero `request_id` duplicados. Índices únicos de ciclo y request presentes.
- Definiciones SQL inspeccionadas: `fabrica_scheduler_tick` usa `pg_try_advisory_xact_lock`, `FOR UPDATE`, espera por recibos pendientes, `not_before`, validación de credenciales; `fabrica_scheduler_reconcile` verifica `run_id`, `scheduled_at`, fuente y estado del recibo, pausa cinco minutos tras error. **Inspección estática; no se ejecutaron pruebas de carrera, reintento ni falla artificial.**
- `agent_status`: 65 trabajos, **60 done, 2 failed históricos, 3 cancelled, 0 pendientes**, cuota **0/20**. Seis ejercicios sintéticos anteriores `done`; no representan aprobación/fabricación/entrega ni aceptación de cliente. `health.autonomy.primary` señala cron Supabase reciente. El histórico `health.cloud_runner` de GitHub no demuestra programación GitHub vigente.
- Automación de respaldo `6adbf94d28e8819189c0516c6068457a`: `is_enabled=true`, última ejecución registrada 2026-11-01 11:07:31–11:07:33 UTC, `recorded_status=no_update`, `latest_result=null`. No se presume `requires_user_action` ni se ejecuta respaldo desde esta auditoría.
- `AGENTS.md` leído. Los siete workflows YAML actuales de `main` fueron inspeccionados individualmente: **ninguno contiene `schedule:`**. `agent-runner.yml` conserva `workflow_dispatch`; otros tienen `push`/`pull_request` para pruebas, no cron.
- Logs Supabase en ventana 2026-11-01 05:15–11:15 UTC: 865 `postgres_logs`, 18 `pgbouncer_logs` en primera consulta; filtro de `error:`, `timeout`, `fatal` en `postgres_logs.event_message` devolvió 0. Filtro y ventana limitados; no prueba ausencia universal de errores.

## Cotejo Site / fuente pendiente

- Fuente original asociada a Site v53 recuperada anteriormente: commit nativo `5be977154cc15c9511787d22e28b7367e6f00467`, **122 pruebas de servidor aprobadas en worktree anterior**. No se repitieron ni se cotejó nativamente el SHA del despliegue efectivo en este control.
- La instrucción rectora mantiene **v54 guardada sin activar**. Las notas persistentes del conector mencionan un despliegue **v58** del 29-10-2026 y una URL diferente de la usada por el cron. Esto es información histórica, no comprobación nativa de versión o audiencia actuales. Se requiere verificar por Sites el proyecto `appgprj_6adbf0c05a0c8191b2ca585b76f5e862`, versión efectiva y ruta de `/internal/runner` antes de concluir que hay discrepancia operativa o modificar endpoints. El recibo cron correlacionado prueba respuesta del runner actual, no SHA del despliegue.
- Los modelos Gemini 2.5 Flash y 2.5 Flash Lite tienen pruebas históricas HTTP 404; tercera alternativa con HTTP 200 histórico. No se hicieron llamadas nuevas ni se presume recuperación.

## Pendientes sin aprobar

Cotejo nativo de Sites y despliegue; pruebas dinámicas aisladas de concurrencia, lock, idempotencia, pausa, `not_before`, reanudación y fallback; diagnóstico causal de cinco errores históricos de transporte; recibos E2E de aprobación, fabricación, aislamiento, entrega y aceptación real del cliente. No marcar pendientes como aprobados. No se detectó regresión nueva comprobada que justifique tocar producción. Mantener ejecutor principal y respaldo intactos.
