# Fábrica de Agentes IA — Punto 4, continuidad (2026-11-01 18:12 CST)

**Estado rector:** CERRADO PROVISIONALMENTE, SIN CERTIFICACIÓN. Auditoría read-only; no reabrir por ausencia de cliente. Alcance exclusivo del Site `appgprj_6adbf0c05a0c8191b2ca585b76f5e862` y `Rick2818/Fabrica-de-Agentes-IA`.

## Corte observado y fuentes

- Supabase proyecto `udispwzwrebjkanudcoy`, consulta SQL observada a `2026-11-02 00:12:25.736043+00`: `cron.job_run_details` para jobid 1, **6,055** registros `succeeded`; `private.fabrica_scheduler_receipts`, **5,312** registros, **5,306** `verified=true`, **5** errores históricos `network_error`; **0** recibos sin comprobar con antigüedad superior a 3 minutos. En los últimos 90 minutos, **89** recibos `verified=true/site_status=idle`. No equiparar `succeeded` ni HTTP 200 ni `idle` con procesamiento `done`.
- Ciclo verificado más reciente: `ed719f43-7a69-44a0-b435-3750121b644e` (HTTP 200, `site_status=idle`, correlacionado con el Site). Ciclo posterior `c57a0d2d-e4a3-4813-afbe-63ee0fa1c5fb`: observado `idle` en recibo del Site, pero todavía **sin conciliación SQL confirmada** al corte; no declararlo aprobado.
- Supabase Cron: único job `fabrica-queue`, jobid 1, expresión `* * * * *`, `active=true`, comando `select private.fabrica_scheduler_tick();`. `private.fabrica_scheduler_config`: `enabled=true`, `not_before=null`, `last_error=null`.
- La función `fabrica_scheduler_tick` conserva advisory transaction lock, `FOR UPDATE` de configuración, guardas `not_before`, prevención de solicitudes superpuestas sin conciliar, secreto Vault y POST al runner original del Site. `fabrica_scheduler_reconcile` valida origen, proveedor, proyecto, `schedule_id`, UUID, milisegundos, estados y tiempos, marca errores sin convertirlos en éxito y aplica diferimiento. Índices únicos para `cycle_id` y `request_id`; no se observaron duplicados. Inspección estática, **no** prueba dinámica nueva de concurrencia o recuperación.
- Recibos verificados por estado histórico: `idle=5288`, `done=9`, `waiting=4`, `error=2`, `busy=1`, `quota=1`. Los cinco `network_error` históricos permanecen sin causa determinada. No se encontraron estados no-idle ni errores nuevos en los últimos 24 h en la tabla de recibos.
- Consulta de logs Supabase entre `2026-11-01T22:30Z` y `2026-11-02T00:15Z`: 246 entradas `postgres_logs`, 6 `pgbouncer_logs`; filtro textual `error` sin coincidencias. La ausencia de coincidencias en ese filtro no certifica ausencia de todos los fallos.
- Consulta del MCP del Site: 65 trabajos, **60 done, 2 failed históricos, 3 cancelled, 0 pendientes**; uso diario **0/20**. El último ciclo `c57a0d2d-e4a3-4813-afbe-63ee0fa1c5fb` figura `idle` con `source=supabase-cron`. Las seis prácticas sintéticas están registradas, sin evidencia de fabricación/entrega real.
- Respaldo horario `6adbf94d28e8819189c0516c6068457a`: `is_enabled=true`; último registro consultado `2026-11-01T23:51:49Z`, `no_update`. No se ejecutó manualmente ni se alteró.
- GitHub `main` y `AGENTS.md` inspeccionados; los siete workflows en `.github/workflows/` no tienen trigger `schedule`. `agent-runner.yml` conserva únicamente `workflow_dispatch` y no se activó. Otros workflows tienen `push`/`pull_request` para CI, no programación de cola. `AGENTS.md` define: Leo Ventas, Mila Servicio, Vera Finanzas, Alma Química/Farmacia, Nico Logística, Lía Mercadeo; no alterar recibos históricos discordantes.
- La nota histórica del Site refiere despliegue v58, pero **no se comprobó por acceso nativo de Sites en este control** cuál versión está efectivamente publicada ni sus dos URL. La fuente recuperada v53 (commit `5be977154cc15c9511787d22e28b7367e6f00467`) y sus 122 pruebas siguen como antecedente, no como verificación del despliegue actual. No activar v54 guardada.

## Brechas para validación final

1. Cotejar por acceso nativo de Sites versión, despliegue, URL de servicio y URL pública efectivas; preservar código y datos actuales.
2. Ejecutar en aislamiento pruebas dinámicas de doble tick/lock, reintentos, pausas, recuperación, idempotencia, `not_before` y fallback sin alterar la cuota ni trabajos ajenos.
3. Resolver y volver a comprobar HTTP 404 históricos de `gemini-2.5-flash` primario y `gemini-2.5-flash-lite` respaldo. El tercer modelo `gemini-3.5-flash-lite` tuvo comprobación sintética HTTP 200 el 29-10; esto no demuestra funcionamiento del primario/respaldo.
4. Obtener recibos E2E independientes de aprobación, fabricación, aprovisionamiento y entrega de agente sintético; la práctica textual `done` no equivale a esos eventos.
5. Validación y aceptación final con cliente real cuando exista; **no requerida para conservar el cierre administrativo provisional**.

**Acciones de este control:** solo lecturas SQL, logs, estado del Site por MCP, estado del respaldo y archivos de GitHub; creación de esta evidencia documental. Sin llamadas de modelos, pruebas sintéticas nuevas, envíos, pagos, alteración de cuotas, cron, versión, producción ni trabajos ajenos. No se identificó una regresión operativa nueva que exija corrección inmediata.
