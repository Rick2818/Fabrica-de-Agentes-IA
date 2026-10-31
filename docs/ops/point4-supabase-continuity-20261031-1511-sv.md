# Fábrica de Agentes IA — Punto 4 · Auditoría de continuidad (2026-10-31 15:11 SV)

## Estado rector
**CERRADO PROVISIONALMENTE, SIN CERTIFICACIÓN** (decisión del 29-10-2026). Auditoría de solo lectura, sin cliente real, sin ejecutar ticks, sin modificar cuota, fechas, cola, producción ni versiones. Proyecto Site `appgprj_6adbf0c05a0c8191b2ca585b76f5e862`; repositorio `Rick2818/Fabrica-de-Agentes-IA`. Este punto no es la estación 4 ni el issue #4.

## Fuentes consultadas y corte
- Consulta SQL directa Supabase `udispwzwrebjkanudcoy`, corte `2026-10-31 21:11:05 UTC` (15:11:05 El Salvador), `cron.job`, `cron.job_run_details`, `private.fabrica_scheduler_receipts`, metadatos de funciones e índices de duplicación por agrupación.
- MCP conectado Fábrica `agent_status`: cola, `health.supabase_runner`, `health.autonomy`, cuota, modelos, notas y recibos de ciclos.
- GitHub API: `AGENTS.md`, siete archivos actuales de `.github/workflows/` en `main`; HEAD anterior al informe `45039d3547e3dafce178853f9c4a85f3e5ae4dd2`.
- Automatización de respaldo `6adbf94d28e8819189c0516c6068457a`: habilitada; última ejecución registrada `2026-10-31T20:50:22.892688Z`, estado `no_update`. No equivale a entrega de trabajo.
- Logs unificados Supabase: intervalo `2026-10-31T20:00:00Z` a `21:12:00Z`: 172 registros `postgres_logs`, tres `pgbouncer_logs`; filtro de texto ERROR/timeout en `postgres_logs` sin coincidencias. No se interpreta como ausencia de todos los errores de transporte.

## Resultado comprobado
- Un único cron activo en el proyecto: `jobid=1`, `jobname=fabrica-queue`, `schedule=* * * * *`, comando `select private.fabrica_scheduler_tick();`. No se invocó.
- `cron.job_run_details`: **4,434** ejecuciones con `status=succeeded`; último `runid=4434`, `2026-10-31T21:11:00Z`. El éxito SQL no prueba `done` del Site.
- `private.fabrica_scheduler_receipts`: **3,691** recibos, **3,685** `verified=true`, **5** `network_error` históricos, **1** ciclo pendiente de conciliación en el corte. Distribución: `idle=3668`, `done=9`, `waiting=4`, `error=2`, `busy=1`, `quota=1`, `network_error=5`, pendiente=1. Ningún `done` nuevo desde el control de 14:15.
- Ciclo conciliado `1bfde648-25ce-4502-975e-d277ec0d62f8`, programado `21:10:00Z`, `request_id=3691`, HTTP 200, `verified=true`, `site_status=idle`, comprobado `21:11:00Z`. El MCP del Site también reportó el mismo ciclo `idle`.
- Ciclo posterior `0edc7d31-23ff-4890-b78b-aa01bd769e8f`, programado `21:11:00Z`, `request_id=3692`: MCP Site `idle`; recibo SQL aún sin `checked_at`, HTTP ni verificación al corte. No marcar como verificado antes de conciliar.
- Duplicados SQL: **0** UUID de ciclo duplicados, **0** `request_id` duplicados, **0** recibos sin `checked_at` vencidos >3 minutos y sin error registrado.
- MCP Site: **60** trabajos `done`, **2** `failed` históricos, **3** `cancelled`, **0** pendientes. Cuota **0/20**. `health.supabase_runner.status=idle`, `health.autonomy.primary.recent=true`; sin `next_at` diferido. No se añadieron trabajos.
- Las funciones `private.fabrica_scheduler_tick` y `private.fabrica_scheduler_reconcile` conservan hashes MD5 `7fb25848caa91dc78eb0f469659f691d` y `78a1057460b103ae1cddfb5d5e0339f0`. Inspección estática: referencias a `not_before` en ambas; `advisory` en tick y `verified` en reconcile. No equivale a prueba dinámica de locks o recuperación.
- GitHub: **7/7** workflows leídos. Ninguno tiene evento `schedule`. `agent-runner.yml` únicamente `workflow_dispatch`; los workflows de CI sí pueden tener `push`/`pull_request`, que no son un segundo cron.
- Los cinco `network_error` siguen históricos; el último fue `2026-10-31T14:57:00Z` (08:57 SV). No apareció otro en el período observado.

## Brechas y precauciones
- La fuente original del Site v53 recuperada en `5be977154cc15c9511787d22e28b7367e6f00467` y sus 122 pruebas aprobadas son **evidencia histórica**. El MCP conserva una nota de despliegue v58 `appgdep_6ae3cfc470ac819191fb9c00a7034887`, fuente `207466f651085ed04ec5ed0cc3cdc1628b17f3a6`, pero **no se obtuvo en esta pasada lectura nativa de Sites de la fuente actualmente desplegada**. No inferir equivalencia con GitHub ni desplegar v54.
- Las comprobaciones históricas de los modelos `gemini-2.5-flash` y `gemini-2.5-flash-lite` dieron HTTP 404; la tercera ruta `gemini-3.5-flash-lite` dio HTTP 200 en prueba sintética. No se repitieron pruebas de proveedor ni se alteró cuota.
- Persisten pendientes: inspección nativa del Site vigente y comparación segura con `AGENTS.md` (identidades Alma=Química/Farmacia, Lía=Mercadeo; prácticas históricas difieren), pruebas aisladas dinámicas de concurrencia/locks/reintentos/idempotencia/pausa/recuperación/fallback, causa raíz de cinco errores de transporte y recorrido E2E con recibos operativos de los seis agentes. No confundir ejercicios analíticos con fabricación/entrega.
- La aceptación final requiere cliente real. Las pruebas sintéticas no sustituyen esa aceptación; no reabrir cierre administrativo por esa ausencia.

## Cambios y alcance
Solo se creó este documento de auditoría. **No se invocó** `fabrica_scheduler_tick()`, no se creó otro ejecutor, no se alteró cuota/`not_before`, no se contactó a terceros, no se enviaron correos ni se cambió código, Site, versiones o ejecutores. El principal y respaldo quedan habilitados.
