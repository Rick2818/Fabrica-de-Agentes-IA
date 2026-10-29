# Fábrica de Agentes IA — Punto 4 — auditoría 2026-10-29 10:11 SV

## Identidad, alcance y corte
- Solo Fábrica de Agentes IA. Site `appgprj_6adbf0c05a0c8191b2ca585b76f5e862`; repositorio `Rick2818/Fabrica-de-Agentes-IA`; Supabase `udispwzwrebjkanudcoy`.
- Corte SQL **2026-10-29 16:11:06.718193 UTC** (10:11 SV); consulta posterior de HTTP reciente y `agent_status` aproximadamente a las 16:11 UTC. Proyecto Supabase: `ACTIVE_HEALTHY`.
- **Auditoría solo lectura de producción**: no se llamó `fabrica_scheduler_tick()`, `run_pending_tasks`, ni se crearon pruebas sintéticas, tareas, ejecutores o disparadores. No se cambiaron cuotas, fechas, Site, secretos, trabajos, locks o código de producción.

## Programador y resultados — distinguir SQL, HTTP y trabajo
- `cron.job`: **un único job activo** `jobid=1`, `jobname=fabrica-queue`, `schedule=* * * * *`, comando invoca `private.fabrica_scheduler_tick`. No hay otro cron Supabase activo en esta consulta.
- `cron.job_run_details`: **1,254** ejecuciones SQL `succeeded`, **0** otras; última 16:11:00.020923 UTC. **+61** frente al corte 09:10 SV (1,193). `succeeded` no prueba entrega funcional.
- `private.fabrica_scheduler_receipts`: **540** filas y **540** UUID únicos; **539** `verified=true`; **1** recién creado pendiente de conciliación (`checked_at=null`, `verified=false`). **9** `site_status=done` y `verified=true`, los mismos nueve históricos; **523 idle**, **4 waiting**, **2 error**, **1 quota**, **1 pendiente**. `error_code` no nulo: **0**. Ningún nuevo `done`.
- Los nueve `done` históricos tienen nueve UUID y nueve `request_id` distintos, `verified=true`, `http_status=200`, `error_code=null`, y `site_completed_at` persistido. Sus respuestas HTTP originales ya no están retenidas en `net._http_response`: no se afirma lectura actual de esos cuerpos.
- Correlación HTTP viva: ciclo **`c4e14167-d951-4235-941d-872d13dd34e8`**, 16:10 UTC, `net._http_response.status_code=200`, `receipt.source=supabase-cron`, `project_id=udispwzwrebjkanudcoy`, `schedule_id=supabase:udispwzwrebjkanudcoy:fabrica-queue`, `receipt.supabase.run_id` coincide con UUID, `receipt.status=run.status=idle`, `verified=true`. El ciclo **`74f4e3e3-9cbd-436f-b775-d4c0131781cb`**, 16:11 UTC, también tiene HTTP 200 y esos campos coincidentes, `idle`, pero **todavía no estaba conciliado** en SQL al corte: no contarlo como `verified` ni `done`.
- `private.fabrica_scheduler_config`: `enabled=true`, `not_before=null`, `last_error=null`; no se adelantó ningún diferimiento.

## Site y seis especialidades
- Complemento conectado `agent_status`: **64 trabajos**: 59 `done`, 2 `failed` históricos, 3 `cancelled`; **0 pendientes**, **0 leases activos** en la instantánea, cuota **15/20**. Último ciclo del Site `source=supabase-cron`, UUID `74f4e3e3-9cbd-436f-b775-d4c0131781cb`, `status=idle`, `pending=0`.
- Nueve trabajos `done` en Site con evidencia `execution_source=supabase-cron`, incluidas prácticas de **Leo (Ventas), Mila (Servicio al cliente), Vera (Finanzas), Alma (Química y farmacia), Nico (Logística), Lía (Mercadeo)** y tres trabajos técnicos. `attempts=5` para Nico y `attempts=2` para Alma; evidencia histórica de reintento completado, no prueba inyectada hoy.
- Seis pruebas sintéticas `synthetic-six-20261028-{leo,mila,vera,alma,nico,lia}` aparecen `done`, pero con fuentes `mcp`/`scheduled-mcp`, **no** se atribuyen al cron principal. Resultados son sintéticos; no equivalen a acciones externas o paridad funcional con Dots.
- Los dos `failed` históricos no son pendientes activos; no se modificaron.

## Controles de continuidad y no competencia
- Lectura directa de `pg_get_functiondef` de `private.fabrica_scheduler_tick` y `private.fabrica_scheduler_reconcile`: `pg_try_advisory_xact_lock(1432658222,51)`, bloqueo `FOR UPDATE` de configuración, guardas `enabled`/`not_before`/recibo sin conciliar, verificación estricta de origen/proyecto/schedule/UUID/tiempos/estado/job_id, y diferimiento de 5 minutos ante errores de transporte/HTTP/recibo faltante o inválido. No se ejecutó manualmente ninguna función.
- Índices únicos para `cycle_id` y `request_id`; cero duplicados de ambas claves. No había advisory locks de la clase consultada en instantánea: **no** certifica exclusión mutua bajo carrera real. Tampoco se realizaron pruebas nuevas de pausa/reanudación o fallo de transporte.
- Logs unificados 15:00–16:11 UTC: **168 postgres_logs**, **3 pgbouncer_logs**; filtro textual de `error`/`failed` en postgres_logs: **0**. Esto no acredita ausencia universal de fallos.
- `AGENTS.md` leído en `main`: identidad de las seis mascotas, límites y preservación del Site.
- Se leyeron completos los seis workflows de `.github/workflows/`: `agent-runner.yml`, `diagnostic-a-scheduler.yml`, `diagnostic-b-conditions.yml`, `diagnostic-c-actor.yml`, `training-regression.yml`, `verify-training.yml`. **Ninguno tiene evento `schedule`**. El ejecutor GitHub solo `workflow_dispatch`; los workflows de pruebas pueden tener `push`. El registro histórico de `github-actions` `event=schedule` en el Site no representa configuración actual.
- Automatización de respaldo `6adbf94d28e8819189c0516c6068457a`: `is_enabled=true`; último run registrado `no_update`, ID `7b69e1b6-41ec-8322-b884-f57d86211030`, completado 15:50:11 UTC, `latest_result=null`. No se atribuye entrega al respaldo ni se le invocó.

## Límite de acceso y dictamen
- Intento de inspección del editor Sites mediante Browser: **`Browser access requires the originating browser context`**. La fuente exacta vigente del editor no pudo leerse; **no** se presume que coincida con GitHub `main`, y no se reemplazó por una copia antigua.
- La cola está vacía: no corresponde fabricar `done` mediante tick manual, cambios de cuota o modificación de `not_before`.
- **Punto 4: autonomía programada histórica de las seis especialidades sustentada; certificación integral pendiente** de inspección directa de la fuente Site y pruebas controladas, aisladas y no disruptivas de concurrencia, pausa/reanudación y recuperación de transporte. Sin bloqueo nuevo que justifique cambio productivo.
- Comparación: [auditoría 09:10 SV](point4-supabase-continuity-20261029-0910-sv.md).
