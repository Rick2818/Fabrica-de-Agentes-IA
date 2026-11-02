# Fábrica IA — Punto 4 — auditoría de continuidad (2026-11-02 07:15, America/El_Salvador)

**Estado rector:** CERRADO PROVISIONALMENTE, SIN CERTIFICACIÓN. Auditoría segura de solo lectura; no confundir con estación 4 del diseño ni issue #4. Sin ejecución de cola ni cambios de producción.

## Fuentes y corte
- Supabase `udispwzwrebjkanudcoy`: consultas SQL de `cron.job`, `cron.job_run_details`, `private.fabrica_scheduler_config`, `private.fabrica_scheduler_receipts`, índices y funciones. Corte SQL `2026-11-02 13:15:09.582471+00`.
- Site: `agent_status` del complemento nativo Fábrica, para estado de tareas, salud y recibos; no expone inventario de versiones ni fuente nativa.
- GitHub `Rick2818/Fabrica-de-Agentes-IA`: `AGENTS.md` y lectura individual de siete YAML en `.github/workflows/`.
- Respaldo horario: `Automations.peek` de `6adbf94d28e8819189c0516c6068457a`; lectura, sin ejecución.
- Logs Supabase: ventana `2026-11-02T11:45:00Z` a `2026-11-02T13:15:00Z`.

## Evidencia verificable
1. **Cron principal:** `cron.job` registra `jobid=1`, `fabrica-queue`, `* * * * *`, `active=true`, comando `select private.fabrica_scheduler_tick();`. `cron.job_run_details`: **6,838** ejecuciones `succeeded` al corte, **+67** frente a 06:08. Éxito SQL no equivale a entrega.
2. **Recibos Supabase:** **6,095** filas, **6,089** verificadas, **+67** verificadas frente a 06:08. Distribución al primer muestreo: `idle=6,071`, `done=9` históricos (último 2026-10-29 07:27Z), `waiting=4`, `error=2`, `quota=1`, `busy=1`, cinco `network_error` históricos y un recibo reciente aún no conciliado. No hubo nuevo `done` durante el intervalo. **90 `idle` verificados en últimos 90 minutos**.
3. **Cotejo cruzado de UUID:** ciclo `3c15e4b9-80df-40cf-b05f-20d00eb4b6f4` apareció en `health.supabase_runner` y `health.autonomy.primary.last_cycle` del Site como `idle`, origen `supabase-cron`. SQL confirmó posteriormente `checked_at=2026-11-02 13:15:00.037225+00`, HTTP 200, `verified=true`, `site_status=idle`, `error_code=null`. El ciclo anterior `31be9dbb-66af-4ee4-b294-1901ce9499e0` también quedó conciliado `idle`. Ninguno acredita `done`.
4. **Continuidad y protección:** `private.fabrica_scheduler_config`: `enabled=true`, `not_before=null`, `last_error=null`. No se hallaron UUID ni `request_id` duplicados; no había pendientes de conciliación con más de tres minutos. Índices únicos reales sobre `cycle_id` y `request_id`. Inspección estática de funciones: `fabrica_scheduler_tick` contiene `pg_try_advisory_xact_lock`, `FOR UPDATE`, referencia `not_before` y seguimiento de solicitud/ciclo; `fabrica_scheduler_reconcile` referencia `verified`, `not_before`, `request_id` y `cycle_id`. Esto no demuestra pruebas dinámicas de recuperación o concurrencia.
5. **Site:** 65 tareas históricas: **60 done, 2 failed, 3 cancelled, 0 pendientes**. Cuota **0/20**. El último ciclo observado fue `idle`, sin trabajo funcional nuevo. Seis tareas sintéticas `synthetic-six-20261028-{leo,mila,vera,alma,nico,lia}` constan `done` con recibos de procesamiento de texto; no equivalen a aprobación, fabricación, entrega E2E ni aceptación real.
6. **Modelos:** configuración primaria `gemini-2.5-flash`, respaldo `gemini-2.5-flash-lite`, tercero `gemini-3.5-flash-lite`. Últimos chequeos sintéticos guardados: HTTP **404, 404, 200** respectivamente. No se repitieron ni se afirmó recuperación del primario/respaldo.
7. **GitHub:** los siete YAML leídos individualmente carecen de `schedule`; `agent-runner.yml` solo `workflow_dispatch`, los restantes CI/manual. `AGENTS.md` conserva separación de proyectos y las seis mascotas. Hay divergencia histórica de etiquetas de especialidad Alma/Lía en resultados del Site frente a `AGENTS.md`; requiere cotejo con fuente vigente, sin alterar identidades.
8. **Respaldo:** `Respaldo de pendientes Fábrica IA` permanece habilitado; última ejecución registrada `no_update`, iniciada `2026-11-02T13:12:47.297152Z`. No se disparó desde esta auditoría.
9. **Logs:** en ventana de 90 minutos, 216 eventos `postgres_logs` y cinco `pgbouncer_logs`. Búsqueda textual por `error`/`fatal` en `event_message` sin coincidencias; el campo `log_attributes['level']` estaba vacío y no permitió clasificación fiable por severidad. Ausencia de coincidencias no garantiza ausencia universal de errores.

## Pendientes sin certificar
- **Fuente Site/versiones:** según estado rector, fuente nativa asociada a v53 recuperada previamente, commit `5be977154cc15c9511787d22e28b7367e6f00467`, con 122 pruebas de servidor sobre worktree; no se repitieron. La consulta a GitHub de ese SHA en el repositorio principal devolvió `No commit found`, lo que no refuta su origen nativo de Sites. El conector `agent_status` no permite cotejar qué versión está desplegada. v54 guardada sin desplegar; no se activó.
- **Pruebas dinámicas aisladas** de locks, reintentos, idempotencia, pausas y recuperación sobre la fuente vigente; ninguna se marcó aprobada sin ejecutarse.
- **Modelos:** resolución demostrada de los 404 de primario y respaldo, sin cambiar proveedor ni incurrir en costos no autorizados.
- **E2E:** recibos persistidos enlazados de solicitud, aprobación, fabricación, aprovisionamiento y entrega para el mismo cliente/pedido sintético. Prácticas de texto no sustituyen esas evidencias.
- **Aceptación final:** cliente real todavía ausente; no reabrir cierre administrativo ni certificar automáticamente.

## Cambios
Únicamente este informe documental durable en GitHub. Sin cambios en Site, cron, ejecutores, respaldos, datos, cuotas, fechas, locks, versiones, credenciales, pagos, correos o terceros. Sin regresión operativa nueva demostrada; punto 4 permanece cerrado provisionalmente, sin certificación.
