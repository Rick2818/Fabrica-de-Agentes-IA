# Fábrica de Agentes IA — Punto 4: continuidad, 2026-11-01 03:15 (El Salvador)

**Estado rector: CERRADO PROVISIONALMENTE, SIN CERTIFICACIÓN.** Auditoría de lectura y documentación; no se ejecutó `fabrica_scheduler_tick` manualmente ni `run_pending_tasks`, no se cambió código operativo, Site, cuotas, fechas, ejecutores, trabajos ni versiones. v54 no activada.

## Fuentes y corte

- Supabase proyecto `udispwzwrebjkanudcoy`, consulta SQL consolidada con corte `2026-11-01T09:15:13.172136Z`.
- `cron.job`: **un único** job llamado `fabrica-queue`, `jobid=1`, `active=true`, `* * * * *`, comando `select private.fabrica_scheduler_tick();`. `private.fabrica_scheduler_config`: `enabled=true`, `not_before=NULL`, `last_error=NULL`.
- `cron.job_run_details`: **5,158** registros `succeeded`, **0** otros estados para ese job. No equivale a ejecución `done`.
- `private.fabrica_scheduler_receipts`: **4,415** recibos, **4,409** `verified=true`, **5** `network_error` históricos, **9** `verified=true/site_status=done` históricos, **0** `done` en últimos 90 minutos, **89** `verified=true/site_status=idle` en últimos 90 minutos. **0** recibos `checked_at=NULL` con antigüedad >3 min, **0** duplicados de UUID de ciclo y **0** de `request_id`.
- El ciclo `2152ce04-686b-4e37-ab45-0203e7740eaa` se contrastó con `health.autonomy.primary.last_cycle` del complemento Site: `source=supabase-cron`, `status=idle`. SQL lo identifica como último ciclo `verified=true` al corte. No acredita trabajo procesado ni entrega. El ciclo más reciente `a5ece465-b4c8-4988-9187-5c00c0dbcf43` estaba aún sin `checked_at`; **no aprobado**.

## Hallazgo diagnóstico nuevo: hueco de cinco minutos no equivale a pérdida de recibos

- Una correlación preliminar de ejecuciones SQL con recibos en las últimas 24 horas encontró cinco ejecuciones `succeeded` sin solicitud/recibo, entre `2026-10-31T14:58:00Z` y `15:02:00Z`. Al inspeccionar los registros adyacentes, el ciclo `7a6ca346-b178-4869-baec-136c47c47bb8` a las `14:57Z` tenía `error_code=network_error`; la siguiente solicitud fue a las `15:03Z`.
- La definición actual de `private.fabrica_scheduler_reconcile()` establece `not_before=clock_timestamp()+interval '5 minutes'` tras error y `private.fabrica_scheduler_tick()` retorna `deferred` si aún no llega `not_before`. **La ausencia de esos cinco recibos es compatible con la pausa deliberada de recuperación**, no evidencia por sí sola una entrega perdida. Se verificaron los cinco errores históricos: el siguiente recibo aparece **6–7 minutos** después de cada error. La causa de transporte original de los errores no se determinó.
- No confundir `cron succeeded` con `HTTP200`, `verified`, `site_status=idle` o `site_status=done`. El desfase histórico entre conteos de cron y recibos incluye ejecuciones sin envío por políticas de espera y requiere interpretación por ventana/estado, no resta directa como indicador de fallo.
- Las funciones SQL muestran `pg_try_advisory_xact_lock`, `FOR UPDATE`, comprobación de recibos pendientes, identidad/UUID, `not_before` y conciliación; **inspección estática**, no prueba dinámica de concurrencia o recuperación.
- Logs Supabase: `postgres_logs` sin coincidencias de texto `error`/`timeout` entre `2026-11-01T06:00Z` y `09:14Z`. No demuestra ausencia total de fallos.

## Site, respaldo, agentes y repositorio

- Complemento Fábrica `agent_status`: **65** trabajos, **60 done**, **2 failed** históricos, **3 cancelled**, **0 pendientes**. No se observaron leases activos ni reintentos pendientes en la cola devuelta. Cuota `0/20`. `health.supabase_runner.status=idle`, `health.autonomy.primary.recent=true`.
- Seis ejercicios `synthetic-six-20261028-{leo,mila,vera,alma,nico,lia}`: todos `done` con recibos de **respuesta de texto**; algunos `execution_source=mcp` o `scheduled-mcp`, no se deben atribuir todos a Supabase Cron. No constituyen fabricación, aprovisionamiento, entrega E2E ni aceptación de cliente.
- Automaciones: `Fábrica IA · Punto 4` y `Respaldo de pendientes Fábrica IA` aparecen ambas `is_enabled=true`. El respaldo no se invocó desde esta auditoría; estar habilitado no prueba un ciclo de procesamiento.
- `AGENTS.md` leído directamente de `main`; exige preservar el Site y separar ejecución manual de programada. `.github/workflows/agent-runner.yml` leído directamente: `workflow_dispatch` únicamente, sin `schedule`. La búsqueda de código GitHub por `schedule:` no devolvió resultados, pero no se releyeron individualmente los otros seis workflows en esta ejecución; la revisión completa de los siete figura en el informe anterior de las 02:14. **No se afirma una nueva verificación exhaustiva de los siete**.
- Fuente Site original v53 recuperada históricamente con commit nativo `5be977154cc15c9511787d22e28b7367e6f00467` y 122 pruebas de servidor aprobadas en worktree. Esta auditoría no tuvo herramienta nativa de lectura del código/despliegue actual de Sites; no se hizo cotejo de versión efectivamente publicada. v54 no fue desplegada por esta tarea.
- Los antecedentes de modelos `gemini-2.5-flash` y `gemini-2.5-flash-lite` siguen HTTP404; el terciario `gemini-3.5-flash-lite` tuvo HTTP200 en prueba histórica. No se hizo prueba nueva ni se afirma recuperación de ambos o fallback real completo.

## Pendientes para validación final — NO aprobados

1. Cotejar nativamente la fuente y despliegue efectivo del Site, sin sustituir código ni activar v54.
2. Ejecutar pruebas dinámicas aisladas de locks/concurrencia, reintentos, idempotencia, pausas, recuperación y respeto a `not_before` sin consumir cuota productiva ni disparar ticks.
3. Determinar causa original de cinco errores de transporte con telemetría verificable, si aún existe.
4. Validar modelos primario/respaldo y fallback con pruebas seguras y autorizadas, sin evadir cuota.
5. Obtener recibos E2E de aprobación, fabricación, aprovisionamiento y entrega, más aceptación final cuando exista cliente real.

**Resultado:** continuidad de cron y conciliación `idle` comprobadas; hueco histórico de cinco ejecuciones SQL explicado por backoff compatible con las funciones actuales; no se acreditó nueva entrega funcional ni una regresión que amerite cambio operativo. Punto 4 conserva cierre provisional sin certificación.
