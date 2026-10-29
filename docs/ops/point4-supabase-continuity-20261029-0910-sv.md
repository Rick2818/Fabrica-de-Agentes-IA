# Fábrica de Agentes IA — Punto 4 — auditoría 2026-10-29 09:10 SV

## Corte y alcance
Corte SQL **2026-10-29 15:10:00 UTC** (09:10 America/El_Salvador). Proyecto Supabase `udispwzwrebjkanudcoy`; Site `appgprj_6adbf0c05a0c8191b2ca585b76f5e862` mediante complemento `agent_status`; repositorio `Rick2818/Fabrica-de-Agentes-IA` (AGENTS.md y seis workflows leídos). Auditoría **solo lectura**: no se llamó `fabrica_scheduler_tick()` manualmente, no se invocó `run_pending_tasks`, no se crearon tareas sintéticas ni se alteraron trabajos, cuotas, fechas, secretos, cron o Site.

## Agenda y recibos
- `cron.job`: exactamente un cron activo `jobid=1`, `jobname=fabrica-queue`, `schedule=* * * * *`; `private.fabrica_scheduler_tick` sigue siendo el principal.
- `cron.job_run_details`: **1,193** ejecuciones SQL `succeeded`, **0** no exitosas; última `2026-10-29 15:10:00.032546 UTC`. Incremento **+62** frente al corte 08:08 SV (1,131). SQL `succeeded` no equivale a procesamiento `done`.
- `private.fabrica_scheduler_receipts`: **479** registros, **479** UUID únicos. **478** verificados y **1** pendiente de conciliación (15:10 UTC, `checked_at=null`). Desglose: **9 done, 462 idle, 4 waiting, 2 error, 1 quota, 1 pendiente**. `error_code` no nulo: 0; recibos conciliados no verificados: 0.
- Nueve `done` con `verified=true`, `http_status=200`, UUID de ciclo únicos y `error_code=null`; **ningún nuevo done** desde la revisión anterior. Las respuestas HTTP originales de estos nueve ciclos no se conservan en `net._http_response`; se dispone de verificaciones persistentes y evidencia del Site, no de una nueva lectura de esos cuerpos.
- Correlación viva: ciclo `d864e5c7-9dd4-4083-b590-310a96dbc85a` (15:09 UTC) coincide en SQL, `net._http_response` y Site: HTTP 200, `receipt.source=supabase-cron`, `run.status=idle`, `verified=true`. Ciclo 15:10 `845a368c-8dee-4431-b3c7-bc097d97e23d`: respuesta HTTP 200, UUID coincidente, `idle` y sin error de transporte; **todavía no conciliado** al corte, no se cuenta como `verified` ni `done`.
- Configuración: `enabled=true`, `not_before=null`, `last_error=null`. Sin modificación de diferimientos ni cuota.

## Site y continuidad de las seis especialidades
- Complemento `agent_status`: **64 tareas**, **59 done**, **2 failed**, **3 cancelled**, **0 pendientes**; cuota **15/20**. `health.supabase_runner` último ciclo principal `idle`, `pending=0`, UUID `845a368c-8dee-4431-b3c7-bc097d97e23d`. `health.cloud_runner` conserva evento histórico de GitHub `schedule` anterior; **no acredita que GitHub siga programado**.
- Se conservan nueve trabajos `done` del Site con `execution_source=supabase-cron`, incluidos Leo/Ventas, Mila/Servicio al cliente, Vera/Finanzas, Alma/Química y farmacia, Nico/Logística y Lía/Mercadeo, más tres trabajos técnicos. Los resultados de entrenamiento son sintéticos, no acciones en sistemas externos.
- Reintentos históricos: Nico `attempts=5`, Alma `attempts=2`; no se inyectaron nuevos fallos ni se hizo prueba de recuperación en esta revisión. Una entrega analítica histórica intercambia Alma/Lía: conservar sin usar como verdad canónica.

## Bloqueos, controles y logs
- Se inspeccionaron definiciones SQL vigentes de `private.fabrica_scheduler_tick` y `private.fabrica_scheduler_reconcile`: `pg_try_advisory_xact_lock(1432658222,51)`, `FOR UPDATE` sobre configuración, guarda de `enabled`/`not_before`/recibo pendiente, conciliación de fuente, proyecto, schedule, UUID, tiempos y job ID. Recuperación definida para `network_error`, `http_*`, `receipt_mismatch`, `response_not_valid`, `response_missing` con diferimiento de 5 minutos; no se activó artificialmente.
- Índices únicos en `cycle_id` y `request_id`; 0 advisory locks concedidos en instantánea, **no** es prueba de exclusión mutua bajo concurrencia.
- Logs unificados 14:08–15:10 UTC: 148 `postgres_logs`, 3 `pgbouncer_logs`; filtro textual `error`/`failed` en `postgres_logs` devolvió 0. No prueba ausencia absoluta de errores.
- `AGENTS.md` leído en main; conserva identidad de las seis mascotas y preservación del Site. Se leyeron íntegros `.github/workflows/agent-runner.yml`, `diagnostic-a-scheduler.yml`, `diagnostic-b-conditions.yml`, `diagnostic-c-actor.yml`, `training-regression.yml`, `verify-training.yml`: **ninguno contiene trigger `schedule`**; `agent-runner.yml` es manual `workflow_dispatch`; otros tienen `push` y/o manual. No se inició workflow.
- Respaldo horario `6adbf94d28e8819189c0516c6068457a`: `is_enabled=true`; último run registrado `completed` a las 14:09 UTC, `latest_result=null`. No se infiere procesamiento de cola del respaldo ni se le invocó.

## Límites y dictamen
Intento de inspección directa del editor Sites con Browser: error de acceso por falta de contexto de navegador de origen. **No se inspeccionó la fuente exacta actualmente publicada** y no se presume equivalencia entre main y Site. Sin prueba productiva nueva de concurrencia, pausa/reanudación, pérdida de respuesta de transporte o E2E de provisión. La cola está vacía y no procede consumir cuota o fabricar trabajo para generar `done`.

**Resultado:** continuidad del cron principal operativa al corte; autonomía programada de seis especialidades sustentada en nueve entregas históricas verificadas. **Certificación integral del punto 4: pendiente.** No se detectó bloqueo nuevo que justifique parche productivo. Mantener un solo ejecutor y el respaldo sin competencia. Próximo paso de cierre: inspeccionar fuente vigente de Sites y diseñar pruebas controladas no disruptivas con aislamiento de trabajos y sin consumo adicional de cuota.

Comparación: [auditoría 08:08 SV](point4-supabase-continuity-20261029-0808-sv.md).
