# Fábrica IA · Punto 4 — control de continuidad 2026-10-31 00:15 SV

**Estado rector: CERRADO PROVISIONALMENTE, SIN CERTIFICACIÓN.** Auditoría de lectura y documentación. No se ejecutó manualmente la cola, no se alteraron cuota, `not_before`, locks, versiones, disparadores ni producción. No hay cliente real; las pruebas sintéticas históricas no sustituyen aceptación.

## Alcance y fuentes observadas
- Supabase `udispwzwrebjkanudcoy`, proyecto `ACTIVE_HEALTHY`: `cron.job`, `cron.job_run_details`, `private.fabrica_scheduler_config`, `private.fabrica_scheduler_receipts`, índices y definiciones SQL; consulta de logs unificados en ventana 2026-10-30 06:15 a 2026-10-31 06:15 UTC.
- Site `appgprj_6adbf0c05a0c8191b2ca585b76f5e862`: lectura operativa por el complemento `agent_status`, **sin inspección nativa del código efectivamente desplegado en este control**. La fuente original asociada a v53 fue recuperada en `5be977154cc15c9511787d22e28b7367e6f00467` con 122 pruebas históricas; eso no acredita el SHA actual. No activar v54.
- GitHub `Rick2818/Fabrica-de-Agentes-IA`: `AGENTS.md` y lectura individual de siete workflows sobre `main` previo `ddbcf0fe164db8c7f71c3ae438f591c41d4410f1`.
- Respaldo existente `6adbf94d28e8819189c0516c6068457a`: lectura de `Automations.peek`; no se ejecutó ni se alteró.

## Hechos verificados
1. A las **06:14:17 UTC** (00:14:17 SV), `cron.job_run_details` contenía **3,537** ejecuciones, **3,537 succeeded** y cero estados distintos; última ejecución a las 06:14 UTC. Un solo job `fabrica-queue` (jobid 1), `* * * * *`, `active=true`, comando `select private.fabrica_scheduler_tick();`. Éxito SQL no equivale a procesamiento `done`.
2. Al mismo corte: **2,799** recibos, **2,794 verified=true**, cinco no verificados (cuatro `network_error` históricos y el ciclo más reciente aún pendiente de conciliación), **2,777 idle**, **9 done** históricos. `cycle_id` únicos **2,799** y `request_id` únicos **2,799**; cero grupos duplicados. No hay entrega funcional nueva.
3. UUID `f8fb1417-1743-43d4-b964-9507de4bfab4` (06:13 UTC): conciliado a las 06:14 UTC, HTTP 200, `verified=true`, `site_status=idle`. UUID `8773b475-0eea-4a79-ad8c-e300413698d7` (06:14 UTC): visible en el Site con `source=supabase-cron`, `status=idle`, y posteriormente conciliado en SQL a las 06:15 UTC, HTTP 200, `verified=true`, `site_status=idle`. UUID siguiente `d3848b6c-3027-41c2-93e8-67e58f21ba58` (06:15 UTC): conciliación pendiente al corte de 06:15:22 UTC. Ninguno acredita `done`.
4. Site `agent_status` a las 06:14:40 UTC: **65 trabajos**, 60 `done`, 2 `failed`, 3 `cancelled`, **cero pendientes**. `usage=0/20`, `health.autonomy.status=recent`, `supabase_runner.status=idle`, `pending=0`, `next_at=null`; último UUID de Site coincide con el de 06:14 UTC. Sin leases ni reintentos vencidos entre los trabajos visibles.
5. `private.fabrica_scheduler_config`: `enabled=true`, `not_before=NULL`, `last_error=NULL`. Funciones sin cambio frente al control previo: MD5 `fabrica_scheduler_tick=7fb25848caa91dc78eb0f469659f691d` y `fabrica_scheduler_reconcile=78a1057460b103ae1cddfb5d5e0339f0`. Índices únicos por `cycle_id` y `request_id`. Lectura estática de funciones: `pg_try_advisory_xact_lock`, barrera de `checked_at IS NULL`, respeto de `not_before`, reconciliación, espera/backoff y caducidad de respuesta. **No son pruebas dinámicas**.
6. Los **cuatro `network_error`** ocurrieron entre 2026-10-30 00:38 y 05:54 UTC; no hay nuevos en este corte. La consulta de logs unificados por error/timeout/pg_net en las últimas 24 horas devolvió cero coincidencias bajo ese filtro; **no determina la causa raíz**.
7. Los siete workflows de GitHub fueron leídos individualmente: **ninguno contiene un disparador `schedule`**. El runner usa `workflow_dispatch`; los otros workflows pueden tener `push`/`pull_request` para pruebas. No confundir ejecuciones manuales con `schedule`.
8. El respaldo horario figura `is_enabled=true`; último run ID `9942e9d3-7a40-8323-804b-9601f9d18eb6`, `recorded_status=no_update`, finalizado a 06:09:39 UTC; `latest_result=null`. No inferir trabajo procesado a partir de ese registro.
9. Probes de modelos históricos del Site: Gemini 2.5 Flash y 2.5 Flash Lite HTTP 404; tercer modelo Gemini 3.5 Flash Lite HTTP 200. **No se repitieron**, no se consumió cuota ni se demostró fallback real E2E. La nota del Site menciona v58, sin verificación nativa del SHA efectivo.

## Diferencia contra el control 2026-10-30 23:10 SV
- SQL succeeded: **3,472 → 3,537** (+65).
- Recibos: **2,734 → 2,799** (+65).
- Verified: **2,729 → 2,794** (+65).
- `site_status=done`: **9 → 9**; trabajos visibles **60 done / 2 failed / 3 cancelled / 0 pendientes**, sin cambio.
- `network_error`: **4 → 4**; no se detecta regresión nueva.

## Puertas pendientes (NO aprobadas)
- Comparación **nativa** de versión y SHA del código Site efectivamente desplegado contra fuente vigente; conservar fuente y audiencia, no desplegar v54.
- Pruebas dinámicas **aisladas** de concurrencia, locks/leases, idempotencia, pausa/reanudación, reintentos, recuperación y fallback, con recibos y sin interferir con principal ni respaldo.
- Diagnóstico causal de cuatro errores de transporte históricos; la ausencia de logs correlacionables no los explica.
- Recorrido E2E controlado y recibos auténticos por las seis especialidades; distinguir ejercicios sintéticos de entrega funcional y aceptación.
- Aceptación final con cliente real cuando exista, **sin reabrir** el cierre administrativo por su ausencia.

**Decisión:** mantener el punto 4 cerrado provisionalmente, sin certificación. No se ejecutaron pruebas sintéticas nuevas ni se modificaron Site, Supabase, ejecutores, cuota, versiones o automatizaciones. Solo se registra este control documental.
