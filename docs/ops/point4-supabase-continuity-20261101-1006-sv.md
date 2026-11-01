# Fábrica de Agentes IA — Punto 4: continuidad, 2026-11-01 10:06 CST

**Estado rector:** CERRADO PROVISIONALMENTE, SIN CERTIFICACIÓN. Auditoría de solo lectura. No es la estación 4 del diseño ni GitHub issue #4.

## Corte y alcance

- Corte SQL: 2026-11-01 16:06:30 UTC (10:06:30, El Salvador).
- Supabase: `udispwzwrebjkanudcoy`; job `cron.job` id=1, nombre `fabrica-queue`, `* * * * *`, `active=true`, comando `select private.fabrica_scheduler_tick();`.
- `cron.job_run_details`: 5,569 `succeeded`, 0 otros estados, 90 `succeeded` en 90 minutos. Un SQL `succeeded` **no** prueba procesamiento del Site.
- `private.fabrica_scheduler_receipts`: 4,826 registros, 4,820 `verified=true`, 5 `network_error` históricos; 90 recibos verificados en 90 minutos, todos `site_status=idle`; cero `done` nuevos en esa ventana. Distribución total: 4,803 `idle` verificados, 9 `done` verificados históricos, 4 `waiting`, 2 `error`, 1 `quota`, 1 `busy`, 5 `network_error` no verificados y 1 recibo aún sin cotejo al corte.
- Último recibo conciliado: ciclo `6d726ec5-d108-4ac2-b82b-833b265120bb`, programado 16:05 UTC, HTTP 200, `verified=true`, `site_status=idle`, cotejado a las 16:06 UTC. El siguiente ciclo `f18dd923-df3d-43fc-b4e1-cd69b1ef68c4` estaba sin `checked_at` al corte; **pendiente, no aprobado**.
- No se encontraron UUID de ciclo duplicados, `request_id` duplicados ni conciliaciones sin cotejar con antigüedad superior a tres minutos.
- `private.fabrica_scheduler_config`: `enabled=true`, `not_before=NULL`, `last_error=NULL`. La función vigente utiliza advisory lock transaccional, `FOR UPDATE`, correlación estricta de `run_id`, y `not_before` para recuperación; revisión estática, no prueba dinámica.
- La función SQL `private.fabrica_scheduler_tick` apunta a `https://agente-ricardo-revision-rick.glassybell1025.chatgpt.site/internal/runner`. No se ha cotejado esta URL con la versión nativa efectivamente desplegada del proyecto Sites `appgprj_6adbf0c05a0c8191b2ca585b76f5e862`. No inferir discrepancia sin ese cotejo.
- Consulta `agent_status` de la Fábrica: 60 trabajos `done`, 2 `failed` históricos, 3 `cancelled`, 0 pendientes; cuota 0/20; `health.supabase_runner` último ciclo 16:05 UTC `idle`, UUID concordante. El tablero reporta ejecutor principal Supabase habilitado.
- Se consultó Automations.peek del respaldo horario `6adbf94d28e8819189c0516c6068457a`: `is_enabled=true`, último resultado registrado `no_update`; esto **no** prueba entrega nueva ni sustituye el principal.
- Se leyeron `AGENTS.md` y los siete archivos YAML existentes en `.github/workflows` del repositorio `Rick2818/Fabrica-de-Agentes-IA`. Ninguno contiene `schedule:` vigente. Hay eventos `workflow_dispatch`, `push` y `pull_request`, que no acreditan schedule.
- Se cotejaron los seis IDs `synthetic-six-20261028-{leo,mila,vera,alma,nico,lia}`: los seis están `done` con evidencia de proveedor, modelo y HTTP 200. Son prácticas sintéticas analíticas, **no** pruebas E2E de fabricación/entrega ni aceptación de cliente.
- Pruebas históricas de modelos del tablero: primario `gemini-2.5-flash` HTTP 404, respaldo `gemini-2.5-flash-lite` HTTP 404; tercero `gemini-3.5-flash-lite` HTTP 200 sintético. No está certificada la recuperación automática de modelos.
- Logs PostgreSQL inspeccionados. Se observó un error SQL `42703` originado por la consulta inicial de esta misma auditoría (columna `created_at` inexistente), corregida al usar `checked_at`; **no** es evidencia de fallo del ejecutor.

## Pendientes y límites

1. Acceso nativo de Sites: cotejar versión realmente desplegada, URL, fuente activa y recibos del Site. La fuente v53 recuperada en commit `5be977154cc15c9511787d22e28b7367e6f00467` con 122 pruebas de servidor es evidencia histórica; no se sustituye la fuente vigente. La v54 guardada no se activa.
2. Pruebas dinámicas **aisladas** de locks/concurrencia, idempotencia, reintentos, pausa, recuperación y fallback; ninguna se marcó aprobada por la inspección estática.
3. Conciliación de fabricación y entrega E2E con recibos específicos de aprobación, creación y acceso, sin contacto externo ni cambios a pedidos reales.
4. Validación final con cliente real, ausente a la fecha; mantener cierre administrativo provisional.
5. Diagnóstico causal de los cinco errores históricos `network_error` y recuperación comprobada de los modelos 404.

**Cambios de esta auditoría:** solo este documento. No se invocó tick, no se modificaron cuotas, fechas, trabajos, Site, despliegues, ejecutores, disparadores, pagos ni correos.
