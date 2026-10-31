# Fábrica IA · Punto 4 — control de continuidad 2026-10-31 01:09 SV

**Estado rector: CERRADO PROVISIONALMENTE, SIN CERTIFICACIÓN.** Control de lectura y documentación. No se activaron ejecuciones manuales, correos, pagos, cuota, reintentos, triggers ni versiones. No existe cliente real para aceptación final; el cierre administrativo no se reabre por su ausencia.

## Fuentes y cortes verificables
- Proyecto Supabase `udispwzwrebjkanudcoy`: `ACTIVE_HEALTHY`. Consultas directas de `cron.job`, `cron.job_run_details`, `private.fabrica_scheduler_config`, `private.fabrica_scheduler_receipts`, índices y hashes de funciones SQL.
- Site `appgprj_6adbf0c05a0c8191b2ca585b76f5e862`: consulta operativa `agent_status` del complemento, **no lectura nativa independiente del código desplegado**.
- GitHub `Rick2818/Fabrica-de-Agentes-IA`: `AGENTS.md` y lectura individual de los siete archivos de `.github/workflows/` sobre `main`.
- Respaldo horario `6adbf94d28e8819189c0516c6068457a`: `Automations.peek`, `is_enabled=true`; último registro `no_update` a las 06:50 UTC. El estado del respaldo no prueba ejecución de un trabajo.
- Logs Supabase: búsqueda de `timeout`, `network_error` y `pg_net` tanto en la ventana histórica 2026-10-30 00:20–06:10 UTC como en 2026-10-30 07:10–2026-10-31 07:10 UTC: sin coincidencias bajo ese filtro. No demuestra causa ni ausencia universal de fallos.

## Hallazgos
1. A las **07:09 UTC**, un solo cron job: `fabrica-queue` (jobid 1), activo, `* * * * *`, comando `select private.fabrica_scheduler_tick();`. **3,592 ejecuciones SQL, todas `succeeded`**. SQL `succeeded` no implica trabajo `done`.
2. **2,854 recibos**, **2,849 `verified=true`**, cinco sin verificar; **2,854 UUID `cycle_id` distintos** y **2,854 `request_id` distintos**; **nueve `site_status=done` históricos**, sin nuevos. **Cuatro `network_error` históricos**, entre 2026-10-30 00:38 y 05:54 UTC, sin nuevos en este corte. `idle=2,832`. Las cinco verificaciones pendientes incluyen cuatro errores históricos y el ciclo reciente aún no conciliado.
3. UUID `f18a070f-3038-46fe-962b-cbcb4f5ba123` (07:08 UTC): `verified=true`, HTTP 200, `site_status=idle`, coincide con `agent_status`. UUID `246a05d3-7eb6-4bd6-a56c-090edc0044d7` (07:09 UTC): visible en `agent_status` como `source=supabase-cron`, `status=idle`, pero `checked_at=NULL` y `verified=false` en SQL al corte. **No marcarlo aprobado antes de conciliación.** Ninguno acredita nueva entrega funcional.
4. Site: **65 trabajos**: **60 `done`, 2 `failed`, 3 `cancelled`, cero pendientes**; no leases activos visibles ni reintentos vencidos. `usage=0/20`, `supabase_runner.status=idle`, `pending=0`, `next_at=null`; `health.autonomy.status=recent`. No se creó trabajo sintético nuevo.
5. Configuración SQL: `enabled=true`, `not_before=NULL`, `last_error=NULL`. Hashes SQL sin cambios: `fabrica_scheduler_tick=7fb25848caa91dc78eb0f469659f691d`; `fabrica_scheduler_reconcile=78a1057460b103ae1cddfb5d5e0339f0`. Índices únicos de `cycle_id` y `request_id` presentes. Estas lecturas **no sustituyen pruebas dinámicas** de colisión, reintento y recuperación.
6. GitHub: **siete workflows** revisados individualmente, ninguno contiene trigger `schedule`; el runner usa `workflow_dispatch`, otros `push`/`pull_request` para CI. GitHub no es el principal programado.
7. Modelos: el estado del Site sigue reportando Gemini 2.5 Flash y 2.5 Flash Lite no disponibles en probes históricos HTTP 404; tercero Gemini 3.5 Flash Lite HTTP 200. No se ejecutaron probes nuevos ni se demostró fallback real de punta a punta.
8. Fuente original asociada a Site v53: commit `5be977154cc15c9511787d22e28b7367e6f00467`, con 122 pruebas de servidor previamente aprobadas. **No se comprobó nativamente la identidad exacta de la versión/SHA efectivamente desplegada en este control.** No desplegar v54 ni reemplazar fuente vigente.

## Comparación con 2026-10-31 00:15 SV
- Ejecuciones SQL: **3,537 → 3,592** (+55).
- Recibos: **2,799 → 2,854** (+55).
- Recibos verificados: **2,794 → 2,849** (+55).
- Resultados `done`: **9 → 9**; Site: **60 done / 2 failed / 3 cancelled / 0 pendientes** (sin cambio).
- `network_error`: **4 → 4** (sin nuevos incidentes).

## Gates pendientes — NO aprobados
- Acceso nativo a Sites para verificar versión y SHA del código **efectivamente desplegado**, sin asumir que la fuente histórica v53 es el despliegue actual.
- Pruebas dinámicas seguras y aisladas de concurrencia, locks, idempotencia, pausa/reanudación, `not_before`, recuperación, reintentos y fallback; con recibos correlacionables y sin competir con principal/respaldo.
- Determinar causa raíz de los cuatro errores históricos; filtros de logs sin coincidencias no resuelven la investigación.
- Recorrido E2E sintético verificable de las seis especialidades con recibos operativos reales, separado de la aceptación con cliente real.
- Aceptación final con cliente real cuando exista; no reabrir el cierre administrativo ni declarar certificación automática.

**Decisión:** conservar el punto 4 cerrado provisionalmente, **SIN CERTIFICACIÓN**. Sin cambios a producción, Site, ejecutores, programación, cuota, versiones, trabajos ni clientes. No se observó regresión nueva en los indicadores consultados.
