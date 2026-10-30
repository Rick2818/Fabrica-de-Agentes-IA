# Punto 4 — auditoría de continuidad (2026-10-29 22:08, America/El_Salvador)

**Estado rector:** CERRADO PROVISIONALMENTE, SIN CERTIFICACIÓN. No hay cliente real para aceptación final. Este control es de solo lectura sobre Supabase, Site y GitHub; no ejecutó ticks, no procesó la cola ni consumió cuota.

## Fuentes consultadas directamente

- Supabase proyecto `udispwzwrebjkanudcoy`: `cron.job`, `cron.job_run_details`, `private.fabrica_scheduler_config`, `private.fabrica_scheduler_receipts` y definiciones de `private.fabrica_scheduler_tick()` y `private.fabrica_scheduler_reconcile()`.
- Complemento nativo de Fábrica IA: `agent_status`, incluyendo `health.supabase_runner`, `health.autonomy`, `usage`, `jobs` y `models`.
- GitHub `Rick2818/Fabrica-de-Agentes-IA`: `AGENTS.md` y contenido de los siete workflows actuales.
- Automatización existente `Respaldo de pendientes Fábrica IA`: consulta de su estado, sin ejecución ni modificación.

## Evidencia al corte

- `cron.job`: `jobid=1`, `fabrica-queue`, `* * * * *`, `active=true`, comando `select private.fabrica_scheduler_tick();`. `cron.job_run_details`: **1,971** filas `succeeded`, última 2026-10-30 04:08:00 UTC. El éxito SQL no equivale a una entrega.
- Recibos: **1,244** ciclos y **1,244 UUID distintos**, **1,241 verified=true**, **3 sin verificar**; estados: 1,224 `idle`, 9 `done` históricos, 4 `waiting`, 2 `error`, 2 errores de transporte sin estado, 1 `quota`, 1 `busy` y 1 recibo reciente sin conciliar. No hubo nueva entrega `done`.
- **Incidente nuevo de transporte:** ciclo `e557300e-1fa9-4015-97f7-4d831ff2b450`, programado 2026-10-30 03:53:00 UTC (21:53 hora de El Salvador), conciliado a las 03:54 UTC con `error_code=network_error`, `verified=false`, `http_status=null`, `site_status=null`. No hay prueba de su resultado final; no atribuirle entrega ni éxito.
- **Recuperación posterior comprobada:** ciclo `2c155390-504a-4723-bbcd-59a4b642b8a7` de las 04:00 UTC, verificado a las 04:01 UTC con HTTP 200 y `site_status=idle`; los ciclos posteriores hasta las 04:07 UTC también `verified=true` e `idle`. No son entregas funcionales.
- Ciclo `c3f4cc5e-90bb-43ae-86bd-17a1451686c5` de las 04:08 UTC: en el corte SQL aún no tenía conciliación (`verified=false`, `checked_at=null`), pero el Site nativo ya mostraba un ciclo `idle` con ese UUID. **No marcar verificado** sin conciliación SQL.
- El otro error de transporte histórico sigue sin verificar: `301f7d3c-d7d0-4d74-86de-072dc18f64f4` de 2026-10-30 00:38 UTC (18:38 local).
- Configuración SQL: `enabled=true`, `not_before=null`, `last_error=null` al corte. El Site informa `automation.enabled=true`, ejecutor principal `supabase-cron` reciente y `pending=0`. Cola: 60 `done`, 2 `failed` históricos, 3 `cancelled`, 0 pendientes. Cuota Site: **20/20**.
- Las funciones SQL leídas contienen `pg_try_advisory_xact_lock`, bloqueo de fila `FOR UPDATE`, verificación de UUID/identidad/estado en respuesta, `awaiting_receipt`, `not_before`, y pausa de 5 minutos ante fallos. Inspección estática, **no** prueba formal de concurrencia, idempotencia o recuperación.
- Los siete workflows inspeccionados (`agent-runner`, `diagnostic-a/b/c`, `factory-regression`, `training-regression`, `verify-training`) **no tienen trigger `schedule`**. El respaldo horario permanece habilitado, sin ejecutarlo.
- El Site sigue configurando `gemini-2.5-flash` y `gemini-2.5-flash-lite` con respaldo `gemini-3.5-flash-lite`; pruebas sintéticas previas: 404, 404, 200, respectivamente. No se repitieron por cuota agotada. El fallback real no está certificado.

## Pendientes y límites

1. Comparar con acceso nativo la fuente de la versión **efectivamente desplegada** frente a v53; las 122 pruebas de v53 (commit `5be977154cc15c9511787d22e28b7367e6f00467`) son antecedente, no nueva ejecución. No activar v54.
2. Pruebas sintéticas aisladas de concurrencia, locks, idempotencia, pausas, reintentos y recuperación, cuando sean seguras y sin alterar cuota ni producción. Aclarar el resultado final de ambos UUID de `network_error` si aparece evidencia nativa; no inventar recibos.
3. Comprobar el fallback de modelos sin exceder cuota y el recorrido funcional de los seis agentes; separar evidencia sintética de aceptación de cliente.
4. Aceptación final con cliente real, ausente por ahora. No reabrir cierre provisional por ello.

**Acciones:** Ninguna modificación de producción, código de runtime, cron, disparadores, cuotas, fechas, cola ni trabajos ajenos. Se preservaron ejecutor principal y respaldo.