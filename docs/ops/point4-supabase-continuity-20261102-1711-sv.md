# Fábrica IA — Punto 4 · Auditoría de continuidad (2026-11-02 17:11 SV)

**Estado rector:** CERRADO PROVISIONALMENTE, SIN CERTIFICACIÓN. Auditoría de solo lectura; no activar Site v54, no cambiar el Site vigente ni reabrir cierre por ausencia de cliente.

## Alcance y fuentes verificadas
- Site `appgprj_6adbf0c05a0c8191b2ca585b76f5e862`: consulta nativa de estado a través del complemento Fábrica de Agentes IA (no se obtuvo metadato de versión desplegada ni fuente nativa de Sites en este control).
- Supabase `udispwzwrebjkanudcoy`: SQL de solo lectura sobre `cron.job`, `cron.job_run_details`, `private.fabrica_scheduler_config`, `private.fabrica_scheduler_receipts`, índices y funciones; logs PostgreSQL (21:00–23:10 UTC).
- GitHub `Rick2818/Fabrica-de-Agentes-IA`: `AGENTS.md` y los siete archivos de `.github/workflows` leídos individualmente en `main`.
- Respaldo de pendientes Fábrica IA: comprobación de automatización existente, sin ejecutar ni modificar.

## Evidencia cron y conciliación
Corte SQL 2026-11-02 23:10:20 UTC (17:10:20 SV):
- Proyecto Supabase: `ACTIVE_HEALTHY`.
- Único job `fabrica-queue`: `jobid=1`, `* * * * *`, `active=true`. Configuración `enabled=true`, `not_before=NULL`, `last_error=NULL`.
- `cron.job_run_details`: 7,433 `succeeded`, cero con otro estado; último inicio 23:10:00 UTC. **Éxito SQL no demuestra `done`**.
- `private.fabrica_scheduler_receipts`: 6,690 filas, 6,684 `verified=true`, 6 `verified=false` históricas, cero `verified IS NULL`; cinco con `error_code` histórico. No se encontraron `cycle_id` duplicados ni recibos `verified=false` sin error vencidos más de 3 minutos.
- Últimos 90 minutos al primer corte: 89 `idle` y 1 aún sin estado (ciclo recién generado); cero `done` demostrados.
- Conciliación posterior 23:11:11 UTC: `e493ac3d-2055-4a5e-9cbe-3cf042efa792` (programado 23:10) y `9465160e-25d7-495d-9de6-d8fa6ac29008` (23:09) ambos `HTTP 200`, `verified=true`, `site_status=idle`, `error_code=NULL`. La conciliación no es fabricación ni entrega.
- Índices únicos existentes en recibos para `cycle_id` y `request_id`; funciones `private.fabrica_scheduler_tick` y `private.fabrica_scheduler_reconcile` presentes. Inspección estática: `tick` contiene lógica de advisory lock y `not_before`; `reconcile` contiene `not_before`, `verified`, `request_id`, HTTP y `error_code`. No se hicieron pruebas dinámicas de lock, reintento ni recuperación.
- Consulta de logs `postgres_logs` 21:00–23:10 UTC sin mensajes ERROR/FATAL; esto no prueba ausencia de errores fuera del intervalo.

## Site, cola, agentes y modelos
- Estado nativo del complemento: 65 trabajos: 60 `done`, 2 `failed` históricos, 3 `cancelled`; ninguno pendiente. Cuota 0/20, sin `deferred_until`; último ciclo Supabase `idle`, no `done`.
- Las prácticas sintéticas históricas de las seis especialidades no constituyen aceptación de cliente, fabricación ni entrega E2E.
- `AGENTS.md` vigente asigna Leo/Ventas, Mila/Servicio al cliente, Vera/Finanzas, Alma/Química y farmacia, Nico/Logística y Lía/Mercadeo. El resultado histórico del Site que asigna Alma/Mercadeo y Lía/Legal no coincide; no cambiar identidades sin cotejo con la fuente vigente.
- Últimos chequeos de modelos visibles, de **2026-10-29 22:58 UTC**: `gemini-2.5-flash` HTTP 404; `gemini-2.5-flash-lite` HTTP 404; tercero `gemini-3.5-flash-lite` HTTP 200 sintético. No se revalidaron modelos ni se alteró el proveedor.
- El estado del Site conserva un registro histórico de GitHub Actions `schedule` anterior a la migración; no es prueba de programación GitHub actual.

## GitHub y respaldo
- Los siete workflows de `main` fueron leídos; ninguno contiene trigger `schedule`. `agent-runner.yml` y diagnósticos solo `workflow_dispatch`; otros workflows de regresión admiten `push`, `pull_request` o manual, sin cron programado.
- Automatización de respaldo `6adbf94d28e8819189c0516c6068457a`: `is_enabled=true`, última ejecución registrada 2026-11-02 22:32:04 UTC, `completed`. La automatización de auditoría del punto 4 también sigue habilitada. Ninguna fue modificada.

## Pendientes sin aprobar
1. Cotejo **nativo** de fuente Site v53 recuperada (commit `5be977154cc15c9511787d22e28b7367e6f00467`, 122 pruebas de servidor históricas) con versión realmente desplegada; v54 guardada sin desplegar. No afirmar que GitHub `main` es el Site activo.
2. Pruebas dinámicas **aisladas** de bloqueo, reintentos, recuperación, continuidad/idempotencia y `not_before`, sin tocar cola real ni forzar `tick`.
3. Recuperación demostrada de Gemini primario y respaldo y conciliación de especialidades de los seis agentes.
4. Recibos verificables E2E de aprobación, fabricación, `agent.ready` y entrega para cliente sintético, separados de aceptación final del cliente real.
5. Aceptación final de cliente real cuando exista; **no certificada**.

**Intervenciones:** ninguna en Site, SQL, ejecutores, cron, cuotas, trabajos, credenciales, versiones ni canales externos. Solo este registro documental en GitHub. Sin evidencia de regresión operativa nueva en el intervalo consultado.
