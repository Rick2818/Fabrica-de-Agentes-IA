# Punto 4 — continuidad y evidencia de solo lectura — 2026-10-31 06:12 SV

## Estado rector y alcance
**CERRADO PROVISIONALMENTE, SIN CERTIFICACIÓN.** No hay cliente real para la aceptación final; su ausencia no reabre el cierre. Exclusivamente Fábrica de Agentes IA, Site `appgprj_6adbf0c05a0c8191b2ca585b76f5e862`, repositorio `Rick2818/Fabrica-de-Agentes-IA`, Supabase `udispwzwrebjkanudcoy`. Auditoría de solo lectura. No alterar ejecutores, horarios, cuota, `not_before`, trabajos, modelos ni producción. No desplegar v54 guardada.

## Evidencia directa — corte SQL 2026-10-31 12:11:43 UTC (06:11:43 SV)
1. **Principal Supabase**: `cron.job` muestra `jobid=1`, `jobname=fabrica-queue`, `schedule=* * * * *`, `active=true`, comando `select private.fabrica_scheduler_tick();`. `private.fabrica_scheduler_config`: `enabled=true`, `not_before=NULL`, `last_error=NULL`. `cron.job_run_details`: **3,894** registros `succeeded` históricos, **240** `succeeded` en la ventana de cuatro horas consultada (a las 12:10 UTC). `succeeded` acredita ejecución SQL, no procesamiento `done`.
2. **Recibos**: `private.fabrica_scheduler_receipts`: **3,156** recibos, **3,151** verificados; **9** `site_status=done` históricos y **4** `error_code=network_error` históricos, sin nuevos `done` ni errores de transporte en el intervalo. Distribución de la consulta cercana al corte: `idle=3,134`, `done=9`, `waiting=4`, `error=2`, `busy=1`, `quota=1`, cuatro `network_error` sin estado y un ciclo reciente sin conciliar. El total puede variar durante la ejecución del cron.
3. **Correlación de UUID**: ciclo `336d42c5-297c-48c4-8e6e-7f267b6ff69c`, programado a las 12:10 UTC, coincide con `health.supabase_runner.supabase.run_id` y `health.autonomy.primary.last_cycle.cycle_id` del Site; SQL lo concilió a las 12:11 UTC con HTTP 200, `verified=true`, `site_status=idle`. El siguiente `a989354e-3035-40f9-a4cd-2138726fec08` (12:11 UTC) figuraba aún sin `checked_at` al consultar; no considerarlo error confirmado ni entrega. `idle` y HTTP 200 no prueban trabajo `done`.
4. **Integridad**: cero UUID duplicados; cero `request_id` duplicados; cero recibos antiguos no verificados sin error (umbral tres minutos). Índices únicos `fabrica_scheduler_receipts_pkey(cycle_id)` y `fabrica_scheduler_receipts_request_id_key(request_id)` presentes. Hashes MD5 sin cambios respecto al control anterior: `fabrica_scheduler_tick=7fb25848caa91dc78eb0f469659f691d`; `fabrica_scheduler_reconcile=78a1057460b103ae1cddfb5d5e0339f0`.
5. **Site por conector operativo**: `agent_status` informa `automation.enabled=true`, `health.autonomy.primary.recent=true`, `health.supabase_runner.status=idle`, `pending=0`, `next_at=NULL`; 65 trabajos totales: **60 done, 2 failed históricos, 3 cancelled, 0 pendientes/activos**. Uso de modelo **0/20**. Sin leases activos en trabajos visibles. El estado `backup.recent=false` del Site no equivale a respaldo deshabilitado.
6. **Respaldo horario**: `Automations.peek` para `6adbf94d28e8819189c0516c6068457a` confirma `is_enabled=true`; última ejecución registrada `2026-10-31T11:04:39Z`, `recorded_status=no_update`. No demuestra entrega ni procesamiento, pero sí que la programación sigue habilitada. No se lanzó un ciclo competidor.
7. **GitHub**: se leyó `AGENTS.md` de `main` y se enumeraron y leyeron individualmente los siete workflows actuales: `agent-runner.yml`, `diagnostic-a-scheduler.yml`, `diagnostic-b-conditions.yml`, `diagnostic-c-actor.yml`, `factory-regression.yml`, `training-regression.yml`, `verify-training.yml`. **Ninguno tiene disparador `on.schedule`**; `agent-runner` solo `workflow_dispatch`. Otros workflows usan `push`/`pull_request` para pruebas, no programación de cola.
8. **Logs**: ventana `2026-10-31T10:10:00Z`–`12:10:00Z`, 287 entradas `postgres_logs`, seis `pgbouncer_logs`; cero coincidencias textuales `error` o `timeout` en `event_message` bajo ese filtro. No explica los cuatro `network_error` históricos ni descarta fallos no registrados o con otra representación.
9. **Modelos**: historial sintético del Site: `gemini-2.5-flash` principal HTTP 404, `gemini-2.5-flash-lite` respaldo HTTP 404, `gemini-3.5-flash-lite` tercero HTTP 200. No se repitió la prueba, ni se certificó recuperación real ante fallo de proveedor.

## Diferencias y riesgos a conciliar (sin modificar)
- `agent_status` contiene una nota histórica que atribuye v58 y un deployment `succeeded` al Site con URL `https://agente-ricardo-revision-rick.rick271711.chatgpt.site`. El repositorio `main`, en `scripts/run-cloud-queue.mjs` y `agent-runner.yml`, conserva como destino manual `https://agente-ricardo-revision-rick.glassybell1025.chatgpt.site`. **No inferir cuál es el origen efectivamente desplegado** sin lectura nativa de Sites. GitHub runner no está programado, por lo que esta diferencia no demuestra fallo del cron principal; sí exige revisión antes de cualquier ejecución manual.
- `worker/runtime.mjs` de `main` declara `MODEL='gemini-3.6-flash'`, mientras la nota operativa del Site informa una cadena de modelos distinta. **No sustituir el código desplegado por `main` ni por v53** hasta comparar fuentes nativas, versiones y cambios.
- La fuente nativa asociada a v53 se recuperó anteriormente en commit `5be977154cc15c9511787d22e28b7367e6f00467` y tiene **122 pruebas de servidor aprobadas en su worktree**, evidencia histórica que no certifica la versión desplegada. El acceso nativo de Sites no estuvo disponible en esta ejecución; no se interpretó como imposibilidad general de inspección.

## Comparación con control de 05:09 SV
- SQL `succeeded`: **3,832 → 3,894** (+62).
- Recibos: **3,094 → 3,156** (+62); verificados: **3,089 → 3,151** (+62).
- `done` históricos: **9 → 9**; errores `network_error`: **4 → 4**.
- Site: **60 done / 2 failed / 3 cancelled / 0 pendientes**, sin cambio funcional nuevo.

## Pendientes, expresamente no aprobados
- Verificación nativa de versión, fuente y despliegue del Site, y conciliación de destinos/modelos antes de cualquier cambio.
- Pruebas dinámicas **aisladas** de concurrencia, locks, idempotencia, pausas, `not_before`, reintentos, recuperación persistente y fallback. No ejecutadas en esta revisión. No forzar tick ni cambiar cuota o fechas.
- Diagnóstico causal de los cuatro `network_error` históricos.
- Prueba E2E con recibos por cada uno de los seis agentes y aceptación real del cliente (separadas las pruebas sintéticas). No se declara certificación.

**Acción**: solo lecturas a Supabase, conector operativo Site, Automations y GitHub; se registra este informe. No se tocaron producción, ejecutores, trabajos, cuotas, versiones, fechas, proveedores, pagos ni comunicaciones. Ninguna regresión nueva confirmada que justifique cambio inmediato. **Cierre provisional intacto.**
