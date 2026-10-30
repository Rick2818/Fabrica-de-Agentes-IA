# Punto 4 — continuidad del ejecutor (2026-10-30 01:10 America/El_Salvador)

**Estado rector:** CERRADO PROVISIONALMENTE, SIN CERTIFICACIÓN. Auditoría técnica de solo lectura, sin cliente real. Este punto no es la estación 4 de diseño ni el issue #4 de capacidades.

## Fuentes verificadas y corte

- Proyecto Supabase `udispwzwrebjkanudcoy`, estado `ACTIVE_HEALTHY`; consultas SELECT a `cron.job`, `cron.job_run_details`, `private.fabrica_scheduler_config`, `private.fabrica_scheduler_receipts`, `net._http_response`, funciones e índices. Corte final de cron/recibos: **2026-10-30 07:10 UTC**.
- Complemento de la Fábrica `agent_status`, Site original `appgprj_6adbf0c05a0c8191b2ca585b76f5e862`, lectura a **07:10:00 UTC**.
- Repositorio `Rick2818/Fabrica-de-Agentes-IA`: `AGENTS.md` y los siete YAML en `.github/workflows/` leídos en `main`.
- Automatización de respaldo `6adbf94d28e8819189c0516c6068457a`: `Automations.peek`, `is_enabled=true`, último registro `no_update` iniciado 06:36 UTC; esto no acredita procesamiento de cola.
- Logs unificados Supabase, ventana 06:10–07:10 UTC: 145 eventos `postgres_logs` y 3 `pgbouncer_logs`. La muestra incluyó un error SQL 42703 causado por una consulta exploratoria de esta auditoría con nombre de columna inexistente; se corrigió la consulta, sin cambios de datos. No se atribuye al ejecutor.

## Resultados

1. `cron.job`: `fabrica-queue` (`jobid=1`), `active=true`, `* * * * *`. `cron.job_run_details`: **2,153** registros, **2,153 succeeded**, cero otros; último inicio **07:10 UTC**. `succeeded` es éxito de SQL, no de trabajo `done`.
2. `private.fabrica_scheduler_receipts`: **1,415 recibos**, **1,415 UUID distintos**, **1,410 verified**, **5 sin verificar**. Hay **9 `done` verificados históricos**, sin incremento frente al control anterior. Los recientes verificados son `idle`. El ciclo 07:09 UTC, UUID `36fbd736-620e-48eb-9329-a3e33a2e67af`, quedó `verified=true,site_status=idle,http_status=200`. El ciclo 07:10 UTC, UUID `fe4ff86e-5964-4a7d-b130-0d46c9e5b183`, aparecía en el Site como `idle` con fuente `supabase-cron` y estaba **todavía sin verificar en SQL al corte**; no se reclasificó manualmente.
3. Cuatro `network_error` históricos siguen sin verificación individual: 00:38 UTC `301f7d3c-d7d0-4d74-86de-072dc18f64f4`, 03:53 UTC `e557300e-1fa9-4015-97f7-4d831ff2b450`, 05:17 UTC `4dd8d3fe-9de6-40e8-8af7-de813e230d1b`, 05:54 UTC `904c6e64-4e73-4aea-a569-a11ab7234cd1`. Para los últimos tres, `net._http_response` conserva `timed_out=true` y timeout 55,000 ms; la respuesta del primero ya no estaba disponible en esa tabla, aunque conserva `error_code=network_error` en recibos y el registro previo lo clasificó como timeout. No hay un quinto error de transporte nuevo en este corte. No afirmar `done` para ninguno.
4. Site: **65 trabajos históricos: 60 done, 2 failed, 3 cancelled; cero pendientes y cero leases activos**. No confundir estos 60 trabajos con los nueve `done` del cron. Últimos ciclos del Site correlacionados por UUID y `schedule_id=supabase:udispwzwrebjkanudcoy:fabrica-queue` son `idle`. `health.autonomy.primary.recent=true`; `health.supabase_runner.status=idle`. No hay trabajo funcional nuevo.
5. **Cuota del Site: 0/20** a las 07:10 UTC (antes 20/20): cambio observado compatible con reinicio de cuota, no prueba de capacidad o entrega. No se utilizó para forzar una tarea. Modelos configurados: principal `gemini-2.5-flash`, respaldo `gemini-2.5-flash-lite`, tercero `gemini-3.5-flash-lite`; sondas sintéticas anteriores 404/404/200 respectivamente. Fallback E2E todavía no certificado.
6. `private.fabrica_scheduler_config`: `enabled=true`, `not_before=null`, `last_error=null`. Inspección estática de `fabrica_scheduler_tick` y `fabrica_scheduler_reconcile`: `pg_try_advisory_xact_lock`, `FOR UPDATE`, espera de respuesta pendiente, `not_before`, conciliación de origen/proyecto/schedule/UUID/tiempo/estado y pausa de cinco minutos ante fallo. Hash MD5 de definiciones: tick `7fb25848caa91dc78eb0f469659f691d`, reconcile `78a1057460b103ae1cddfb5d5e0339f0`. Índices únicos de `cycle_id` y `request_id`. Esto es inspección estática, **no** prueba formal de carreras, pausas, reintentos o idempotencia de entrega.
7. Los **siete workflows** de GitHub en `main` fueron inspeccionados individualmente: ninguno contiene `on.schedule`. `agent-runner.yml` solo permite `workflow_dispatch`; otros admiten `push`/`pull_request` de pruebas, no scheduler competidor. El historial de un antiguo `github-actions` con evento `schedule` en `health.cloud_runner` es histórico y no contradice la configuración actual.
8. `AGENTS.md` leído y preservado. No hubo acceso nativo directo a la definición del **despliegue actual del Site** en este control; el complemento acredita estado operativo, no hash del código desplegado. La fuente recuperada de v53 (`5be977154cc15c9511787d22e28b7367e6f00467`, 122 pruebas de servidor previamente aprobadas) se conserva como antecedente; no se reejecutó ni se asumió desplegada. No se activó v54 ni otra versión.

## Bloqueos y criterio de validación final

- Diagnóstico nativo de los cuatro timeouts de 55 s y del comportamiento del Site durante los UUID sin respuesta; no confundir recuperación posterior de `idle` con el resultado exacto de la petición fallida.
- Comparar **fuente y artefacto realmente desplegados** con la fuente vigente, preservando cambios posteriores a v53.
- Pruebas aisladas reproducibles de concurrencia/locks, idempotencia, `not_before`, reintentos, transporte, recuperación y fallback, con recibos E2E; **no se ejecutaron en este control y no están aprobadas**.
- Aceptación final y recibos de cliente real, todavía inexistentes.

**Acciones:** lecturas y creación de este documento solamente. Sin modificación de producción, jobs, cuotas, fechas, credenciales, workflows, ejecutores o respaldos; sin ticks manuales, clientes, mensajes, pagos ni terceros. El cierre administrativo provisional permanece vigente, sin certificación.
