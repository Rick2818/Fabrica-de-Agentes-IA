# Fábrica de Agentes IA — Punto 4, continuidad (2026-11-01 19:12 CST)

**Estado rector:** CERRADO PROVISIONALMENTE, SIN CERTIFICACIÓN. Auditoría de solo lectura. Proyecto Site `appgprj_6adbf0c05a0c8191b2ca585b76f5e862`; repositorio exclusivo `Rick2818/Fabrica-de-Agentes-IA`. No confundir con estación 4 ni issue #4.

## Corte y evidencia comprobable

- Supabase proyecto `udispwzwrebjkanudcoy`: consulta SQL a `2026-11-02 01:12:34.376659+00`. `cron.job_run_details`: **6,115** ejecuciones `succeeded`, **0** de otros estados; 90 `succeeded` en los últimos 90 minutos. La ejecución SQL no prueba procesamiento de tareas.
- `private.fabrica_scheduler_receipts`: **5,372** recibos, **5,366** `verified=true`, cinco `network_error` históricos (desde 2026-10-30 00:38Z hasta 2026-10-31 14:57Z), ningún error nuevo. Estados verificados históricos al corte: `idle=5,349`, `done=9`, `waiting=4`, `error=2`, `busy=1`, `quota=1`; no inferir entregas nuevas de los 9 `done` históricos. En 90 minutos: **89** `idle` verificados, **1** ciclo reciente aún no conciliado.
- Ciclo confirmado: `00154491-7598-4326-ad2f-49fdd04aa175`, `request_id=5372`, HTTP 200, `verified=true`, `site_status=idle`, correlacionado con el Site. Ciclo siguiente `c3946397-cd33-4f35-b1ce-42696eb53179`, `request_id=5373`, aparecía `idle` en el recibo del Site, pero **sin `checked_at` ni conciliación SQL** al corte. No se marca aprobado.
- **0** solicitudes pendientes de conciliación con más de tres minutos; **1** solicitud recién creada sin conciliar; **5** comprobaciones históricas fallidas ya conciliadas con `network_error`. `cycle_id` y `request_id` cuentan con índices únicos; sin duplicados observados.
- `cron.job`: un solo `fabrica-queue` (jobid 1, `* * * * *`, `active=true`, comando `select private.fabrica_scheduler_tick();`). Configuración `enabled=true`, `not_before=null`, `last_error=null`. Inspección de funciones: advisory transaction lock, `FOR UPDATE`, bloqueo ante recibo pendiente, reintentos diferidos, respeto de `not_before`, reconciliación de proveedor/proyecto/schedule/UUID/timestamp/estado y manejo de errores. **Inspección estática, no prueba dinámica nueva**.
- MCP nativo del Site: 65 trabajos (**60 done, 2 failed históricos, 3 cancelled, 0 pendientes**); cuota **0/20**. Salud: último ciclo `c3946397-cd33-4f35-b1ce-42696eb53179` con `source=supabase-cron`, `status=idle`; no equivale a trabajo completado. Seis prácticas sintéticas previas permanecen registradas, sin acreditar aprobación, fabricación, aprovisionamiento ni entrega E2E.
- Logs Supabase, ventana `2026-11-01T23:42:00Z` a `2026-11-02T01:12:00Z`: 217 registros `postgres_logs` y seis `pgbouncer_logs`. Filtro sobre `event_message` para `error`, `fail` y `timeout` sin coincidencias. Este filtro no excluye fallos de otros servicios ni garantiza ejecución `done`.
- GitHub: `AGENTS.md` revisado; los siete workflows no contienen `schedule`; `agent-runner.yml` solo `workflow_dispatch`. Los workflows de CI pueden usar `push`/`pull_request` pero no programan la cola. No se ejecutó ningún workflow.
- Automatizaciones: `Fábrica IA · Punto 4` y `Respaldo de pendientes Fábrica IA` consultadas, ambas `is_enabled=true`. Último registro del respaldo visible: `2026-11-02T00:39:22.974457+00`. No se ejecutó manualmente.
- Fuente nativa v53 recuperada anteriormente en commit `5be977154cc15c9511787d22e28b7367e6f00467`, 122 pruebas de servidor previamente aprobadas. **No se repitieron pruebas ni se verificó en este control la versión de despliegue efectiva por API nativa de Sites.** La nota histórica del Site menciona v58; no sustituye el cotejo de versión/despliegue/URL actuales. No se activó la v54 guardada.
- `AGENTS.md` asigna Leo/Ventas, Mila/Servicio, Vera/Finanzas, Alma/Química y farmacia, Nico/Logística, Lía/Mercadeo; algunas respuestas históricas del Site discrepan. No se reescribieron identidades ni recibos.
- Modelos: `gemini-2.5-flash` y `gemini-2.5-flash-lite` mantienen últimas pruebas sintéticas HTTP 404 sin resolución demostrada; el tercer modelo `gemini-3.5-flash-lite` tuvo HTTP 200 en prueba sintética histórica del 29-10. No se efectuaron nuevas llamadas ni cambios de proveedor.

## Brechas pendientes para validación final

1. Cotejo nativo de Sites de versión, SHA, despliegue y ambas URL vigentes, sin sustituir código ni desplegar v54.
2. Pruebas dinámicas **aisladas** de lock/doble ejecución, reintentos, idempotencia, pausa, recuperación, `not_before` y fallback sin afectar cuota ni trabajos ajenos.
3. Diagnóstico y resolución comprobada de HTTP 404 del primario y respaldo Gemini.
4. Recibos independientes y trazables de aprobación, fabricación, aprovisionamiento y entrega E2E con cliente sintético. `done` textual no equivale a estos eventos.
5. Aceptación final con cliente real cuando exista; no reabrir cierre administrativo provisional por su ausencia.

**Intervenciones:** solo lectura SQL, logs, MCP del Site, archivos GitHub y estado de automatizaciones; publicación de este documento. Sin segundo ejecutor, nuevos disparadores, tick forzado, cambios de cuota/fecha, envíos, pagos, llamadas a modelos, alteración de versiones ni producción. No se observó regresión operativa nueva que exija corrección inmediata.
