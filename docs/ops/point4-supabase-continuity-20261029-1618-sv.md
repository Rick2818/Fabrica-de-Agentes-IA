# Fábrica de Agentes IA — Punto 4 — control de continuidad 2026-10-29 16:18 SV

## Dictamen rector
**CERRADO PROVISIONALMENTE, SIN CERTIFICACIÓN** (instrucción 29-10-2026). No hay todavía cliente real para aceptación final; esta ausencia no reabre el cierre administrativo. Inspección de solo lectura en Supabase, complemento del Site y GitHub; única escritura: este documento de evidencia. No se invocó `run_pending_tasks`, ni `private.fabrica_scheduler_tick()`, ni se creó trabajo sintético; no se tocaron colas, locks, cuotas, fechas, secretos, Site, v54, ejecutores ni respaldo. Sin contactos ni pagos.

Site original `appgprj_6adbf0c05a0c8191b2ca585b76f5e862`; Supabase `udispwzwrebjkanudcoy`; GitHub `Rick2818/Fabrica-de-Agentes-IA`. Corte SQL: 2026-10-29 22:18 UTC / 16:18 SV (la telemetría del Site también registró el ciclo de ese minuto).

## Cron principal y evidencia de recibos
- `cron.job`: un único job, `jobid=1`, `jobname=fabrica-queue`, `active=true`, `schedule=* * * * *`, comando `select private.fabrica_scheduler_tick();`.
- `cron.job_run_details`: **1621 ejecuciones, 1621 `succeeded`, 0 con otro estado**; última iniciada 22:18:00 UTC. +65 desde la revisión 15:13 SV (1556). **Éxito SQL no equivale a `done`.**
- `private.fabrica_scheduler_receipts`: **906 recibos, 906 UUID únicos y 906 request_id únicos**; **905 verificados, 1 reciente pendiente de conciliación**. Distribución: **888 `idle`, 9 `done`, 4 `waiting`, 2 `error`, 1 `busy`, 1 `quota`, 1 sin estado/no verificado**. Los nueve `done` son históricos, del 29-10-2026 07:08–07:27 UTC; **0 nuevas entregas `done`**.
- Recibo aún no conciliado al corte: `cycle_id=0b535394-b15e-4109-a779-dfa8e4fafd75`, `request_id=907`, programado 22:18:00 UTC, `checked_at=null`, sin `error_code`. La respuesta `net._http_response` ya existe con HTTP 200, origen `supabase-cron`, `receipt.supabase.run_id` igual al UUID y estados `receipt.status=run.status=idle`. **No se marcó como verificado en SQL ni se invocó reconciliación manual**.
- Dos recibos previos (UUID `77012a26-7adf-4e28-9291-f10a7ae6b8a0`, `0dd04339-3014-4ee5-8a0b-19941df9ddf3`) coinciden entre SQL, respuesta HTTP y estado `idle`; no se interpretan como entregas. `net._http_response` ya no conserva las respuestas originales de los 9 `done`, pero permanecen los recibos persistentes verificados.
- Configuración `enabled=true`, `not_before=null`, `last_error=null`. **0 recibos pendientes con más de 2 minutos**. Sin duplicaciones de `cycle_id` ni `request_id`.

## Site, cola y continuidad
- Lectura del complemento Site `agent_status`: **65 trabajos: 60 `done`, 2 `failed` históricos, 3 `cancelled`; 0 pendientes/activos**. Cuota **17/20**. `health.autonomy.status=recent`, `deferred_until=null`. El ciclo programado más reciente reportado por el Site tiene `cycle_id=0b535394-b15e-4109-a779-dfa8e4fafd75`, origen `supabase-cron`, estado `idle`; coincide con la respuesta HTTP de la petición 907, sin confundirlo con `done`.
- `private.fabrica_scheduler_tick`: inspección estática confirma `pg_try_advisory_xact_lock(1432658222,51)`, `FOR UPDATE` de configuración, respeto de `not_before`, espera por recibos no conciliados y UUID nuevo por ciclo. `private.fabrica_scheduler_reconcile` valida origen, proyecto, schedule_id, UUID, fecha y estados; establece diferimiento de 5 minutos en errores y respeta `receipt.next_at` cuando corresponde. Índices únicos de `cycle_id` y `request_id` inspeccionados. **No son pruebas dinámicas de concurrencia, timeout ni recuperación**.
- Logs unificados de Supabase, ventana 21:13–22:19 UTC: 159 `postgres_logs`, 3 `pgbouncer_logs`; búsqueda de texto `ERROR`/`FATAL` en `event_message` sin coincidencias en esa ventana. No se extrapola ausencia total de fallos.

## GitHub, fuente y respaldo
- `AGENTS.md` leído de `main`: preservar fuente, datos, permisos y aislamiento; seis mascotas Leo, Mila, Vera, Alma, Nico, Lía. Se inspeccionaron individualmente **7 workflows**: `agent-runner`, `diagnostic-a-scheduler`, `diagnostic-b-conditions`, `diagnostic-c-actor`, `factory-regression`, `training-regression`, `verify-training`. **Ninguno declara `schedule:` ni `cron:`**; triggers observados: `workflow_dispatch`, `push` y/o `pull_request`. Un registro histórico de `health.cloud_runner` con `event=schedule` no significa que hoy exista un trigger de GitHub.
- Respaldo horario `Respaldo de pendientes Fábrica IA`, ID `6adbf94d28e8819189c0516c6068457a`: comprobado **habilitado**, último intento registrado `completed` a las 21:26 UTC, `latest_result=null`; no demuestra entrega nueva ni se invocó o modificó en esta auditoría.
- Fuente nativa original **v53** recuperada, identificador `5be977154cc15c9511787d22e28b7367e6f00467`, con **122 pruebas de servidor aprobadas anteriormente** sobre su worktree. Se conserva como antecedente, **no reejecutado en este control**. La comparación nativa de versión/hash desplegados en Sites sigue sin verificación directa en esta ejecución; no atribuir este límite a imposibilidad de inspeccionar la fuente. **v54 guardada sin desplegar**, sin cambios.

## Pendientes no aprobados
1. Confirmar mediante acceso **nativo de Sites** el hash y versión efectivamente desplegados; comparar sin sobrescribir contra v53 recuperada y v54 guardada.
2. Probar en aislamiento real, sin competir con producción, simultaneidad de consumidores/leases, idempotencia de trabajo, pausas/reanudación, cancelación, timeout/HTTP perdido, reintentos y respeto de `not_before`.
3. E2E sintético adicional solo en entorno seguro, con recibos de trabajo y `cycle_id` persistidos y correlacionados; distinguir resultado técnico de aceptación comercial. **No se ejecutaron pruebas sintéticas nuevas en esta revisión.**
4. Cuando exista cliente real, validar aceptación final con evidencia del cliente y del procesamiento; no certificar automáticamente por pruebas sintéticas ni por el cron.

**Resultado:** continuidad programada observada sin regresión nueva comprobada; ninguna corrección productiva segura justificada. **Punto 4 CERRADO PROVISIONALMENTE, SIN CERTIFICACIÓN.**
