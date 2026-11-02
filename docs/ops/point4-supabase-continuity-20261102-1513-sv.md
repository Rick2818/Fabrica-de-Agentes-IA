# Fábrica IA — Punto 4 · Auditoría 2026-11-02 15:13 El Salvador

**Estado rector: CERRADO PROVISIONALMENTE, SIN CERTIFICACIÓN.** Sin cliente real, no reabrir cierre administrativo ni declarar aceptación/certificación. Solo observación de lectura; no se ejecutaron ticks, pruebas de modelo, envíos, pagos, cambios de versión, de cuotas o de trabajos.

## Fuentes y corte

- Site `appgprj_6adbf0c05a0c8191b2ca585b76f5e862`: conector nativo Fábrica `agent_status`; esto permite estado operativo pero **no** inspección nativa de versión/despliegue en consola Sites.
- Supabase `udispwzwrebjkanudcoy`: consultas SQL de solo lectura a `cron.job`, `cron.job_run_details`, `private.fabrica_scheduler_config`, `private.fabrica_scheduler_receipts`, índices y catálogo de funciones.
- GitHub `Rick2818/Fabrica-de-Agentes-IA`: `AGENTS.md`, `.github/workflows/agent-runner.yml` y auditoría previa del 14:06.
- Corte SQL: `2026-11-02 21:13:47.83381+00` (15:13:47 El Salvador).

## Cron, recibos y conciliación

- Único cron de Fábrica consultado: `jobid=1`, `fabrica-queue`, `* * * * *`, `active=true`, comando `select private.fabrica_scheduler_tick();`. Configuración `enabled=true`, `not_before=null`, `last_error=null`.
- `cron.job_run_details`: **7,316** `succeeded`, **0** de otros estados para `jobid=1`. No equivalen a procesamiento funcional `done`.
- `private.fabrica_scheduler_receipts`: **6,573** totales, **6,567** `verified=true`, **5** con `error_code` histórico (último 2026-10-31 14:57 UTC). Entre verificados: **9** `done` históricos y **6,550** `idle`; ningún `done` nuevo en los últimos 90 minutos.
- Últimos 90 minutos: **89** recibos `idle` verificados y uno pendiente al instante de la consulta inicial; la cifra varía durante conciliaciones por minuto. Ningún `checked_at IS NULL` con `scheduled_at` anterior a 3 minutos al corte. **0** UUID duplicados.
- Conciliación cruzada concreta: ciclo `a0f54bde-faf7-49f2-a588-0d0cd3408bca` en Site como `source=supabase-cron`, `status=idle`, y en SQL con `scheduled_at=2026-11-02 21:12:00.118+00`, `checked_at=2026-11-02 21:13:00.043032+00`, HTTP 200, `verified=true`, `site_status=idle`, `error_code=null`. Acredita programación/conciliación **no** entrega `done`.
- `fabrica_scheduler_tick` contiene uso de advisory lock y `not_before`; `fabrica_scheduler_reconcile` consulta `not_before` y `verified`. Índices únicos comprobados sobre `cycle_id` y `request_id`. Son comprobaciones estáticas, no prueba dinámica de concurrencia, recuperación o pausa.

## Site, cola, respaldo y logs

- Site: **60** trabajos `done`, **2** `failed` históricos, **3** `cancelled`, **0** pendientes y **0** leases activos; 25 trabajos históricos con más de un intento, sin nuevos reintentos disparados. Cuota `0/20`; `deferred_until=null`.
- Automatizaciones verificadas en su fuente: `Respaldo de pendientes Fábrica IA` (`6adbf94d28e8819189c0516c6068457a`) **habilitado**; `Fábrica IA · Punto 4` (`6ae238f8b8a081918479f796f34da2b1`) **habilitado**. No se creó ni ejecutó otro respaldo.
- Logs `postgres_logs` entre 19:40 y 21:10 UTC: consulta textual ERROR/FATAL devolvió **0** entradas. No implica ausencia universal de fallos.
- `AGENTS.md` conserva identidades rectoras: Leo/Ventas, Mila/Servicio al cliente, Vera/Finanzas, Alma/Química y farmacia, Nico/Logística, Lía/Mercadeo. Un resultado histórico del Site reasigna Alma/Lía; no corregir registros históricos sin cotejo nativo de versión.
- GitHub: `.github/workflows/agent-runner.yml` inspeccionado en `main` y solo contiene `workflow_dispatch`, no `schedule`. Búsqueda de código `schedule` no arrojó resultados, pero no es prueba exhaustiva de los otros seis workflows. Auditoría anterior 14:06 afirma haber leído siete workflows y no hallar `schedule`; **no se repitió aquí su enumeración completa**, por limitación de listado del conector.

## Modelos y pendientes

- Site configura primario `gemini-2.5-flash`, respaldo `gemini-2.5-flash-lite`, tercero `gemini-3.5-flash-lite`. Últimos chequeos sintéticos **históricos**, no repetidos: primario HTTP 404 no verificado, respaldo HTTP 404 no verificado, tercero HTTP 200 verificado. No afirmar recuperación de ambos modelos.
- Se conserva evidencia histórica de fuente Sites v53, commit `5be977154cc15c9511787d22e28b7367e6f00467` y 122 pruebas de servidor aprobadas en worktree de esa fuente. **No** se cotejó la versión efectivamente desplegada; v54 guardada no fue activada.
- Pendiente: cotejo de despliegue nativo y correspondencia de seis agentes; pruebas dinámicas aisladas de locks, pausas, recuperación, reintentos e idempotencia; disponibilidad y fallback demostrados de modelos; recibos verificables de aprobación, fabricación, cabina y entrega E2E; aceptación de cliente real. Las prácticas sintéticas previas no sustituyen esos recibos.
- No se detectó regresión operativa nueva con la evidencia disponible. No se efectuaron cambios de producción.

**Resultado:** mantener el cierre provisional **SIN CERTIFICACIÓN** y continuar controles de solo lectura, sin competir con el respaldo horario ni fabricar entregas mediante cambios de cuota/fechas.
