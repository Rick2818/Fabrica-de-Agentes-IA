# Fábrica de Agentes IA — Punto 4 — continuidad (2026-11-02 00:07 CST, UTC−06)

## Estado rector
**CERRADO PROVISIONALMENTE, SIN CERTIFICACIÓN.** Revisión de solo lectura de Supabase, conector del Site, AGENTS.md, GitHub y automatizaciones. La única escritura es este registro documental. No se disparó ningún tick, no se ejecutó la cola, no se crearon cron/jobs ni se alteraron cuotas, fechas, modelos, datos, Site, versiones o ejecutores. El respaldo horario continúa habilitado. La versión 54 no fue desplegada por esta auditoría.

## Evidencia observada y alcance
- Corte SQL: `2026-11-02 06:07:13.206856+00` (00:07:13 CST). Proyecto Supabase `udispwzwrebjkanudcoy` consultado con estado `ACTIVE_HEALTHY`.
- `cron.job`: solo `jobid=1`, `jobname=fabrica-queue`, `active=true`, `schedule=* * * * *`, `command=select private.fabrica_scheduler_tick();`. `private.fabrica_scheduler_config`: `enabled=true`, `not_before=null`, `last_error=null`.
- `cron.job_run_details`: **6,410** ejecuciones SQL `succeeded`. No equivalen a trabajos funcionales `done`.
- `private.fabrica_scheduler_receipts`: **5,667** recibos, **5,661** `verified=true`. Cinco `network_error` históricos sin incremento; **cero** recibos no verificados, sin código de error, con antigüedad mayor a tres minutos al corte previo de 06:06:46Z. Sin grupos de `cycle_id` ni `request_id` duplicados. Índices únicos confirmados para ambas columnas.
- Último ciclo conciliado al corte: `51047d1f-ad5b-46b8-bc66-b060420c78a3`, HTTP 200, `verified=true`, `site_status=idle`. El conector Site reportó ese UUID en `health.autonomy.primary.last_cycle` como `idle` antes de la conciliación SQL; ahora se cotejó con SQL. El ciclo siguiente `fb1f418d-c1f9-4568-a5d3-5859647c1d3d` estaba pendiente de conciliación SQL al corte: **no aprobado**.
- Ventana de 90 minutos examinada a las 06:06:46Z: 90 recibos `idle` verificados, cero `done` nuevos. Historial verificado a ese instante: `idle=5643`, `done=9`, `waiting=4`, `error=2`, `busy=1`, `quota=1`; los nueve `done` son históricos.
- Conector Site `agent_status`: 65 trabajos (60 `done`, 2 `failed`, 3 `cancelled`, cero pendientes), cuota 0/20, `health.supabase_runner.status=idle`, `health.autonomy.status=recent`. Seis prácticas sintéticas `synthetic-six-20261028-{leo,mila,vera,alma,nico,lia}` permanecen `done` con evidencia de generación de texto; **no** son fabricación, entrega E2E ni aceptación de cliente. No se generaron prácticas nuevas.
- Las automatizaciones `Fábrica IA · Punto 4` y `Respaldo de pendientes Fábrica IA` se consultaron con `is_enabled=true`; el respaldo tuvo último resultado registrado `no_update`. No se alteraron.
- Se leyeron los **siete** workflows vigentes en `.github/workflows/` desde `main`; **ninguno tiene `schedule:`**. `agent-runner.yml` es `workflow_dispatch` manual. Los demás contienen disparadores manuales o de CI por cambios; no confundirlos con Supabase Cron.
- `AGENTS.md` vigente: Leo Ventas, Mila Servicio al cliente, Vera Finanzas, Alma Química y farmacia, Nico Logística, Lía Mercadeo. Los resultados históricos de ejercicios clasifican Alma y Lía de otra forma; se conserva la discrepancia para cotejo de la fuente Site activa.
- `private.fabrica_scheduler_tick` y `private.fabrica_scheduler_reconcile` leídas: guardia advisory, bloqueo de fila, `not_before`, verificación de UUID/recibo y manejo de error de transporte. **Inspección estática, no prueba dinámica** de concurrencia, idempotencia o recuperación.
- Logs Supabase en `2026-11-02T04:35:00Z`–`06:05:00Z`: 216 `postgres_logs`, seis `pgbouncer_logs`; cero coincidencias de `error/fatal` en el filtro de texto utilizado. Cobertura parcial; no demuestra ausencia de todo error.
- Comprobaciones históricas del Site: primario `gemini-2.5-flash` HTTP 404 sin verificar; respaldo `gemini-2.5-flash-lite` HTTP 404 sin verificar; tercer modelo `gemini-3.5-flash-lite` HTTP 200 sintético. No se hizo una nueva prueba de recuperación ni se cambió proveedor.

## Pendientes, sin aprobación implícita
1. Confirmar mediante acceso nativo de Sites la versión **realmente desplegada** y contrastarla con fuente; la recuperación histórica de v53 (commit `5be977154cc15c9511787d22e28b7367e6f00467`, 122 pruebas de servidor aprobadas en su worktree) no identifica por sí sola la versión activa. El conector `agent_status` no devuelve versión.
2. Ejecutar **en entorno aislado seguro**, no en cola real, pruebas dinámicas de locks, reintentos, `not_before`, cuotas, idempotencia, pausa y recuperación. No ejecutadas en este control.
3. Resolver con evidencia los 404 de Gemini primario y respaldo y validar fallback sin gasto o cambio de proveedor no autorizado.
4. Obtener recibos persistidos y correlacionables de aprobación, fabricación, aprovisionamiento y entrega E2E, con identidad y UUID, cuando exista recorrido autorizado; no inferirlos de ejercicios de texto.
5. Aceptación final por cliente real: pendiente por ausencia de cliente, **sin reabrir el cierre administrativo**.

**Resultado:** continuidad reciente del cron real y cola vacía, sin regresión operativa nueva observada. No se certifica autonomía funcional, fabricación, entrega ni aceptación. Punto 4 **CERRADO PROVISIONALMENTE, SIN CERTIFICACIÓN**.
