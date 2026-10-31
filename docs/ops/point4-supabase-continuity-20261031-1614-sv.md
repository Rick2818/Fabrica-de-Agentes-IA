# Fábrica de Agentes IA — Punto 4: control de continuidad (2026-10-31 16:14 SV)

**Estado rector:** CERRADO PROVISIONALMENTE, SIN CERTIFICACIÓN. No cliente real; no reabrir por ese motivo. Esta auditoría es solo lectura y no sustituye aceptación de cliente ni pruebas dinámicas.

## Fuentes consultadas
- Supabase project `udispwzwrebjkanudcoy`, consultas SQL de `cron.job`, `cron.job_run_details`, `private.fabrica_scheduler_config`, `private.fabrica_scheduler_receipts`, índices y funciones; corte SQL `2026-10-31T22:14:44Z`.
- Complemento Fábrica de Agentes IA `agent_status`: jobs, usage, health/autonomy, ciclos y recibos del Site original `appgprj_6adbf0c05a0c8191b2ca585b76f5e862`.
- GitHub `main`: `AGENTS.md` y contenido individual de los siete workflows `.github/workflows/*.yml`.
- Automatización existente `Respaldo de pendientes Fábrica IA`: consulta de estado, sin ejecución forzada.
- Logs Supabase: en ventana 20:30–22:15 UTC se observaron 254 registros `postgres_logs` y 6 `pgbouncer_logs`; se verificó disponibilidad, no se diagnosticaron causalmente todos los eventos.
- Intento de clonar GitHub a worktree aislado local no disponible por resolución DNS del entorno; **no se ejecutaron pruebas dinámicas nuevas**.

## Ejecución principal, transporte y conciliación
- `cron.job`: único `fabrica-queue`, jobid 1, `* * * * *`, `active=true`, comando `select private.fabrica_scheduler_tick();`.
- `private.fabrica_scheduler_config`: `enabled=true`, `not_before=null`, `last_error=null`.
- `cron.job_run_details`: **4497** filas `succeeded` al corte; 90 ejecuciones `succeeded` en la ventana de 90 minutos revisada. `succeeded` acredita la llamada SQL, no `done` de tareas.
- `private.fabrica_scheduler_receipts`: **3754** recibos, **3748** `verified=true`, **5** `error_code=network_error` históricos, **9** `site_status=done` históricos. Los errores no aumentaron desde el corte previo. Cero UUID de ciclo duplicados, cero `request_id` duplicados, cero recibos no verificados antiguos (>10 min) sin error.
- Último ciclo al corte: `e9b19ec3-66b6-42d5-b50a-e9dd68a301b0`, programado 22:14:00 UTC, `request_id=3755`. El Site muestra `source=supabase-cron`, `status=idle`, inicio 1793484840382 y fin 1793484840913. La fila SQL aún tenía `checked_at=null`, `verified=false`, `site_status=null` al corte 22:14:44 UTC; **conciliación SQL pendiente dentro de su ventana normal**, no marcar verificado anticipadamente.
- Ciclo anterior `9e8b0775-d8b2-4179-89e4-d86bae2a08c8`: `HTTP 200`, `verified=true`, `site_status=idle`; no constituye nueva entrega.
- Índices únicos: PK de `cycle_id` y unique de `request_id`. Funciones `fabrica_scheduler_tick` (md5 `7fb25848caa91dc78eb0f469659f691d`) y `fabrica_scheduler_reconcile` (md5 `78a1057460b103ae1cddfb5d5e0339f0`) contienen referencias estáticas a `not_before`; `tick` contiene `pg_try_advisory`. Esto no demuestra concurrencia, recuperación, pausas o reintentos en pruebas dinámicas.

## Estado del Site y respaldo
- `agent_status`: 65 trabajos: **60 done, 2 failed históricos, 3 cancelled, 0 pending**. `health.autonomy.stalled=false`, `oldest_due=null`; cuota actual **0/20**. Últimos ciclos automáticos recientes `idle`, sin entregas nuevas. No se modificó la cola.
- El Site reporta configuración de modelos `gemini-2.5-flash` principal, `gemini-2.5-flash-lite` respaldo y `gemini-3.5-flash-lite` tercero. Las últimas pruebas registradas de los dos primeros devolvieron HTTP 404 y la tercera HTTP 200; **no declarar los tres operativos**. Es evidencia histórica, no una prueba nueva.
- `Respaldo de pendientes Fábrica IA` (`6adbf94d28e8819189c0516c6068457a`) permanece `is_enabled=true`; último run registrado `no_update` el 31-10 21:45 UTC. No se invocó `run_pending_tasks`, para evitar competir con Supabase.
- Se releyeron los siete workflows GitHub: **ninguno contiene `schedule` ni `cron`**, aunque hay triggers `workflow_dispatch`, `push` o `pull_request`. `agent-runner.yml` manual conserva `SITE_ORIGIN` `https://agente-ricardo-revision-rick.glassybell1025.chatgpt.site`, diferente de URL `https://agente-ricardo-revision-rick.rick271711.chatgpt.site` guardada en nota operativa de v58. Reconciliar antes de cualquier ejecución manual; no modificar en esta auditoría.

## Fuente, identidad y certificación
- `AGENTS.md` vigente asigna Leo=Ventas, Mila=Servicio al cliente, Vera=Finanzas, Alma=Química/Farmacia, Nico=Logística y Lía=Mercadeo. Algunas fichas sintéticas históricas contienen identidades diferentes: **no reinterpretarlas ni alterar recibos antiguos**.
- Fuente nativa asociada a Site v53 recuperada previamente en commit `5be977154cc15c9511787d22e28b7367e6f00467`, con 122 pruebas servidor históricamente aprobadas. Este control **no obtuvo fuente nativa nueva ni comprobó paridad del código efectivamente desplegado**. El Site reporta en nota operativa v58, pero no se verificó el artefacto nativo en esta pasada. v54 guardada sin desplegar: no activar.
- Pendientes: comparar fuente nativa y despliegue vigente sin sustituir código; pruebas dinámicas aisladas de concurrencia, idempotencia, leases, reintentos, pausa/reanudación, `not_before`, fallback y recuperación; diagnóstico causal de cinco errores de transporte; E2E real con recibos de acciones y aceptación de cliente cuando exista. Los seis ejercicios sintéticos históricos no equivalen a fabricación y entrega E2E.
- No se enviaron correos, contactaron terceros, activaron pagos, modificaron producción, cuotas, fechas, ejecutores, versiones o trabajos. No se ejecutó ningún tick adicional ni se creó un segundo disparador.

**Resultado:** no hay regresión nueva confirmada ni entrega funcional nueva. Conservar cierre provisional sin certificación.

## Conciliación posterior al corte
Consulta independiente a las 22:15:05 UTC: el ciclo `e9b19ec3-66b6-42d5-b50a-e9dd68a301b0` quedó finalmente `verified=true`, `site_status=idle`, sin `error_code`. El nuevo ciclo `01d5b053-07e3-452a-9c69-b7e566d6b2ec` acababa de programarse y seguía pendiente de conciliación normal. No hay entrega nueva. Esta nota posterior no altera las cifras del corte 22:14:44 UTC.
