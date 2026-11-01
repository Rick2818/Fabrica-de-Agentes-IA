# Fábrica de Agentes IA — Punto 4 · Control 2026-11-01 16:14 CST

**Estado rector: CERRADO PROVISIONALMENTE, SIN CERTIFICACIÓN.** Auditoría de solo lectura, excepto este registro. No se creó ejecutor, no se forzó tick, no se modificó cola, cuota, `not_before`, modelos, permisos, Site ni producción. La v54 no se desplegó en esta revisión.

## Fuentes y corte
- Supabase `udispwzwrebjkanudcoy`: SQL de corte **2026-11-01 22:14:20.490152 UTC**; tablas `cron.job_run_details`, `private.fabrica_scheduler_receipts`, `private.fabrica_scheduler_config`, funciones SQL, índices y logs.
- Site: lectura mediante el complemento nativo `Fábrica de Agentes IA.agent_status`, incluyendo cola, modelos, cuotas y recibos de ciclo. **No se pudo comprobar desde la ficha nativa de Sites la versión efectiva desplegada** ni sus URL; el acceso al navegador conectado tampoco estuvo disponible. Esto no invalida la recuperación previa de fuente v53 informada por Rick.
- GitHub: `Rick2818/Fabrica-de-Agentes-IA`, `AGENTS.md`, los siete workflows de `.github/workflows` y `main` (previo a este reporte: `6ef42b016f4e117796f72f40322243cc4a63cbef`).
- Respaldo existente: `Automations.peek` del ID `6adbf94d28e8819189c0516c6068457a`: `is_enabled=true`, última ejecución registrada `no_update` el 2026-11-01 21:07:47–21:07:49 UTC; no se ejecutó manualmente.

## Conciliación del ejecutor principal
- Supabase project `ACTIVE_HEALTHY`. `cron.job`: `jobid=1`, `fabrica-queue`, `* * * * *`, `active=true`, `select private.fabrica_scheduler_tick();`.
- `cron.job_run_details`: **5,937** ejecuciones SQL al corte, todas `succeeded` según agregado anterior de 5,936 y la siguiente ejecución; esto **no** prueba trabajo funcional `done`.
- `private.fabrica_scheduler_receipts`: **5,194** recibos, **5,188** `verified=true`; cinco errores `network_error` históricos y un ciclo aún sin conciliar. En una consulta inmediatamente anterior, desglose histórico de 5,193 recibos: 5,170 `idle`, 9 `done`, 4 `waiting`, 2 `error`, 1 `quota`, 1 `busy`, 5 `network_error` y 1 pendiente.
- Último UUID conciliado: `87940cc8-2ead-405f-bcf4-8663db585d60` (22:13 UTC): `http_status=200`, `verified=true`, `site_status=idle`, `error_code=NULL`, conciliado a las 22:14:00 UTC.
- UUID siguiente: `5a3b6810-ed2b-4790-92ed-00253833f56b` (22:14 UTC), mostrado `idle` en el Site, **sin `checked_at` SQL al corte**; no se marcó aprobado. El ciclo de un minuto antes sí quedó conciliado.
- Ventana reciente de 90 minutos al corte previo: 90 recibos verificados `idle`, cero `done` nuevos. Últimas cuatro horas consultadas: cero `done` y cero `error_code` nuevos.
- Integridad: cero `cycle_id` duplicados, cero `request_id` duplicados y cero recibos sin `checked_at` con más de 3 minutos de antigüedad. Cinco `network_error` históricos, sin incremento.
- Configuración: `enabled=true`, `not_before=NULL`, `last_error=NULL`. Código SQL leído: `pg_try_advisory_xact_lock`, `FOR UPDATE`, verificación de identidad/UUID/estado de recibo, reconciliación con `net._http_response`, `not_before` y recuperación tras error. Índices únicos en `cycle_id`, `request_id`, `singleton`. **Solo inspección estática, no certificación de concurrencia/reintento en ejecución.**
- Logs Supabase: entre 20:00 y 22:15 UTC el filtro textual de `postgres_logs` por error/fatal/exception no encontró filas. No sustituye monitoreo de respuesta funcional.

## Cola, agentes y GitHub
- Site: 65 trabajos, 60 `done`, 2 `failed` históricos, 3 `cancelled`, 0 pendientes. Cuota `0/20`. Último ciclo principal `supabase-cron` con `status=idle`, `pending=0`, sin `next_at`.
- Se comprobaron los seis IDs `synthetic-six-20261028-{leo,mila,vera,alma,nico,lia}`: todos `done` con evidencia de modelo y `context_mode=isolated`. Son **prácticas analíticas**; no recibos de fabricación, entrega, OAuth ni aceptación de cliente. No se lanzaron pruebas sintéticas nuevas.
- Comprobaciones históricas de modelos: `gemini-2.5-flash` primario HTTP 404 y `gemini-2.5-flash-lite` respaldo HTTP 404, ambos `verified=false`; tercero `gemini-3.5-flash-lite` HTTP 200 sintético histórico. Fallback completo no demostrado.
- `AGENTS.md` define Leo/Ventas, Mila/Servicio al cliente, Vera/Finanzas, Alma/Química y farmacia, Nico/Logística, Lía/Mercadeo. Algunas fichas históricas de Site etiquetan Alma y Lía de otra forma: cotejar con fuente activa antes de tocar identidades.
- Siete workflows GitHub leídos: ninguno contiene `schedule`. `agent-runner.yml` solo `workflow_dispatch`; los demás usan `workflow_dispatch`, `push` o `pull_request`. No hay evidencia de GitHub como programador actual.
- Fuente v53: Rick reportó commit `5be977154cc15c9511787d22e28b7367e6f00467` y 122 pruebas de servidor en worktree recuperado. La consulta de ese SHA contra la API de **este repositorio GitHub** devolvió 422; esto **no** demuestra que la fuente nativa del Site sea inaccesible ni niega las 122 pruebas históricas. El despliegue efectivo no se cotejó.

## Pendientes sin certificar
1. Verificar mediante acceso nativo de Sites versión efectiva, URL y correspondencia con la fuente recuperada, sin activar v54.
2. Pruebas dinámicas aisladas de locks concurrentes, idempotencia, pausas, reintentos, recuperación, cuota y `not_before`, sin alterar cola real ni forzar cron.
3. Diagnosticar los HTTP 404 de Gemini primario/respaldo y demostrar fallback extremo a extremo con autorización y cuota respetadas.
4. Recibos E2E de aprobación, fabricación, aprovisionamiento y entrega; aceptación final de cliente real cuando exista.
5. Investigar causa de cinco errores de red históricos y discrepancia documental de Alma/Lía, preservando recibos y fuente vigente.

**Resultado:** sin regresión nueva detectada en la ventana consultada; sin nuevas entregas funcionales ni cambios operativos. Punto 4 sigue cerrado provisionalmente y sin certificación.
