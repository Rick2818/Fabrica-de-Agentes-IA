# Punto 4 — auditoría de continuidad, 2026-10-31 08:16 SV

## Estado rector
**CERRADO PROVISIONALMENTE, SIN CERTIFICACIÓN.** Alcance exclusivo de Fábrica de Agentes IA, Site `appgprj_6adbf0c05a0c8191b2ca585b76f5e862`, repositorio `Rick2818/Fabrica-de-Agentes-IA` y Supabase `udispwzwrebjkanudcoy`. No reabrir por falta de cliente real. No confundir con estación 4 ni issue #4. No se ejecutaron pruebas sintéticas nuevas, cambios de código, despliegues, gastos, correos, disparos manuales ni alteraciones de cuotas/fechas. Se preserva la fuente v53 recuperada (commit `5be977154cc15c9511787d22e28b7367e6f00467`, 122 pruebas históricas) y no se activó v54 guardada.

## Evidencia de lectura directa
- **Supabase Cron, corte ~14:15 UTC:** proyecto ACTIVE_HEALTHY. Un solo `cron.job`: id=1, nombre `fabrica-queue`, expresión `* * * * *`, activo, comando `select private.fabrica_scheduler_tick();`. Configuración privada: `enabled=true`, `not_before=NULL`, `last_error=NULL`. `cron.job_run_details`: **4,018** ejecuciones `succeeded`, cero con otro estado en el histórico consultado. `succeeded` SQL no significa trabajo `done`.
- **Recibos Supabase:** **3,280** filas, **3,275** verificadas, **9** `site_status=done` históricos, **4** `error_code=network_error` históricos. Desglose: `idle=3258`, `done=9`, `waiting=4`, `error=2`, `quota=1`, `busy=1`, estado nulo=5 (cuatro network_error y uno reciente aún sin conciliar). Última hora consultada: 60 recibos, 59 verificados, cero `done`, cero errores. Ningún nuevo trabajo funcional completado.
- **Conciliación cruzada con Site:** ciclo `a12e7e52-790b-436d-b6f6-a485c502f70d` (14:15 UTC) aparece en la secuencia del Site y fue verificado en SQL a las 14:16 UTC, HTTP 200, `verified=true`, `site_status=idle`. El siguiente `c7d79ebb-37a1-4e72-8fbb-28952e6c72db` (14:16 UTC) consta como `idle` en el Site, pero al corte aún no estaba conciliado en SQL. Ninguno acredita entrega. No se forzó tick.
- **Idempotencia:** 0 UUID duplicados, 0 request_id duplicados, 0 recibos no verificados con más de 3 minutos sin error. Índices únicos `fabrica_scheduler_receipts_pkey(cycle_id)` y `fabrica_scheduler_receipts_request_id_key(request_id)` presentes.
- **SQL estático:** MD5 `fabrica_scheduler_tick=7fb25848caa91dc78eb0f469659f691d`, `fabrica_scheduler_reconcile=78a1057460b103ae1cddfb5d5e0339f0` (iguales al control anterior). `tick` contiene `pg_try_advisory`, `FOR UPDATE` y `not_before`; `reconcile` contiene `not_before` y `verified`. Esto acredita presencia de mecanismos, **no** pruebas dinámicas de concurrencia o recuperación.
- **Site, conector operativo `agent_status`:** 65 trabajos: **60 done, 2 failed históricos, 3 cancelled, 0 pendientes**; sin leases activos ni reintentos vencidos visibles. `health.autonomy.primary.recent=true`, último `supabase_runner.status=idle`, `pending=0`, `next_at=NULL`, cuota 0/20. Estado de modelo reportado: principal `gemini-2.5-flash` y backup `gemini-2.5-flash-lite` con probes sintéticos históricos HTTP 404; tercero `gemini-3.5-flash-lite` con probe HTTP 200. No se repitieron probes ni se acredita disponibilidad universal de los tres.
- **GitHub:** `AGENTS.md` leído. Se leyeron los 7 workflows actuales; **ninguno contiene `on.schedule`**. `agent-runner.yml` es `workflow_dispatch` manual; `push` y `pull_request` son gates de prueba, no programación de cola. El `SITE_ORIGIN` del runner manual (`agente-ricardo-revision-rick.glassybell1025.chatgpt.site`) difiere de la URL de despliegue anotada para v58 (`agente-ricardo-revision-rick.rick271711.chatgpt.site`). Se requiere cotejo nativo del despliegue vigente antes de cambiarla o usar runner manual.
- **Respaldo horario:** `Automations.peek` confirmó `is_enabled=true` para `6adbf94d28e8819189c0516c6068457a`, último registro `2026-10-31T14:06:42Z` con `recorded_status=no_update`. No se lanzó respaldo competidor.
- **Logs:** ventana 12:00–14:14:24 UTC: 321 `postgres_logs`, 6 `pgbouncer_logs`; filtro textual de `error`, `timeout` o `failed` en `event_message` de postgres sin coincidencias. Filtro limitado; no demuestra ausencia general de fallos.
- **Errores de transporte históricos:** `network_error` a 2026-10-30 00:38, 03:53, 05:17 y 05:54 UTC; causa raíz no acreditada.

## Variación frente al control 07:09 SV
- SQL `succeeded`: **3,952 → 4,018** (+66).
- Recibos: **3,214 → 3,280** (+66); verificados **3,209 → 3,275** (+66).
- `done` histórico **9 → 9**; `network_error` **4 → 4**; Site **60 done / 2 failed / 3 cancelled / 0 pendientes**, sin cambio.
- Sin regresión nueva confirmada ni entrega funcional nueva.

## Pendientes — expresamente NO aprobados
1. Comparar **fuente nativa** del Site efectivamente desplegado, versiones, URL y selección de modelos con el repositorio sin reemplazar la fuente vigente. El acceso nativo a Sites no se ejerció en este control; la fuente v53 sí fue recuperada anteriormente.
2. Pruebas **dinámicas aisladas** de concurrencia/locks, reintentos, idempotencia, pausa, `not_before`, recuperación persistente y fallback. No marcar como aprobadas por inspección SQL o probes históricos.
3. Causa raíz de los cuatro `network_error` históricos.
4. E2E de autonomía con recibos operativos verificables para los seis agentes y, separadamente, aceptación final por cliente real. `done` de texto y simulaciones no equivalen a fabricación/entrega.

**Acción:** auditoría de solo lectura y registro durable. Sin cambios a producción, ejecutor principal, respaldo, cron, cuota, Site o trabajos. Punto 4 permanece cerrado provisionalmente, sin certificación.
