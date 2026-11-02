# Fábrica de Agentes IA — Punto 4 — auditoría de continuidad (2026-11-02 08:37, America/El_Salvador)

**Estado rector:** CERRADO PROVISIONALMENTE, SIN CERTIFICACIÓN. Auditoría segura; no confundir con estación 4 del diseño ni con issue #4. No se ejecutó la cola ni se cambió producción.

## Fuentes y corte

- Supabase `udispwzwrebjkanudcoy`: SQL de solo lectura de `cron.job`, `cron.job_run_details`, `private.fabrica_scheduler_config`, `private.fabrica_scheduler_receipts`, definiciones de funciones e índices. Corte principal `2026-11-02 14:37:45.208823+00`.
- Site: complemento nativo Fábrica `agent_status`; permite leer tareas, salud, configuración y recibos, pero **no expone el inventario de versiones ni el código fuente Site**. Proyecto declarado `appgprj_6adbf0c05a0c8191b2ca585b76f5e862`.
- GitHub `Rick2818/Fabrica-de-Agentes-IA`: lectura de `AGENTS.md` y de los siete archivos YAML actuales en `.github/workflows`, individualmente.
- Respaldo horario: consulta `Automations.peek` del ID `6adbf94d28e8819189c0516c6068457a`; sin ejecución ni cambio.
- Logs Supabase: consulta read-only de `postgres_logs` entre `2026-11-02T12:30:00Z` y `2026-11-02T14:35:00Z`.

## Evidencia actual

1. **Cron principal real**: `cron.job` muestra un único job `jobid=1`, `jobname=fabrica-queue`, `schedule=* * * * *`, `active=true`, `command=select private.fabrica_scheduler_tick();`. `cron.job_run_details`: **6,920 succeeded**, cero otros estados al corte; **+82** frente al control 07:15. `succeeded` significa ejecución SQL, **no entrega de un trabajo**.
2. **Recibos**: **6,177** filas, **6,171 verified**, **+82** recibos verificados respecto a 07:15. En los últimos 90 minutos **90 ciclos verificados `idle` y cero `done`**. Cinco errores históricos `network_error` (último 2026-10-31 14:58 UTC), sin errores nuevos en el intervalo. Un recibo reciente sin `checked_at` al corte, **cero vencidos más de tres minutos**.
3. **Conciliación cruzada**: Site `health.supabase_runner` y `health.autonomy.primary` reportaron ciclo `dd0d466c-4e10-45c4-83f3-fe061d17d56e`, origen `supabase-cron`, estado `idle`. SQL inicialmente lo mostró aún pendiente de conciliación, y una consulta posterior confirmó `checked_at=2026-11-02 14:37:00.026736+00`, `http_status=200`, `verified=true`, `site_status=idle`, `error_code=null`. **No es `done`**.
4. **Pausas y recuperación**: `private.fabrica_scheduler_config` mostró `enabled=true`, `not_before=null`, `last_error=null`. Las funciones actuales contienen bloqueo `pg_try_advisory_xact_lock`, `FOR UPDATE`, verificación de UUID/estado/tiempo en recibos, espera ante conciliación pendiente, respeto de `not_before`, backoff de 5 minutos ante fallo y tratamiento explícito de respuesta faltante. Índices únicos reales sobre `cycle_id` y `request_id`. **Son verificaciones estáticas; no se ejecutaron pruebas dinámicas de concurrencia/reintento.** No hubo UUID ni `request_id` duplicados.
5. **Site y seis agentes**: **60 done, 2 failed, 3 cancelled, 0 pendientes**; cuota **0/20**; `stalled=false`, `oldest_due=null`, `next_run_at=null`. Las seis prácticas históricas `synthetic-six-20261028-{leo,mila,vera,alma,nico,lia}` constan `done` con evidencias de texto y SHA256. No demuestran recibos persistidos de aprobación, fabricación, aprovisionamiento ni entrega E2E.
6. **Modelos**: primaria `gemini-2.5-flash`, respaldo `gemini-2.5-flash-lite`, tercero `gemini-3.5-flash-lite`. Últimos chequeos sintéticos almacenados: **HTTP 404, 404 y 200** respectivamente. No se repitieron ni se declaró recuperación de los dos primeros.
7. **GitHub**: se leyeron `agent-runner.yml`, `diagnostic-a-scheduler.yml`, `diagnostic-b-conditions.yml`, `diagnostic-c-actor.yml`, `factory-regression.yml`, `training-regression.yml` y `verify-training.yml`. **Ninguno tiene disparador `schedule`**; el runner de agente solo `workflow_dispatch`. `AGENTS.md` mantiene separación de proyectos y seis identidades. No se confunde CI verde con programación ni entrega.
8. **Respaldo**: la automatización existente sigue `is_enabled=true`; último registro `no_update`, inicio `2026-11-02T14:21:05.595984Z`. No se creó otro ejecutor ni se disparó el respaldo.
9. **Logs**: ventana consultada con 296 `postgres_logs` y 6 `pgbouncer_logs`. Búsqueda textual de `error`/`fatal` en `event_message` devolvió cero coincidencias. **Limitación**: no equivale a análisis exhaustivo de severidades. Una consulta exploratoria de esta auditoría usó erróneamente `created_at` en la tabla de recibos, donde la columna correcta es `checked_at`; se corrigió inmediatamente la consulta y no se modificó dato alguno.

## Pendientes sin certificar

- Cotejo **nativo** de la versión Site efectivamente desplegada y de la fuente original v53, recuperada previamente según estado rector en commit `5be977154cc15c9511787d22e28b7367e6f00467` con 122 pruebas de servidor en worktree. No se volvieron a ejecutar ni se contradijo la recuperación previa. **v54 permanece guardada sin desplegar**.
- Pruebas dinámicas seguras y aisladas de locks, pausas, reintentos, idempotencia y recuperación, sin tocar el cron principal ni cuota.
- Demostrar recuperación funcional del primario y respaldo Gemini, sin cambiar modelos ni contratar servicios.
- Recibos E2E del **mismo pedido sintético** enlazando registro, aprobación, fabricación, aprovisionamiento y entrega, distinguiendo ejecución de texto de acciones reales.
- Aceptación final por cliente real cuando exista, **sin reabrir por ello el cierre administrativo provisional**.

## Intervenciones

Se creó **solo este informe documental**. No se alteraron Site, fuente, v53/v54, Cron, respaldo, GitHub Actions, modelos, datos de clientes, locks, cuotas, `not_before`, correos, pagos ni terceros. No hay regresión operativa nueva demostrada en la ventana auditada. Estado: **CERRADO PROVISIONALMENTE, SIN CERTIFICACIÓN**.
