# Fábrica de Agentes IA — Punto 4 — Control 2026-11-01 07:11 (El Salvador)

**Estado rector:** CERRADO PROVISIONALMENTE, SIN CERTIFICACIÓN. Auditoría de solo lectura en producción; la única escritura de este control es este informe en GitHub. No constituye aceptación de cliente ni prueba E2E de fabricación/entrega.

## Evidencia consultada directamente

- Supabase proyecto `udispwzwrebjkanudcoy`: `cron.job`, `cron.job_run_details`, `private.fabrica_scheduler_config`, `private.fabrica_scheduler_receipts`, índices y funciones SQL; logs unificados de PostgreSQL.
- Complemento nativo Fábrica IA: `agent_status` con cola, último ciclo programado, estado del runner, cuota y comprobaciones históricas de modelos.
- GitHub `Rick2818/Fabrica-de-Agentes-IA`: `AGENTS.md`, los siete workflows vigentes en `main` y reporte anterior de las 06:13.
- **No se dispuso en esta ejecución de una operación nativa de lectura del código/despliegue de ChatGPT Sites**; no se deduce versión desplegada a partir del navegador o de notas históricas. Tampoco se reconsultó el estado actual del respaldo horario; la última comprobación del reporte anterior no se reinterpreta como verificación nueva.

## Resultados verificables

1. Corte SQL: `2026-11-01 13:11:00 UTC` (07:11 El Salvador). `cron.job` tiene un único `fabrica-queue`, `jobid=1`, `active=true`, `schedule=* * * * *`, comando `select private.fabrica_scheduler_tick();`.
2. `cron.job_run_details`: **5,394** ejecuciones `succeeded`, **0** de otro estado. Respecto a las 06:13: +59. Esto solo prueba ejecución SQL.
3. `private.fabrica_scheduler_receipts`: **4,651** recibos, **4,645** verificados, **5** `network_error` históricos, **9** `site_status=done` históricos. En 90 minutos: **90** recibos, **89** verificados, **0** `done`. Diferencia de SQL y recibos no se cuenta como trabajo procesado.
4. `private.fabrica_scheduler_config`: `enabled=true`, `not_before=null`, `last_error=null`; no hay pausa activa.
5. Último ciclo conciliado en la muestra: UUID `dfd5e6b8-b5a9-4c72-951e-a7562533bdab`, `request_id=4651`, `scheduled_at=13:10:00 UTC`, `checked_at=13:11:00 UTC`, HTTP 200, `verified=true`, `site_status=idle`; no representa entrega. Ciclo siguiente `1d46e15b-e01c-4b37-b717-1a8acfa439f8` con `request_id=4652` y `scheduled_at=13:11:00 UTC`: `agent_status` confirmó `source=supabase-cron`, `status=idle`, mismo UUID; la consulta SQL todavía mostraba `checked_at=null`, `verified=false`. **Pendiente de conciliación al corte**, no aprobado.
6. No hay recibos sin comprobar vencidos >3 minutos sin error, ni UUID duplicados ni `request_id` duplicados. Existen índices únicos para ambos campos.
7. Inspección estática: `fabrica_scheduler_tick` contiene `pg_try_advisory_xact_lock`, `FOR UPDATE`, `not_before` y `cycle_id`; `fabrica_scheduler_reconcile` contiene `not_before` y `cycle_id`. No sustituye pruebas dinámicas de carrera, lease, idempotencia, reintento o recuperación.
8. Complemento Site: **65 trabajos históricos** (60 `done`, 2 `failed`, 3 `cancelled`), 0 pendientes; cuota 0/20; último ciclo programado `idle`. Los 60 `done` son respuestas/trabajos de cola, no agentes fabricados y entregados.
9. Siete workflows GitHub leídos individualmente: `agent-runner.yml`, `diagnostic-a-scheduler.yml`, `diagnostic-b-conditions.yml`, `diagnostic-c-actor.yml`, `factory-regression.yml`, `training-regression.yml`, `verify-training.yml`. **Ninguno declara `schedule`**; `agent-runner.yml` solo `workflow_dispatch`. No se infiere ejecución programada de GitHub.
10. Logs unificados 12:00–13:10 UTC: 168 registros `postgres_logs`, 3 `pgbouncer_logs`; consulta filtrada por `error`/`fatal`/`warning` en mensajes PostgreSQL: 0 coincidencias. La ausencia de coincidencias no excluye problemas en servicios no cubiertos.
11. `AGENTS.md` leído: exige conservar Site y datos, ejecutar pruebas antes de editar runtime y distinguir ejecuciones manuales/programadas.
12. Comprobaciones de modelos en `agent_status` siguen siendo **históricas**: `gemini-2.5-flash` y `gemini-2.5-flash-lite` HTTP 404; tercer `gemini-3.5-flash-lite` HTTP 200 con texto sintético. No hubo nueva prueba real ni recuperación de los dos primeros acreditada.

## Pendientes para validación final

- Acceso **nativo** al Site `appgprj_6adbf0c05a0c8191b2ca585b76f5e862` para cotejar el despliegue efectivo con la fuente recuperada asociada a v53 (commit nativo `5be977154cc15c9511787d22e28b7367e6f00467`, 122 pruebas históricas). No activar v54 guardada ni sobrescribir el Site con código antiguo. Notas históricas sobre v58 no acreditan por sí solas el despliegue actual.
- Pruebas dinámicas **aisladas** de concurrencia/locks, idempotencia, lease, pausas, `not_before`, reintentos, recuperación, fallback y continuidad de los seis agentes, sin alterar producción ni cuota.
- Diagnóstico causal de los cinco errores históricos de red y validación de recuperación de los dos modelos Gemini con HTTP 404.
- Recibos E2E correlacionados de aprobación, fabricación, cabina privada y entrega; prácticas sintéticas no equivalen a aceptación real.
- Aceptación final con cliente real cuando exista. Su ausencia **no reabre** el cierre administrativo provisional.

## Cambios

Ningún tick manual, ejecutor adicional, trigger, modificación de trabajos, cuota, `not_before`, modelos, secretos, despliegue, versión, correo, pago ni contacto. Se preservan principal y respaldo. **Única escritura:** este documento de evidencia.
