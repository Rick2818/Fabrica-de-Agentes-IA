# Fábrica IA — Punto 4 — auditoría de continuidad (2026-11-02 05:14, America/El_Salvador)

**Estado rector:** CERRADO PROVISIONALMENTE, SIN CERTIFICACIÓN. Auditoría solo lectura; no corresponde a la estación 4 ni al issue #4.

## Alcance y fuentes verificadas
- Supabase project `udispwzwrebjkanudcoy`: consultas directas de `cron.job`, `cron.job_run_details`, `private.fabrica_scheduler_config`, `private.fabrica_scheduler_receipts`, definiciones de funciones e índices. Corte estadístico aproximado 2026-11-02 11:13 UTC.
- Fábrica Site: lectura del estado mediante conector nativo de agente (`agent_status`), hora de respuesta 2026-11-02T11:13:20Z.
- GitHub `Rick2818/Fabrica-de-Agentes-IA`: lectura de `AGENTS.md` y de los siete YAML vigentes en `.github/workflows/`.
- Automatizaciones: lectura privada de estado de `Respaldo de pendientes Fábrica IA` y `Fábrica IA · Punto 4`, ambas habilitadas.

## Evidencia de ejecución
- Único job cron de Fábrica: `jobid=1`, `fabrica-queue`, `* * * * *`, `active=true`, comando `select private.fabrica_scheduler_tick();`.
- `cron.job_run_details`: 6,716 registros, 6,716 `succeeded`, último inicio 2026-11-02T11:13:00.317713Z. **Éxito SQL no equivale a trabajo procesado**.
- Instantánea de recibos: 5,973 filas, 5,967 `verified=true`, seis sin verificar; cinco errores históricos `network_error`, sin incremento observado; `site_status=idle` 5,950 y `site_status=done` nueve históricos. Los contadores son una instantánea y cambian minuto a minuto.
- Ventana móvil de 90 minutos: 90 recibos, 89 `verified=true + idle`, cero `done`, cero `error_code` y 90 UUID distintos. No acredita entregas nuevas.
- Conciliación concreta: UUID `17c59f82-bb6e-4e08-94ab-9bae0322c788`, programado 11:13:00.414Z, conciliado 11:14:00.03321Z, HTTP 200, `verified=true`, `site_status=idle`, `error_code=null`. Coincide con el ciclo `idle` reportado por el Site. UUID posterior `6e8329ac-8d37-4d92-9aeb-26ed17d9cb8c` (11:14:00.038Z) todavía sin conciliación SQL al corte: **no aprobado**.
- Cero UUID duplicados en tabla de recibos; cero recibos sin verificar con antigüedad mayor a tres minutos dentro del último día (consulta de corte). Índices únicos sobre `cycle_id` y `request_id`.
- Configuración: `enabled=true`, `not_before=null`, `last_error=null`. El código de `fabrica_scheduler_tick` usa advisory transaction lock, concilia antes de programar, respeta `not_before`, impide solapar solicitudes sin conciliar y mantiene credenciales en Vault. `fabrica_scheduler_reconcile` exige identidad de proyecto, schedule y UUID, valida estado y aplica diferimiento ante errores. **Inspección estática, no prueba dinámica de concurrencia ni recuperación**.
- Site: 60 trabajos `done`, dos `failed` históricos, tres `cancelled`, cero pendientes; cuota 0/20. Último ciclo del Site `17c59f82-bb6e-4e08-94ab-9bae0322c788` `idle`. No hay recibo E2E de fabricación/entrega por cliente real.
- Logs Supabase, ventana 09:45–11:14 UTC: 214 eventos `postgres_logs`, seis `pgbouncer_logs`; filtro textual de ERROR/FATAL y severidades críticas en `postgres_logs` sin coincidencias. El filtro no prueba ausencia universal de errores.
- Siete workflows de GitHub revisados individualmente: ninguno tiene evento `schedule`. `agent-runner.yml` usa exclusivamente `workflow_dispatch`; otros admiten `push` o `pull_request` para regresión. Ningún workflow manual verde acredita ejecución programada de cola.
- Modelos (pruebas sintéticas históricas, no repetidas): Gemini primario `gemini-2.5-flash` HTTP 404, respaldo `gemini-2.5-flash-lite` HTTP 404, tercero `gemini-3.5-flash-lite` HTTP 200 con `CONEXION_OK`. No se demuestra reparación de primario/respaldo.
- `AGENTS.md` en GitHub nombra Leo, Mila, Vera, Alma, Nico y Lía. Existe discrepancia histórica entre las especialidades asignadas a Alma y Lía en AGENTS.md y registros antiguos del Site; requiere cotejo con la fuente vigente, no reescritura de historial.

## Límites y pendientes
1. Cotejar por acceso **nativo de Sites** la versión realmente desplegada, su fuente y el commit recuperado de v53. La API de estado del agente no expone aquí la fuente/versiones; la referencia `5be977154cc15c9511787d22e28b7367e6f00467` corresponde a la recuperación informada del Site, no se presupone que sea un commit de GitHub. v54 permanece guardada sin desplegar.
2. Ejecutar únicamente cuando haya entorno seguro pruebas dinámicas aisladas de locks, reintentos, idempotencia, pausas y recuperación, sin tocar cola real, cuota, `not_before` ni cron. Las 122 pruebas de servidor del worktree v53 son evidencia histórica, no certificación de producción.
3. Resolver y verificar 404 de los modelos primario y respaldo, sin cambio de proveedor/costo sin autorización.
4. Obtener recibos encadenados verificables de solicitud, aprobación, fabricación, aprovisionamiento y entrega E2E sintética, distinguiéndolos de una respuesta de texto; la aceptación final exige cliente real.
5. Mantener vigilancia de recibos vencidos, errores y regresiones sin convertir `idle`/HTTP200/SQL succeeded en `done`.

## Cambios de esta auditoría
Solo este documento de evidencia en GitHub. **Sin tick manual, pruebas sintéticas nuevas, cambios de Site, deploy de v54, alteraciones de cron, quota, fechas, cola, secretos, pagos, correos ni terceros.** Ejecutores principal y respaldo intactos.
