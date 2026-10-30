# Fábrica de Agentes IA — Punto 4: control de continuidad (2026-10-30, 09:06 El Salvador)

**Estado rector: CERRADO PROVISIONALMENTE, SIN CERTIFICACIÓN.** No existe cliente real para aceptación final. Auditoría exclusivamente de lectura; no se ejecutó manualmente la cola ni se alteró producción.

## Evidencia observada

- **Proyecto:** Supabase `udispwzwrebjkanudcoy` (ACTIVE_HEALTHY), Site original `appgprj_6adbf0c05a0c8191b2ca585b76f5e862`, repositorio `Rick2818/Fabrica-de-Agentes-IA`. Se consultaron `cron.job`, `cron.job_run_details`, `private.fabrica_scheduler_receipts`, `private.fabrica_scheduler_config`, funciones/índices, logs, complemento nativo `agent_status`, AGENTS.md, siete workflows y estado de respaldo.
- **Cron:** único job `fabrica-queue`, jobid 1, `* * * * *`, `active=true`. Corte 2026-10-30 15:06:00 UTC: **2,629 ejecuciones SQL succeeded** y ninguna con otro estado; +51 desde control 08:16. El `return_message='1 row'` es resultado SQL, no entrega de trabajo.
- **Recibos:** corte 15:06 UTC: **1,891 recibos / 1,891 UUID únicos; 1,886 verificados, cinco sin verificar**; +51 recibos y +51 verificados desde control previo. Distribución: 1,869 `idle`, nueve `done` históricos (último 2026-10-29 07:27 UTC), cuatro `waiting`, dos `error`, uno `quota`, uno `busy`, cinco sin `site_status`. De los cinco no verificados, cuatro son incidentes `network_error` históricos y uno corresponde al ciclo recién registrado, aún sin conciliación SQL.
- **Correlación Site–Supabase:** UUID más reciente `30843ea4-208e-415e-acdc-ec90033ff67f`, `scheduled_at=2026-10-30T15:06:00.041Z`: `verified=false`, `site_status=null` al corte SQL. El complemento `agent_status` sí muestra para ese UUID un ciclo de fuente `supabase-cron`, estado `idle`, completado en el Site. Esto demuestra coincidencia de UUID y resultado visible en el Site, **no** conciliación SQL ni entrega `done`. El ciclo previo `abf30c6d-ff02-444f-980c-87c1b953aa16` sí estaba conciliado: `verified=true`, HTTP200, `idle`.
- **Cola y cuota Site:** 65 trabajos: 60 `done` históricos, dos `failed`, tres `cancelled`, cero pendientes. Cuota **0/20**. Los 60 `done` del Site no equivalen a los nueve recibos `done` del cron. `health.autonomy.primary.recent=true`; `backup.recent=false` sin que ello implique avería del respaldo.
- **Control de pausas:** `private.fabrica_scheduler_config.enabled=true`, `not_before=null`, `last_error=null`. Se preservó la política de diferimiento y cuota; no se forzó `tick`.
- **Idempotencia y locks (inspección estática):** hash MD5 de `fabrica_scheduler_tick` `7fb25848caa91dc78eb0f469659f691d` y de `fabrica_scheduler_reconcile` `78a1057460b103ae1cddfb5d5e0339f0`, iguales al control anterior. `tick` contiene referencia a `pg_try_advisory_xact_lock` y `not_before`; `reconcile` contiene `not_before`. Índices únicos `cycle_id` y `request_id` presentes. **No se realizaron pruebas dinámicas de carrera, reintento, pausa o recuperación**.
- **Transporte:** siguen los cuatro `network_error` sin resultado Site verificable, UUID: `301f7d3c-d7d0-4d74-86de-072dc18f64f4`, `e557300e-1fa9-4015-97f7-4d831ff2b450`, `4dd8d3fe-9de6-40e8-8af7-de813e230d1b`, `904c6e64-4e73-4aea-a569-a11ab7234cd1`. No aparecieron nuevos en el corte.
- **Logs:** consulta 14:00–15:06 UTC: 158 `postgres_logs` y tres `pgbouncer_logs`; no hay trazas nativas del Site en esta vista que permitan establecer la causa de los timeouts.
- **GitHub:** AGENTS.md leído. Los siete workflows de `main` (`agent-runner.yml`, `diagnostic-a-scheduler.yml`, `diagnostic-b-conditions.yml`, `diagnostic-c-actor.yml`, `factory-regression.yml`, `training-regression.yml`, `verify-training.yml`) revisados: ninguno declara disparador `schedule`. `agent-runner` usa `workflow_dispatch`; los CI pueden usar `push` o `pull_request`, que no son un cron. No se lanzaron workflows.
- **Respaldo:** `Respaldo de pendientes Fábrica IA` habilitado, último run registrado 2026-10-30 15:01:39 UTC con estado `no_update`; no se invocó ni reconfiguró.
- **Modelos:** siguen registrados los tests sintéticos previos: primario `gemini-2.5-flash` HTTP404, respaldo `gemini-2.5-flash-lite` HTTP404 y tercero `gemini-3.5-flash-lite` HTTP200. Un HTTP200 aislado no prueba fallback de extremo a extremo.
- **Versiones:** fuente nativa Site v53 recuperada anteriormente, commit de Site `5be977154cc15c9511787d22e28b7367e6f00467`, 122 tests de servidor históricos aprobados. No se dispuso de acceso nativo directo al código/despliegue del Site en este control; no se verificó paridad exacta con versión desplegada. v54 guardada sin desplegar según estado rector; no se activó.

## Pendientes para validación final

1. Diagnóstico causal de los cuatro timeouts con trazas nativas Site y conciliación por UUID, sin atribuirles `done`.
2. Pruebas sintéticas aisladas de concurrencia, exclusión mutua, idempotencia, pausa, `not_before`, reintento, recuperación y fallback; aún **no aprobadas**.
3. Prueba E2E sintética de procesamiento `done` con recibo correlacionado en ambos lados y evidencia de recuperación efectiva; no sustituye aceptación de cliente.
4. Comparación nativa del código y despliegue Site actual preservando fuente vigente y trabajos ajenos.
5. Aceptación final con cliente real cuando exista.

**Decisión:** sin regresión nueva detectada ni corrección segura necesaria en producción. No crear ejecutor o trigger adicional; mantener principal y respaldo. **Punto 4 cerrado provisionalmente, sin certificación.**
