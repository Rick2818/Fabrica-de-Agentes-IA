# Punto 4 — continuidad del ejecutor (2026-10-30 00:09 America/El_Salvador)

**Decisión rectora:** CERRADO PROVISIONALMENTE, SIN CERTIFICACIÓN. Auditoría de solo lectura; las pruebas sintéticas no sustituyen aceptación de cliente. No corresponde a la estación 4 del diseño ni al issue #4.

## Fuentes y corte
- Supabase `udispwzwrebjkanudcoy`, consultas SQL SELECT a `cron.job`, `cron.job_run_details`, `private.fabrica_scheduler_config`, `private.fabrica_scheduler_receipts`, `net._http_response` y lectura de definiciones de `private.fabrica_scheduler_tick()` y `private.fabrica_scheduler_reconcile()`. Corte de cron y recibos: **2026-10-30 06:08 UTC**. Consulta de logs Supabase: 02:00–06:10 UTC.
- Site original `appgprj_6adbf0c05a0c8191b2ca585b76f5e862`, consulta del complemento `agent_status` a **06:08:49 UTC**.
- GitHub `Rick2818/Fabrica-de-Agentes-IA`, `AGENTS.md` y los siete workflows en `main` leídos directamente.
- Respaldo horario `6adbf94d28e8819189c0516c6068457a`: `Automations.peek` confirmó `is_enabled=true`, último registro `no_update` iniciado a las 05:50:16 UTC; ese estado **no prueba trabajo procesado**.

## Resultado comprobado
1. Principal `fabrica-queue` (`jobid=1`) sigue `active=true`, expresión `* * * * *`. `cron.job_run_details`: **2,091** ejecuciones, todas `succeeded`, ninguna fallida en SQL; último inicio 06:08:00 UTC. Este dato **no** demuestra una entrega `done`.
2. `private.fabrica_scheduler_receipts`: **1,353** filas y **1,353 UUID distintos**, **1,348 verified**, **5 no verificadas** al corte. Por estado verificado: **1,331 idle**, **9 done históricos**, **4 waiting**, **2 error**, **1 quota**, **1 busy**. Una fila de las cinco no verificadas era el ciclo más reciente de 06:08 UTC aún sin conciliación SQL; el Site sí lo registraba `idle` con UUID `5c8bdc1d-b96c-45f8-b89c-ccfdde89d266`, lo cual **no autoriza** marcar el registro SQL como verificado antes de conciliar.
3. Cuatro recibos históricos no verificados tienen `error_code=network_error` y `net._http_response.timed_out=true`, cada uno con timeout de **55,000 ms**: 00:38 UTC UUID `301f7d3c-d7d0-4d74-86de-072dc18f64f4`; 03:53 UTC UUID `e557300e-1fa9-4015-97f7-4d831ff2b450`; **05:17 UTC UUID `4dd8d3fe-9de6-40e8-8af7-de813e230d1b`**; **05:54 UTC UUID `904c6e64-4e73-4aea-a569-a11ab7234cd1`**. Los dos últimos son nuevos respecto del control anterior. No existe respuesta HTTP verificable ni `site_status` para esos cuatro UUID; **ninguno se declara `done`**.
4. El Site expuso 40 ciclos recientes entre 05:16 y 06:08 UTC, todos los observados con estado `idle`; los UUID de los timeouts de 05:17 y 05:54 no aparecen en esa ventana. Esto limita la evidencia del resultado exacto de los intentos fallidos. Los ciclos posteriores sí muestran que la ejecución programada volvió a generar recibos `idle` con UUID coincidentes. **Recuperación de continuidad observada**, no prueba formal de transporte ni entrega funcional.
5. Site: **65 jobs** históricos (60 `done`, 2 `failed`, 3 `cancelled`), **0 pendientes**, **0 leases activos** entre jobs visibles, cuota **20/20**. Los 60 jobs `done` no equivalen a 60 entregas del cron. No se creó tarea ni se gastó cuota.
6. Configuración: `enabled=true`, `not_before=null`, `last_error=null`. Inspección estática: `tick` emplea `pg_try_advisory_xact_lock`, `FOR UPDATE`, espera de recibo y `not_before`; `reconcile` coteja fuente, proyecto, schedule, UUID, timestamp y estado antes de `verified`, y ante error aplica pausa de cinco minutos. No se efectuaron pruebas aisladas de carrera, pausas o idempotencia. Los logs unificados consultados no arrojaron errores PostgreSQL coincidentes con la búsqueda; esto no descarta problemas de transporte del Site.
7. Los siete workflows GitHub en `main` **no contienen disparador `schedule`**. `agent-runner.yml` solo tiene `workflow_dispatch`; los de regresión pueden usar `push` o `pull_request` pero no compiten como scheduler.
8. Modelos: Site mantiene principal `gemini-2.5-flash` y respaldo `gemini-2.5-flash-lite`, ambos con sondas sintéticas previas HTTP 404; tercera alternativa `gemini-3.5-flash-lite` con sonda previa HTTP 200. Fallback de una tarea real **no certificado**. Sin pruebas de modelo nuevas por cuota agotada.

## Pendientes y criterio final
- Correlacionar el origen de los timeouts de 55 s en Site y Supabase, con acceso nativo y sin disparar ticks, reintentos ni consumir cuota; los cuatro UUID fallidos no deben reclasificarse sin evidencia.
- Inspeccionar la fuente nativa **efectivamente desplegada** y compararla con la fuente y artefacto correspondiente. La fuente v53 recuperada (`5be977154cc15c9511787d22e28b7367e6f00467`, 122 pruebas servidor aprobadas) es antecedente, no prueba reejecutada. No activar v54 por este resultado.
- Ejecutar, cuando sea seguro y aislado, pruebas formales de concurrencia/locks, pausa `not_before`, idempotencia, recuperación de transporte y fallback de modelos, con recibos E2E. No figuran como aprobadas.
- Validación final con **cliente real**, su aceptación y recibos verificables; todavía inexistente.

**Acciones de esta auditoría:** lecturas y este registro documental solamente. Sin cambios en producción, Site, cuotas, fechas, cron, ejecutores, trabajos ajenos o respaldo. No se creó segundo ejecutor ni se lanzó `tick`. Se conserva el cierre administrativo provisional, sin certificación.
