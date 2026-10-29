# Fábrica de Agentes IA — Punto 4 — control de continuidad 2026-10-29 15:13 SV

## Dictamen y límites
**CERRADO PROVISIONALMENTE, SIN CERTIFICACIÓN** por instrucción rectora del 29-10-2026. Sin cliente real no hay aceptación final. Este control fue de **solo lectura de producción**, con escritura únicamente de esta evidencia documental en `Rick2818/Fabrica-de-Agentes-IA`. No se invocó el ejecutor, no se ejecutó manualmente `private.fabrica_scheduler_tick()`, no se encolaron prácticas, no se alteraron trabajos, locks, cuotas, `not_before`, Site ni programación, y no se hicieron contactos, pagos ni envíos.

Site original: `appgprj_6adbf0c05a0c8191b2ca585b76f5e862`. Supabase: `udispwzwrebjkanudcoy`. Corte: 2026-10-29 21:13:13 UTC / 15:13:13 SV.

## Cron real, recibos y correlación
- `cron.job`: único job coincidente `fabrica-queue`, `jobid=1`, `active=true`, expresión `* * * * *`, comando `select private.fabrica_scheduler_tick();`. `cron.job_run_details`: **1556/1556 succeeded**, último inicio 21:13 UTC; **+62** desde control 14:11 SV. Estos éxitos son SQL, **no** entregas `done`.
- `private.fabrica_scheduler_receipts`: **841 recibos**, 841 UUID de ciclo distintos y 841 `request_id` distintos; **840 verified=true**, **1 reciente en conciliación normal** (UUID `04e2a5ea-e252-4707-99f9-8694c48c0189`, 21:13 UTC, `checked_at=null`). Entre los verificados: **822 idle, 9 done, 4 waiting, 2 error, 1 busy, 1 quota, 1 idle adicional**? **Nota:** distribución observada en la consulta de las 21:12 UTC fue 822 idle, 9 done, 4 waiting, 2 error, 1 busy, 1 quota = **839 verificados**; al corte 21:13 se sumó un `idle` verificado, para **823 idle / 840 verificados**. Las nueve entregas `done` siguen siendo **históricas**, sin entregas nuevas.
- `net._http_response`: tres muestras recientes verificadas (UUID `bdad3c15-ba7a-4338-928e-1cb5d605ebdc`, `688064d1-5ee7-4926-937b-9edcca9fd18b`, `ba3acacd-a126-4f27-a866-8f32dcb6ebd1`) coinciden entre `cycle_id`, `receipt.supabase.run_id`, origen `supabase-cron`, `site_status=idle` y HTTP 200. **Ninguna representa trabajo `done`.**
- `health.supabase_runner` del Site registra ciclo `c145b073-8ecc-4d58-a1a6-2828e9427871` con origen `supabase-cron` y `idle`; el mismo UUID quedó `verified=true,site_status=idle` en Supabase tras conciliación. Es correlación de ejecución programada real, **no** entrega funcional.
- `private.fabrica_scheduler_config`: `enabled=true`, `not_before=null`, `last_error=null`; **cero recibos no conciliados con más de 2 minutos**, cero verificaciones fallidas conciliadas. Las respuestas `error`, `waiting`, `busy`, `quota` son históricas y no se reinterpretan como `done`.

## Cola, locks, reintentos, idempotencia y logs
- `agent_status` Site: **65 trabajos: 60 done, 2 failed históricos, 3 cancelled**, sin trabajos activos o pendientes en la instantánea; cuota **17/20**, autonomía `recent`, `deferred_until=null`. Un trabajo sintético previo completó en segundo intento, pero no se creó ni repitió aquí.
- Inspección de funciones SQL `private.fabrica_scheduler_tick` y `private.fabrica_scheduler_reconcile`: guarda `pg_try_advisory_xact_lock`, bloqueo de fila de configuración, `not_before`, exclusión de recibos sin conciliar, validación de identidad/origen/UUID/estado de Site, y recuperación ante error de transporte con diferimiento. Índices únicos de `cycle_id` y `request_id` presentes. **Inspección estática, no prueba formal de carreras ni de reanudación.**
- Logs unificados consultados entre 20:00 y 21:13 UTC: 176 `postgres_logs` y 3 `pgbouncer_logs`; no se extrapola ausencia total de errores de estos conteos. La evidencia operativa más fuerte son recibos y ciclos conciliados.

## GitHub, fuente nativa y respaldo
- `AGENTS.md` leído desde `main`: conserva reglas de preservar Site, datos y permisos; seis agentes Leo, Mila, Vera, Alma, Nico, Lía y límites de autonomía.
- **Siete workflows** leídos individualmente: `agent-runner`, `diagnostic-a-scheduler`, `diagnostic-b-conditions`, `diagnostic-c-actor`, `factory-regression`, `training-regression`, `verify-training`. **Ninguno declara `schedule:`**; solo `workflow_dispatch`, `push` o `pull_request` según archivo. Un `health.cloud_runner` histórico con `event=schedule` no implica que GitHub siga programado.
- Respaldo horario `Respaldo de pendientes Fábrica IA`, ID `6adbf94d28e8819189c0516c6068457a`, comprobado con Automations: **habilitado**, último registro `no_update`; no fue invocado ni cambiado. `latest_result` corresponde a otra ejecución anterior y no acredita trabajo nuevo.
- **Fuente nativa v53 recuperada** (commit nativo `5be977154cc15c9511787d22e28b7367e6f00467`, 122 pruebas de servidor aprobadas en worktree) preservada como antecedente, **no reejecutada**. Ese identificador no existe como commit GitHub del repositorio (API GitHub 422), lo que **no invalida el commit nativo de Sites**. El acceso nativo de Sites para comparar el código desplegado no estuvo disponible mediante los conectores de esta ejecución; no se declara imposible inspeccionar la fuente. **v54 no fue activada ni desplegada en este control**. Un merge GitHub no acredita despliegue del Site.

## Pendientes sin marcar aprobados
1. Verificación por acceso **nativo Sites** de hash y versión efectivamente desplegados, comparación sin sobrescritura contra fuente v53 y v54 guardada.
2. Pruebas **aisladas** de dos consumidores simultáneos, exclusión de lease, reintento tras timeout/HTTP perdido, idempotencia, pausa/reanudación, cancelación y respeto de `not_before`; no alterar cola, cuotas ni fechas productivas.
3. E2E sintético adicional únicamente en aislamiento seguro con recibos persistidos y correlación `cycle_id`/trabajo/resultado `done`; no atribuir aceptación comercial.
4. Aceptación final y recibos verificables de **cliente real** cuando exista.

**Resultado:** no regresión nueva confirmada ni cambio seguro necesario en producción. **Punto 4 cerrado provisionalmente, sin certificación.**
