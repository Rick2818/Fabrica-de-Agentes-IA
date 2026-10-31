# Punto 4 — auditoría de continuidad, 2026-10-31 11:07 SV

## Estado rector
**CERRADO PROVISIONALMENTE, SIN CERTIFICACIÓN.** Exclusivamente Fábrica de Agentes IA. Site `appgprj_6adbf0c05a0c8191b2ca585b76f5e862`; repositorio `Rick2818/Fabrica-de-Agentes-IA`; Supabase `udispwzwrebjkanudcoy`. No confundir punto 4 con estación 4 ni issue #4. La fuente histórica v53 (commit `5be977154cc15c9511787d22e28b7367e6f00467`, 122 pruebas históricas) está recuperada, pero no prueba identidad con el Site desplegado. No desplegar la versión 54 guardada.

## Supabase (consultas directas de solo lectura, 17:06:37–17:07:17 UTC)
- Proyecto: `ACTIVE_HEALTHY`. `cron.job`: **único** job `fabrica-queue`, id 1, activo, expresión `* * * * *`, comando `select private.fabrica_scheduler_tick();`. Configuración `enabled=true`, `not_before=NULL`, `last_error=NULL`.
- `cron.job_run_details`: **4,190** ejecuciones SQL `succeeded`, cero con otro estado al corte. Este dato **no acredita** entrega.
- `private.fabrica_scheduler_receipts`: **3,447** recibos; **3,441** `verified=true`, **5** `network_error` históricos, **9** `site_status=done` históricos. Última hora: **60** recibos verificados, **0** `done` y **0** errores nuevos.
- Último ciclo conciliado: `87925fa9-e938-449c-acf7-661349890e1f`, programado a las 17:06 UTC, `checked_at=17:07:00.035313 UTC`, `http_status=200`, `verified=true`, `site_status=idle`. El ciclo posterior `2f5a5ebb-6823-4681-a0f6-72d29d40b85e` estaba en Site como `idle`, pero su recibo SQL seguía sin `checked_at` al corte; no atribuir verificación futura sin consultar.
- **0** recibos no conciliados con antigüedad superior a tres minutos y sin error; **0** UUID duplicados y **0** request_id duplicados según índices únicos presentes en `cycle_id` y `request_id`.
- Hashes SQL sin cambios: `fabrica_scheduler_tick=7fb25848caa91dc78eb0f469659f691d`; `fabrica_scheduler_reconcile=78a1057460b103ae1cddfb5d5e0339f0`. No se forzó tick ni se alteró cuota/fecha.
- Logs Supabase 16:00–17:06 UTC: 158 `postgres_logs` y 1 `pgbouncer_logs`; el recuento por origen no demuestra causa de los cinco errores históricos de red.

## Site (conector operativo, sin inspección nativa de fuente)
- `agent_status`: **65** trabajos: **60 done**, **2 failed** históricos, **3 cancelled**, **0 pendientes**; sin leases activos ni reintentos vencidos visibles. Cuota **0/20**.
- Principal: `automation.enabled=true`, `supabase:udispwzwrebjkanudcoy:fabrica-queue`, `health.supabase_runner.status=idle`, `pending=0`, `health.autonomy.primary.recent=true`. UUID del último ciclo Site `2f5a5ebb-6823-4681-a0f6-72d29d40b85e` coincide con el último recibo aún no conciliado en SQL.
- Configuración de modelos reportada: `gemini-2.5-flash` primario, `gemini-2.5-flash-lite` respaldo, `gemini-3.5-flash-lite` tercero. Probes sintéticos **históricos**: HTTP 404, HTTP 404 y HTTP 200, respectivamente; no se repitieron ni prueban fallback en producción.
- No se realizaron pruebas sintéticas nuevas ni un recorrido E2E de fabricación/entrega de los seis agentes.

## GitHub y respaldo
- `AGENTS.md` leído en `main`: preservar Site y sus datos; distinguir pruebas, ejecución programada y certificación; conservar separación de proyectos.
- Los siete workflows en `.github/workflows/` fueron leídos individualmente: **ninguno** contiene `on.schedule`. `agent-runner.yml` solo usa `workflow_dispatch` y conserva `SITE_ORIGIN=https://agente-ricardo-revision-rick.glassybell1025.chatgpt.site`; requiere conciliación con origen realmente desplegado antes de cualquier ejecución manual.
- Respaldo horario `6adbf94d28e8819189c0516c6068457a`: `is_enabled=true` confirmado mediante `Automations.peek`, último run registrado `no_update`. No se ejecutó ni modificó.
- No hay herramienta nativa de lectura de fuente de Sites disponible en esta sesión. La ausencia de esa herramienta **no significa** que la fuente sea irrecuperable: v53 ya se recuperó por acceso nativo anteriormente. No se hizo comparación de despliegue en esta auditoría.

## Cambio frente a 10:13 SV
- SQL `succeeded`: **4,135 → 4,190** (+55).
- Recibos: **3,392 → 3,447** (+55); verificados **3,386 → 3,441** (+55).
- `network_error`: **5 → 5**. `site_status=done`: **9 → 9**. Trabajos Site **60/2/3/0**, sin variación. No hay evidencia de entrega nueva ni regresión nueva.

## Pendientes NO aprobados ni certificados
1. Comparación **nativa** de fuente, versión, URL y configuración del Site efectivamente desplegado con la fuente histórica y GitHub. Preservar fuente vigente; no activar v54.
2. Pruebas dinámicas **aisladas** de concurrencia, locks, idempotencia, pausas, `not_before`, reintentos, recuperación persistente y fallback. No confundir hashes/índices con pruebas dinámicas.
3. Diagnóstico causal de cinco `network_error`, incluido timeout de 55 s del 31-10 a las 08:57 SV.
4. Pruebas E2E sintéticas de seis agentes con recibos operativos, claramente separadas de aceptación final con cliente real, que sigue pendiente.

**Acciones realizadas:** lecturas de Supabase, Site, GitHub, logs y respaldo; solo escritura de este documento de auditoría en GitHub. **Sin** cambios de producción, modelos, ejecutores, cuotas, `not_before`, jobs, cron, envíos, pagos o contactos. **Punto 4 permanece cerrado provisionalmente, sin certificación.**
