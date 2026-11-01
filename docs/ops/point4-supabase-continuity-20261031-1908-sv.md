# Punto 4 — Auditoría de continuidad (2026-10-31 19:08 SV)

**Estado rector:** CERRADO PROVISIONALMENTE, SIN CERTIFICACIÓN. Este documento conserva una instantánea de lectura; no representa aceptación de cliente, aprobación de pedido, fabricación, entrega ni certificación.

## Identidad y fuentes consultadas
- Fábrica de Agentes IA: Site `appgprj_6adbf0c05a0c8191b2ca585b76f5e862`; repositorio `Rick2818/Fabrica-de-Agentes-IA`; Supabase `udispwzwrebjkanudcoy`.
- Consultas de lectura al proyecto Supabase: `cron.job`, `cron.job_run_details`, `private.fabrica_scheduler_config`, `private.fabrica_scheduler_receipts`, índices, y logs Supabase. Complemento Fábrica: `agent_status` (estado operativo y recibos del Site). GitHub: `AGENTS.md` y los siete YAML de workflows actuales. Automations.peek: tarea principal de auditoría y respaldo horario.
- Corte principal: 2026-11-01 01:08Z aproximadamente (31-oct-2026 19:08 SV). Los contadores son instantáneas, no una medida de entregas.

## Evidencia observada
1. **Cron real:** `cron.jobid=1`, `jobname=fabrica-queue`, `schedule=* * * * *`, `active=true`, `command=select private.fabrica_scheduler_tick();`. 4,671 ejecuciones SQL `succeeded`, frente a 4,612 en el control anterior (+59). Un resultado SQL `succeeded` no equivale a procesamiento `done`.
2. **Recibos:** 3,928 recibos (+59), 3,922 `verified=true` (+59), cinco `network_error` históricos sin aumento, nueve `site_status=done` históricos, **cero `done` nuevos en los últimos 65 minutos**. Seis recibos no verificados incluyen cinco errores históricos y el ciclo más reciente pendiente de conciliación normal.
3. **UUID y conciliación:** ciclo `27c91fd2-319b-489c-b8a8-58d659e929da` programado 01:07Z, conciliado 01:08Z con `http_status=200`, `verified=true`, `site_status=idle`, `error_code=NULL`. El ciclo `7bd6ab86-0cbf-4174-99e7-fd168b4e6881` de 01:08Z aún no tenía conciliación SQL en el corte; no se marca aprobado. 3,928 UUID distintos y 3,928 `request_id` distintos; cero recibos no verificados con antigüedad >5 minutos y sin error registrado. Índices únicos de `cycle_id` y `request_id` presentes.
4. **Configuración:** `private.fabrica_scheduler_config.enabled=true`, `not_before=NULL`, `last_error=NULL`. No se forzó `tick` ni se modificó `not_before`, cuotas o fechas.
5. **Site y cola (complemento):** 65 trabajos: 60 `done`, dos `failed` históricos, tres `cancelled`, cero pendientes. Cuota 0/20. `health.supabase_runner` reciente: `source=supabase-cron`, `status=idle`, UUID `27c91fd2-319b-489c-b8a8-58d659e929da`. No se acredita entrega nueva. Las seis prácticas sintéticas previas son evidencia de respuestas de texto, no fabricación/entrega E2E.
6. **Respaldo:** automatización `Respaldo de pendientes Fábrica IA` permanece `is_enabled=true`. Su último registro `no_update` no prueba ejecución de trabajo ni habilita crear un ejecutor competidor. No se detuvo ni invocó el respaldo.
7. **GitHub:** los siete YAML actuales de `.github/workflows` fueron leídos individualmente; ninguno contiene un disparador `schedule:`. Existen `workflow_dispatch` y algunos eventos `push`/`pull_request`; ninguno constituye ejecución programada de la cola. `AGENTS.md` mantiene Leo/Ventas, Mila/Servicio, Vera/Finanzas, Alma/Química-Farmacia, Nico/Logística, Lía/Mercadeo. No se reasignaron identidades ni alteraron recibos históricos.
8. **Logs:** consulta de `logs` para 2026-10-31 19:07Z a 2026-11-01 01:07Z encontró fuentes `postgres_logs` (867) y `pgbouncer_logs` (18). Consulta de mensajes con `error` o `timeout` devolvió cero coincidencias en ese intervalo; esto **no prueba ausencia global de errores** ni explica los cinco `network_error` históricos.
9. **Modelos (histórico del Site):** primario `gemini-2.5-flash` y respaldo `gemini-2.5-flash-lite` con pruebas anteriores HTTP 404, tercero `gemini-3.5-flash-lite` HTTP 200. No se repitieron pruebas ni se declaran recuperados los primeros dos.

## Pendientes expresos — no aprobados
- Cotejar mediante **acceso nativo de Sites** el artefacto efectivamente publicado con fuente recuperada de Site v53, commit `5be977154cc15c9511787d22e28b7367e6f00467`. Se conservan como antecedente 122 pruebas de servidor aprobadas sobre su worktree; **no se ejecutaron en esta auditoría**. La v54 sigue guardada sin desplegar. El complemento da estado operativo, pero no expone un diff de fuente desplegada.
- Pruebas dinámicas sintéticas **aisladas** de contención/locks, idempotencia, reintentos, pausa/`not_before`, recuperación, fallback de modelos y continuidad de los seis agentes. No marcar como aprobadas por inspección estática ni por ciclos `idle`.
- Diagnóstico causal de los cinco errores históricos de transporte, dentro de los límites de retención de logs.
- Recibos E2E verificables de aprobación, fabricación, aislamiento de clientes y entrega para seis agentes, distintos de prácticas de texto.
- Aceptación final de cliente real cuando exista, sin reabrir el cierre administrativo por su mera ausencia.

**Mutaciones operativas:** ninguna. No se modificó Site, v53/v54, producción, modelos, ejecutores, cron, respaldo, cuotas, fechas, cola, pedidos, pagos ni contactos; no se enviaron correos ni mensajes. No se demostró regresión nueva ni bloqueo que exija intervención inmediata.
