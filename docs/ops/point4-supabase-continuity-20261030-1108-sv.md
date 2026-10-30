# Fábrica de Agentes IA — Punto 4: control de continuidad (2026-10-30, 11:08 El Salvador)

**ESTADO RECTOR: CERRADO PROVISIONALMENTE, SIN CERTIFICACIÓN.** No existe cliente real para aceptación final. Auditoría de solo lectura; no se disparó la cola ni se modificó producción.

## Evidencia comprobada

- **Ámbito:** Site original `appgprj_6adbf0c05a0c8191b2ca585b76f5e862`; Supabase `udispwzwrebjkanudcoy` (`ACTIVE_HEALTHY`); GitHub `Rick2818/Fabrica-de-Agentes-IA`. `AGENTS.md` leído desde `main`. No se obtuvo acceso nativo al código/despliegue actual del Site durante este control; no afirmar paridad.
- **Cron principal:** en `cron.job` existe exactamente un job, `fabrica-queue` (jobid 1), `* * * * *`, `active=true`, comando `select private.fabrica_scheduler_tick();`. A las 17:07:02 UTC: 2,750 filas de `cron.job_run_details`, todas `succeeded` (último runid 2750, 17:07:00 UTC). Son 51 más que las 2,699 del control 10:16 SV. SQL `succeeded` y `1 row` **no son entregas `done`**.
- **Recibos de Supabase:** al corte 17:07 UTC: 2,012 recibos, 2,012 UUID únicos, 2,007 verificados y cinco no verificados. Estados verificados: 1,990 `idle`, nueve `done` históricos, cuatro `waiting`, dos `error`, uno `quota`, uno `busy`. No hay nuevos `done` desde el control anterior. Cuatro `network_error` históricos continúan no verificados, más un ciclo reciente sin conciliación. 51 recibos adicionales desde el corte anterior.
- **Correlación:** `cf31e917-2769-4c07-b234-4ddaebe5741b`, programado 17:06 UTC, aparece en Supabase `verified=true`, HTTP 200, `site_status=idle` y en `agent_status` del Site como `source=supabase-cron`, `idle`. El UUID siguiente `ad4bf80f-70b3-42bd-8e68-c44e0e1a91e3` (17:07 UTC) aparece como `idle` en Site, pero en la lectura SQL inicial aún estaba `verified=false`, `checked_at=null`: **no se contabiliza como verificado**.
- **Control aislado de invariantes, solo lectura:** a las 17:07:50 UTC, desde 16:16 UTC hay 52 filas por criterio de hora estricta (incluye el minuto 16:16 no contado en la diferencia entre cortes), cero `done` nuevos y cero `error_code` nuevos. Cero `checked_at` pendientes con antigüedad superior a dos minutos; cero UUID de ciclo o `request_id` duplicados. Índices únicos presentes para ambas claves. Estas consultas no sustituyen pruebas de concurrencia/idempotencia bajo carga.
- **Site y cola:** `agent_status` devuelve 65 trabajos históricos: 60 `done`, dos `failed`, tres `cancelled`, cero pendientes. Cuota `0/20`. `health.supabase_runner.status=idle`, `pending=0`, `next_at=null`; `health.autonomy.stalled=false`. Los 60 trabajos Site `done` no son los nueve recibos cron `done`.
- **Pausas/locks:** `private.fabrica_scheduler_config.enabled=true`, `not_before=null`, `last_error=null`. Hashes de funciones sin cambios: `tick=7fb25848caa91dc78eb0f469659f691d`, `reconcile=78a1057460b103ae1cddfb5d5e0339f0`. La lectura del SQL de `tick` muestra `pg_try_advisory_xact_lock`, `select ... for update` (minúsculas) y respeto de `not_before`. `reconcile` también considera `not_before`. Son controles estáticos, no ensayos dinámicos.
- **Transporte:** cuatro `network_error` históricos identificados por UUID `301f7d3c-d7d0-4d74-86de-072dc18f64f4`, `e557300e-1fa9-4015-97f7-4d831ff2b450`, `4dd8d3fe-9de6-40e8-8af7-de813e230d1b`, `904c6e64-4e73-4aea-a569-a11ab7234cd1`. Ningún nuevo `error_code` desde 16:16 UTC. No se atribuye `done` a esos incidentes.
- **Logs:** ventana 16:15–17:08 UTC: 129 registros `postgres_logs` y tres `pgbouncer_logs`; no aparecen fuentes `edge_logs` ni `function_edge_logs` en esa consulta. No se ha determinado causa raíz de los cuatro timeouts.
- **GitHub:** se leyeron individualmente los siete workflows de `main`: `agent-runner.yml`, `diagnostic-a-scheduler.yml`, `diagnostic-b-conditions.yml`, `diagnostic-c-actor.yml`, `factory-regression.yml`, `training-regression.yml`, `verify-training.yml`. Ninguno contiene evento `schedule:`. Los diagnósticos y el runner admiten `workflow_dispatch`; otros CI usan `push` o `pull_request`. No se activó GitHub Actions.
- **Respaldo:** automatización `Respaldo de pendientes Fábrica IA` habilitada; último registro consultado 2026-10-30 15:30:51–15:30:53 UTC, `no_update`. No se ejecutó ni modificó. No inferir entrega de ese registro.
- **Modelos:** pruebas sintéticas previas en Site: `gemini-2.5-flash` HTTP404, `gemini-2.5-flash-lite` HTTP404, `gemini-3.5-flash-lite` HTTP200. No se ejecutó prueba nueva de fallback E2E. Un HTTP200 aislado no acredita recuperación funcional completa.
- **Fuente y versiones:** fuente original v53 previamente recuperada en commit Site `5be977154cc15c9511787d22e28b7367e6f00467`, con 122 pruebas históricas de servidor en worktree. Sin inspección nativa nueva del despliegue vigente; v54 guardada sin desplegar conforme al estado rector, sin activación.

## Pendientes, NO aprobados

1. Trazas nativas del Site para causa de cuatro timeouts, con conciliación UUID.
2. Pruebas aisladas de concurrencia, recuperación, locks, reintentos, idempotencia, pausa, `not_before` y fallback, sin alterar cuota, fechas ni trabajos reales.
3. E2E sintético con recibo `done` correlacionado, separado de aceptación real.
4. Comparación de fuente nativa Site vigente con despliegue real, sin sustituir código ni activar v54.
5. Aceptación final con cliente real cuando exista.

**Decisión:** sin regresión nueva comprobada que amerite intervención. No cambiar ejecutor principal, respaldo, cuotas, modelos, versiones ni trabajos. Punto 4 **cerrado provisionalmente, sin certificación**.
